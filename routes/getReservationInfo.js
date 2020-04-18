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
    path: '/get_reservation_info',
    config: {
        validate: {
            payload: {
                reservation_id: Joi.number().integer().required()
            }        
        },
        handler: getReservationInfo,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
};

async function getReservationInfo (request, reply) {
    let reservation_id = request.payload.reservation_id;

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

	try {		
		await client.query('BEGIN') // Start transaction

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

        await client.query("COMMIT");

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

        var reservation_info = {};
        reservation_info['reservation_id'] = tools.rows[0].confirmation_number;

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
            var daily_rental_price = Math.ceil(15 * value.purchase_price) / 100;
            var deposit_price = Math.ceil(40 * value.purchase_price) / 100;

            /*	
                Note: ‘one day’ is defined as a 24-hour increment: 12:00:00 AM-11:59:59 PM for any given date. 
                All tools are only available for daily rental (no hourly option).
            */
            var days_rented = (parseInt(value.end_date - value.start_date) / (24*3600*1000)) + 1;

            total_rental_price += Math.round(daily_rental_price * days_rented * 100) / 100;
            total_deposit_price += deposit_price;

            /* 
                Tool description = [power-src] + [sub-option] + [sub-type]
                If power source is manual, leave it out, since it is inferred
            */
            var toolDesc = '';
            if (value.power_source != 'Manual') {
                toolDesc += value.power_source + ' ';
            }
            toolDesc = toolDesc + value.sub_option + ' ' + value.sub_type;
            tool_names.push(toolDesc);
        });

        /* display prices as strings with 2 decimal places */
        reservation_info['total_deposit_price'] = total_deposit_price.toFixed(2);
        reservation_info['total_rental_price'] = total_rental_price.toFixed(2);
        reservation_info['tools'] = tool_names;

		return reply(JSON.stringify(reservation_info, null, 4)).code(200);
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        return reply("Unable to retrieve reservation info").code(400);
    } finally { 
        await client.release();
    }
}

/*
    sample request #1:
    dates from 2017-11-24 to 2017-11-28
    purchase price of each at $1.24
    {
        "reservation_id": 7
    }

    sample response #1:
    {
        "reservation_id": 7,
        "customer_name": "HH'e-i Day",
        "total_deposit_price": "1.00",
        "total_rental_price": "1.90",
        "tools": [
            "Hex Screwdriver",
            "Hex Screwdriver"
        ]
    }

    sample request #2:
    dates from 2017-11-13 to 2017-11-18
    purchase price of each at $1.24
    {
        "reservation_id": 5
    }

    sample response #2:
    {
        "reservation_id": 5,
        "customer_name": "Alexa Hi There",
        "total_deposit_price": "0.50",
        "total_rental_price": "1.14",
        "tools": [
            "Hex Screwdriver"
        ]
    }

    above examples are Manual tools
    if tool is not manual, it will look like this: "Electric Hammer Drill"
*/