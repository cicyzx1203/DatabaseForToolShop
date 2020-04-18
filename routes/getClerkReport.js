const {Pool} = require('pg');

const pool = new Pool({
    user: 'gatechuser',
    host: 'localhost',
    database: 'cs6400_fa17_team036',
    password: 'gatech123',
    port: 5432,
})

// ==================== Route Configurations =========================

module.exports = {
    method: 'GET',
    path: '/clerk_report',
    config:{
        handler: getClerkReports,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }

};

async function getClerkReports (request, reply) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start transaction

        await client.query('DROP VIEW IF EXISTS pickup_info;');
        var create_pickup_view = 'CREATE VIEW pickup_info ' +
                                 'AS SELECT clerk_id_pickup, COUNT(DISTINCT(confirmation_number)) AS total_pickups ' +
                                 'FROM Reservation ' +
                                 'WHERE clerk_id_pickup IS NOT NULL AND date_trunc(\'month\', start_date) = date_trunc(\'month\', current_date) ' +
                                 'GROUP BY clerk_id_pickup;';
        await client.query(create_pickup_view);

        await client.query('DROP VIEW IF EXISTS dropoff_info;');
        var create_dropoff_view = 'CREATE VIEW dropoff_info ' +
                                  'AS SELECT clerk_id_dropoff, COUNT(DISTINCT(confirmation_number)) AS total_dropoffs ' +
                                  'FROM Reservation ' +
                                  'WHERE clerk_id_dropoff IS NOT NULL AND date_trunc(\'month\', end_date) = date_trunc(\'month\', current_date) ' +
                                  'GROUP BY clerk_id_dropoff;';
        await client.query(create_dropoff_view);

        await client.query("COMMIT");

        var get_clerk_reports_query = 'SELECT * ' +
                                      'FROM Clerk ' +
                                      'FULL OUTER JOIN pickup_info ON clerk_id = clerk_id_pickup ' +
                                      'FULL OUTER JOIN dropoff_info ON clerk_id = clerk_id_dropoff;';
        const clerk_reports = await client.query(get_clerk_reports_query);

        var clerk_reports_list = [];

        clerk_reports.rows.forEach(function(value) {
            var clerk_report = {};
            clerk_report['clerk_id'] = value.clerk_id;
            clerk_report['first_name'] = value.first_name;
            clerk_report['middle_name'] = value.middle_name ? value.middle_name : '';
            clerk_report['last_name'] = value.last_name;
            clerk_report['email'] = value.email;
            var hire_date = value.date_of_hire.toISOString().slice(0,10).split('-'); // ie. 2017-11-26
            clerk_report['date_of_hire'] = hire_date[1] +'/'+ hire_date[2] +'/'+ hire_date[0];

            var pickups_int = value.total_pickups ? parseInt(value.total_pickups) : 0;
            var dropoffs_int = value.total_dropoffs ? parseInt(value.total_dropoffs) : 0;
            clerk_report['pick_ups_handled'] = pickups_int;
            clerk_report['drop_offs_handled'] = dropoffs_int;

            clerk_report['total_number'] = pickups_int + dropoffs_int;

            clerk_reports_list.push(clerk_report);
        });

        clerk_reports_list.sort(function(a, b) {
            return b['total_number'] - a['total_number'];
        });

        return reply(JSON.stringify(clerk_reports_list, null, 4)).code(200);
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        return reply("Unable to generate clerk report.").code(500);
    } finally { 
        await client.release();
    }
}

/*
    Sample output:
    [
        {
            "clerk_id": 3,
            "first_name": "Steve",
            "middle_name": "Bob",
            "last_name": "Adam",
            "email": "clerk2a@store.com",
            "date_of_hire": "11/23/2017",
            "pick_ups_handled": 2,
            "drop_offs_handled": 4,
            "total_number": 6
        },
        {
            "clerk_id": 5,
            "first_name": "Steve",
            "middle_name": "B",
            "last_name": "Adam",
            "email": "clerk3a@store.com",
            "date_of_hire": "11/23/2017",
            "pick_ups_handled": 3,
            "drop_offs_handled": 1,
            "total_number": 4
        },
        {
            "clerk_id": 1,
            "first_name": "Steve",
            "middle_name": "Bob",
            "last_name": "Adam",
            "email": "clerk1a@store.com",
            "date_of_hire": "11/23/2017",
            "pick_ups_handled": 2,
            "drop_offs_handled": 1,
            "total_number": 3
        },
        {
            "clerk_id": 6,
            "first_name": "Jennifer",
            "middle_name": "K",
            "last_name": "Lee",
            "email": "clerk4a@store.com",
            "date_of_hire": "11/24/2017",
            "pick_ups_handled": 0,
            "drop_offs_handled": 0,
            "total_number": 0
        },
        {
            "clerk_id": 7,
            "first_name": "John",
            "middle_name": "",
            "last_name": "Lee",
            "email": "clerk5a@store.com",
            "date_of_hire": "11/26/2017",
            "pick_ups_handled": 0,
            "drop_offs_handled": 0,
            "total_number": 0
        }
    ]
*/