const {Pool} = require('pg');

const pool = new Pool({
    user: 'gatechuser',
    host: 'localhost',
    database: 'cs6400_fa17_team036',
    password: 'gatech123',
    port: 5432,
})

module.exports = [{
    method: 'GET',
    path: '/reservations_to_pick_up',
    config:{
        handler: getReservationsToPickUp,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }

}];

async function getReservationsToPickUp (request, reply) {
    const client = await pool.connect();

	try {	
        /*	
            Note: ‘one day’ is defined as a 24-hour increment: 12:00:00 AM-11:59:59 PM for any given date. 
            All tools are only available for daily rental (no hourly option).
        */
        var get_reservations_to_pick_up = 'SELECT DISTINCT(confirmation_number) as reservation_id, ' +
                                          'cust.username, cust.customer_id, ' +
                                          'to_char(start_date, \'YYYY-MM-DD HH24:MI:SS\') as start_date, ' +
                                          'to_char((end_date::date + interval \'1 day - 1 sec\'), \'YYYY-MM-DD HH24:MI:SS\') as end_date ' + 
                                 		  'FROM Reservation AS res ' +
                                		  'INNER JOIN Customer AS cust on res.customer_id = cust.customer_id ' +
                                		  'WHERE clerk_id_pickup IS NULL;';

 		const list = await client.query(get_reservations_to_pick_up);

		reply(JSON.stringify(list.rows, null, 4)).code(200);
    } catch (error) {
        console.log(error);
        reply("Unable to fetch list of reservations for pick up.").code(500);
    } finally {
        await client.release();
    }
}

/* 
    sample response:
    [
        {
            "reservation_id": 7,
            "username": "3h.e-i'd.a_.y.",
            "customer_id": 5,
            "start_date": "2017-11-24 00:00:00",
            "end_date": "2017-11-28 23:59:59"
        },
        {
            "reservation_id": 8,
            "username": "h.e-i'd.a_.y.81818",
            "customer_id": 2,
            "start_date": "2017-11-26 00:00:00",
            "end_date": "2017-11-30 23:59:59"
        },
        {
            "reservation_id": 9,
            "username": "h.e-i'd.a_.y.",
            "customer_id": 3,
            "start_date": "2017-11-27 00:00:00",
            "end_date": "2017-12-01 23:59:59"
        },
        {
            "reservation_id": 12,
            "username": "h.e-i'69d.a_.y.556",
            "customer_id": 1,
            "start_date": "2018-11-10 00:00:00",
            "end_date": "2018-11-11 23:59:59"
        },
        {
            "reservation_id": 13,
            "username": "h.e-i'd.a_.y.81818",
            "customer_id": 2,
            "start_date": "2018-11-12 00:00:00",
            "end_date": "2018-11-13 23:59:59"
        }
    ]
*/