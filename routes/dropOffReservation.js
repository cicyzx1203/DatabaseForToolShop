const {Pool} = require('pg');

const pool = new Pool({
    user: 'gatechuser',
    host: 'localhost',
    database: 'cs6400_fa17_team036',
    password: 'gatech123',
    port: 5432,
})

const Joi = require('joi');

// ==================== Route Configurations =========================

module.exports = {
    method: 'POST',
    path: '/drop_off_reservation',
    config: {
        validate: {
            payload: {
                clerk_id: Joi.number().integer().required(),
                reservation_id: Joi.number().integer().required()
            }
        },
        handler: dropOffReservation,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
};

async function dropOffReservation (request, reply) {
    let reservation_id = request.payload.reservation_id;
    let clerk_id = request.payload.clerk_id;
    var clerk_full_name;

    const client = await pool.connect()

    const check_reservation_existence = 'SELECT * FROM Reservation WHERE confirmation_number = $1';
    try {
        const res_results = await client.query(check_reservation_existence, [reservation_id]);
        if (res_results.rowCount == 0) {
            throw "Reservation doesn't exist.";
        }
    } catch (error) {
        console.log(error);
        await client.release();
        return reply(error).code(400);
    }

    const check_clerk_existence = 'SELECT * FROM Clerk WHERE clerk_id = $1';
    try {
        const clerk_results = await client.query(check_clerk_existence, [clerk_id]);
        if (clerk_results.rowCount == 0) {
            throw "Clerk doesn't exist.";
        }

        if (clerk_results.rows[0].middle_name) {
            clerk_full_name = clerk_results.rows[0].first_name + ' ' + clerk_results.rows[0].middle_name + ' ' + clerk_results.rows[0].last_name;
        } else {
            clerk_full_name = clerk_results.rows[0].first_name + ' ' + clerk_results.rows[0].last_name;
        }
    } catch (error) {
        console.log(error);
        await client.release();
        return reply(error).code(400);
    }

    const check_reservation_status = 'SELECT * FROM Reservation WHERE confirmation_number = $1 ' +
                                     'AND clerk_id_pickup IS NOT NULL AND clerk_id_dropoff IS NULL';
    try {
        const res_dropoff_results = await client.query(check_reservation_status, [reservation_id]);
        if (res_dropoff_results.rowCount == 0) {
            throw "Reservation cannot be dropped off.";
        }
    } catch (error) {
        console.log(error);
        await client.release();
        return reply(error).code(400);
    }

    try {
        await client.query('BEGIN') // Start transaction

        var reservation_info = {};
        reservation_info['reservation_id'] = reservation_id;
        reservation_info['clerk_name'] = clerk_full_name;

        /* get customer id */
        const get_customer_id = 'SELECT DISTINCT(customer_id) FROM Reservation WHERE confirmation_number = $1';
        
        const customer_id_result = await client.query(get_customer_id, [reservation_id]);
        if (customer_id_result.rowCount == 0) {
            throw "Could not get customer ID associated with reservation.";
        }

        let customer_id = customer_id_result.rows[0].customer_id;

        /* 
            START 
            get other info for final receipt 
        */
        await client.query('DROP VIEW IF EXISTS customer_info;');
		var create_cust_info_view = 'CREATE VIEW customer_info ' +
									'AS SELECT customer_id, first_name, middle_name, last_name ' +
									'FROM Customer;';
        await client.query(create_cust_info_view);

		await client.query('DROP VIEW IF EXISTS tool_info;');
        var create_tool_info_view = 'CREATE VIEW tool_info ' +
									'AS SELECT tool_id, power_source, sub_option, sub_type, purchase_price ' +
									'FROM Tool;';
		await client.query(create_tool_info_view);

        var get_res_report_query = 'SELECT res.confirmation_number, tool_info.tool_id, tool_info.power_source, tool_info.sub_option, ' +
						           'tool_info.sub_type, tool_info.purchase_price, customer_info.first_name, ' +
								   'customer_info.middle_name, customer_info.last_name, res.start_date, res.end_date ' +
						 		   'FROM Reservation AS res ' +
						 		   'INNER JOIN customer_info ON customer_info.customer_id = res.customer_id ' +
						 		   'INNER JOIN tool_info ON res.tool_id = tool_info.tool_id ' +
						 		   'WHERE res.confirmation_number = $1';

 		const tools = await client.query(get_res_report_query, [reservation_id]);

        if (tools.rowCount == 0) {
            throw "This reservation has no tools attached.";
        }

        var full_name;
        if (tools.rows[0].middle_name) {
            full_name = tools.rows[0].first_name + ' ' + tools.rows[0].middle_name + ' ' + tools.rows[0].last_name;
        } else {
            full_name = tools.rows[0].first_name + ' ' + tools.rows[0].last_name;
        }
        reservation_info['customer_name'] = full_name;

        /* 
            Daily rental prices are 15% of the original purchase price rounded up to nearest cent. 
            Deposit prices are 40% of the original purchase price rounded up to nearest cent.
            The rental price is calculated as the sum of the rental prices for all tools rented, 
            multiplied by the number of days over which they are rented. 
            The total deposit price is the sum of the deposits required for each individual tool.
        */
        var total_rental_price = 0;
        var total_deposit_price = 0;

        var tool_names = [];

        tools.rows.forEach(function(value) {
            var tool_details = {};
            tool_details['tool_id'] = value.tool_id;

            var daily_rental_price = Math.ceil(15 * value.purchase_price) / 100;
            var deposit_price = Math.ceil(40 * value.purchase_price) / 100;

            /*	
                Note: ‘one day’ is defined as a 24-hour increment: 12:00:00 AM-11:59:59 PM for any given date. 
                All tools are only available for daily rental (no hourly option).
            */
            var days_rented = (parseInt(value.end_date - value.start_date) / (24*3600*1000)) + 1;
            var tool_rental_price = Math.round(daily_rental_price * days_rented * 100) / 100;

            total_rental_price += tool_rental_price;
            total_deposit_price += deposit_price;

            /* 
                Tool description = [power-src] + [sub-option] + [sub-type]
                If power source is manual, leave it out, since it is inferred
            */
            var toolDesc = '';
            if ((value.power_source).toLowerCase() != 'manual') {
                toolDesc += value.power_source + ' ';
            }
            toolDesc = toolDesc + value.sub_option + ' ' + value.sub_type;
            tool_details['tool_name'] = toolDesc;
            tool_details['deposit_price'] = deposit_price.toFixed(2);
            tool_details['rental_price'] = tool_rental_price.toFixed(2);

            tool_names.push(tool_details);
        });
        reservation_info['tools'] = tool_names;

        /* display prices as strings with 2 decimal places */
        reservation_info['total_deposit_price'] = total_deposit_price.toFixed(2);
        reservation_info['total_rental_price'] = total_rental_price.toFixed(2);

        /* total due (could be negative) is not included in json result - front end should calculate and display "Total Due:" or "Refund Due:" as necessary */ 

        /* 
            get other info for final receipt
            END 
        */
        
        /* finally set drop off clerk */
        const drop_off_reservation = 'UPDATE Reservation ' +
                                     'SET clerk_id_dropoff = $1 ' +
                                     'WHERE confirmation_number = $2;';

        let reservation_values = [clerk_id, reservation_id];

        await client.query(drop_off_reservation, reservation_values);

        await client.query("COMMIT"); // End transaction
        reply(JSON.stringify(reservation_info, null, 4)).code(200);
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        reply("Unable to drop off the reservation.").code(400);
    } finally { 
        await client.release();
    }
}

/*
    sample request:
    {
        "reservation_id": 14,
        "clerk_id": 5
    }

    sample response:
    total due (could be negative) is not included in JSON result - front end should calculate and display "Total Due:" or "Refund Due:" as necessary
    clerk_name isn't included in sample figure but not bad info to have if we want it since pick up and drop off clerk can be different
    {
        "reservation_id": 14,
        "clerk_name": "Steve B Adam",
        "customer_name": "Alexa Hi There",
        "tools": [
            {
                "tool_id": 6,
                "tool_name": "Rigid Straight",
                "deposit_price": "0.50",
                "rental_price": "1.33"
            },
            {
                "tool_id": 5,
                "tool_name": "Rigid Straight",
                "deposit_price": "0.50",
                "rental_price": "1.33"
            }
        ],
        "total_deposit_price": "1.00",
        "total_rental_price": "2.66"
    }
*/

