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
    path: '/pick_up_reservation',
    config: {
        validate: {
            payload: {
                clerk_id: Joi.number().integer().required(),
                reservation_id: Joi.number().integer().required(),
                cc_type: Joi.string().valid('New', 'Existing').required(),
                name_on_card: Joi.string().allow('').when('cc_type', { is: 'New', then: Joi.string().min(1).max(250).required() }),
                cc_num: Joi.string().allow('').when('cc_type', { is: 'New', then: Joi.string().min(14).required() }),
                expiration_month: Joi.string().allow('').when('cc_type', { is: 'New', then: Joi.required() }),
                expiration_year: Joi.string().allow('').when('cc_type', { is: 'New', then: Joi.required() }),
                cvc: Joi.string().allow('').when('cc_type', { is: 'New', then: Joi.string().min(3).max(3).required() })
            }
        },
        handler: pickUpReservation,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']}

    }
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeFirstLetterInWord(string) {
    return string.replace(/\w\S*/g, capitalizeFirstLetter);
}

async function pickUpReservation (request, reply) {
    let reservation_id = request.payload.reservation_id;
    let clerk_id = request.payload.clerk_id;
    let cc_type = request.payload.cc_type;
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
                                     'AND clerk_id_pickup IS NOT NULL';
    try {
        const res_pickup_results = await client.query(check_reservation_status, [reservation_id]);
        if (res_pickup_results.rowCount > 0) {
            throw "Reservation has already been picked up.";
        }
    } catch (error) {
        console.log(error);
        await client.release();
        return reply(error).code(400);
    }

    try {
        await client.query('BEGIN') // Start transaction

        var last_four_cc_digits;
        var reservation_info = {};
        reservation_info['clerk_name'] = clerk_full_name;

        /* get customer id */
        const get_customer_id = 'SELECT DISTINCT(customer_id) FROM Reservation WHERE confirmation_number = $1';
        
        const customer_id_result = await client.query(get_customer_id, [reservation_id]);
        if (customer_id_result.rowCount == 0) {
            throw "Could not get customer ID associated with reservation.";
        }

        let customer_id = customer_id_result.rows[0].customer_id;

        /* update and/or get last 4 digits of cc num */
        if (cc_type === 'New') {
            let name_on_card = capitalizeFirstLetterInWord(request.payload.name_on_card);
            let cc_num = request.payload.cc_num;
            let expiration_month = request.payload.expiration_month;
            let expiration_year = request.payload.expiration_year;
            let cvc = request.payload.cvc;

            last_four_cc_digits = cc_num.slice(-4);

            const update_credit_card = 'UPDATE Customer ' +
                                       'SET credit_card_name = $1, credit_card_number = $2, ' +
                                       'cvc = $3, exp_date_month = $4, exp_date_year = $5 ' +
                                       'WHERE customer_id = $6;';

            let credit_card_values = [name_on_card, cc_num, cvc,
                                      expiration_month, expiration_year, customer_id];

            await client.query(update_credit_card, credit_card_values);
        } else {
            const get_existing_cc = 'SELECT credit_card_number from Customer where customer_id = $1;';

            const cc_result = await client.query(get_existing_cc, [customer_id]);
            if (cc_result.rowCount == 0) {
                throw "Could not get existing credit card number for customer.";
            }
            
            last_four_cc_digits = (cc_result.rows[0].credit_card_number).slice(-4);
        }
        reservation_info['cc_num_end'] = last_four_cc_digits;

        /* 
            START 
            get other info for rental contract 
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
        reservation_info['start_date'] = tools.rows[0].start_date.toJSON().slice(0,10);
        reservation_info['end_date'] = tools.rows[0].end_date.toJSON().slice(0,10);

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

        /* 
            get other info for rental contract 
            END 
        */
        
        /* finally set pickup clerk */
        const pick_up_reservation = 'UPDATE Reservation ' +
                                    'SET clerk_id_pickup = $1 ' +
                                    'WHERE confirmation_number = $2;';

        let reservation_values = [clerk_id, reservation_id];

        await client.query(pick_up_reservation, reservation_values);

        await client.query("COMMIT"); // End transaction
        reply(JSON.stringify(reservation_info, null, 4)).code(200);
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        reply("Unable to pick up the reservation.").code(400);
    } finally { 
        await client.release();
    }
}

/*
    sample request #1:
    to use existing cc, fill in with random data (which won't be used) or empty strings
    {
        "reservation_id": 7,
        "clerk_id": 7,
        "cc_type": "Existing",
        "name_on_card": "Jesse Pinkman",
        "cc_num": "99999999643124",
        "expiration_month": "October",
        "expiration_year": "2020",
        "cvc": "123"
    }

    OR 

    {
        "reservation_id": 7,
        "clerk_id": 7,
        "cc_type": "Existing",
        "name_on_card": "",
        "cc_num": "",
        "expiration_month": "October",
        "expiration_year": "2020",
        "cvc": "12"
    }

    sample response #1:
    {
        "clerk_name": "John Lee",
        "cc_num_end": "1233",
        "customer_name": "HH'e-i Day",
        "start_date": "2017-11-24",
        "end_date": "2017-11-28",
        "tools": [
            {
                "tool_id": 1,
                "tool_name": "Hex Screwdriver",
                "deposit_price": "0.50",
                "rental_price": "0.95"
            },
            {
                "tool_id": 3,
                "tool_name": "Hex Screwdriver",
                "deposit_price": "0.50",
                "rental_price": "0.95"
            }
        ],
        "total_deposit_price": "1.00",
        "total_rental_price": "1.90"
    }

    sample request #2:
    {
        "reservation_id": 7,
        "clerk_id": 1,
        "cc_type": "New",
        "name_on_card": "Jesse Pinkman",
        "cc_num": "99999999643124",
        "expiration_month": "October",
        "expiration_year": "2020",
        "cvc": "123"
    }

    sample response #2:
    {
        "clerk_name": "Steve Bob Adam",
        "cc_num_end": "3124",
        "customer_name": "HH'e-i Day",
        "start_date": "2017-11-24",
        "end_date": "2017-11-28",
        "tools": [
            [
                1,
                "Hex Screwdriver",
                "0.50",
                "0.95"
            ],
            [
                3,
                "Hex Screwdriver",
                "0.50",
                "0.95"
            ]
        ],
        "total_deposit_price": "1.00",
        "total_rental_price": "1.90"
    }
*/

