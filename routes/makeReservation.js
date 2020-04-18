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
    path: '/make_reservation',
    config: {
        validate: {
            payload: {
                customer_id: Joi.number().integer().required(),
                start_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}/).required(),
                end_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}/).required(),
                tool_ids: Joi.array().items(Joi.number().integer()).min(1).max(10).unique()
            }        
        },
        handler: makeReservation,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
};

async function makeReservation (request, reply) {
    let customer_id = request.payload.customer_id;

    const client = await pool.connect()

    const cherk_customer_existence = 'SELECT * FROM Customer WHERE customer_id = $1;';
    try {
        const customer_results = await client.query(cherk_customer_existence, [customer_id]);
        if (customer_results.rowCount == 0) {
            throw "Customer doesn't exist.";
        }
    } catch (error) {
        console.log(error);
        await client.release();
        return reply(error).code(400);
    }

    var reservation_id = 0;
    try {
        const find_max_id = 'SELECT MAX(confirmation_number) AS reservation_id FROM Reservation;';
        const res_results = await client.query(find_max_id);
        reservation_id = res_results.rows[0].reservation_id + 1;
    } catch (error) {
        console.log(error);
        await client.release();
        return reply(error).code(400);
    }

    let start_date = request.payload.start_date;
    let end_date = request.payload.end_date;
    let tool_ids = request.payload.tool_ids;

    try {
        for (i = 0; i < tool_ids.length; i++) {
            /*
             * You clash with another reservation if your start date is in the middle of another reservation OR
             * when your start date is BEFORE another reservation BUT your end date is in the middle/past it.
             */
            var reservations_query = 'SELECT * FROM Reservation ' +
                                     'WHERE (($1::date >= start_date AND $2::date <= end_date) OR ' + 
                                     '($3::date < start_date AND $4::date >= start_date)) AND tool_id = $5;';

            let values = [start_date, start_date, start_date, end_date, tool_ids[i]];

            const clashes_results = await client.query(reservations_query, values);
            var isToolAvailable = (clashes_results.rowCount == 0);

            if (!isToolAvailable) {
                throw "The tool with tool ID " + tool_ids[i] + " isn't available for your dates.";
            }
        }
    } catch (error) {
        console.log(error);
        await client.release();
        return reply(error).code(400);
    }

    try {
        await client.query('BEGIN')

        const insert_tool_reservation = 'INSERT INTO Reservation(confirmation_number, tool_id, ' +
                                        'start_date, end_date, customer_id) ' +
                                        'VALUES($1, $2, $3::date, $4::date, $5);';

        for (i = 0; i < tool_ids.length; i++) {
            let values = [reservation_id, tool_ids[i], start_date, end_date, customer_id];
            await client.query(insert_tool_reservation, values);
        }

        await client.query("COMMIT");
        reply({"reservation_id":reservation_id}).code(200);
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        reply("Unable to make the reservation.").code(400);
    } finally { 
        await client.release();
    }
}

/*
    sample request:
    {
        "customer_id": 1,
        "start_date": "2017-11-17",
        "end_date": "2017-11-23",
        "tool_ids": [3, 1]
    }
*/