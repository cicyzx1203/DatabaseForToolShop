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
    path: '/customer_report',
	config: {
        handler: generateReport,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
	}

}];

async function generateReport (request, reply) {
  	const client = await pool.connect();

	try {		
		await client.query('BEGIN') // Start transaction

		await client.query('DROP VIEW IF EXISTS reservation_info;');

		var create_res_view = 'CREATE VIEW reservation_info' +
								' AS SELECT customer_id, COUNT(DISTINCT(confirmation_number))' +
								' AS total_reservations, COUNT(tool_id) AS total_tools_rented' +
								' FROM Reservation' +
								' WHERE date_trunc(\'month\', end_date) = date_trunc(\'month\', current_date)' +
								' AND clerk_id_dropoff IS NOT NULL' +
								' GROUP BY customer_id;';
        await client.query(create_res_view);

		await client.query('DROP VIEW IF EXISTS phone_number;');

        var create_phone_num_view = 'CREATE VIEW phone_number' +
									' AS SELECT customer_id, area_code::text || phone::text ||' +
									' COALESCE(extension::text, \'\') AS phone, number_type ' +
									' FROM CustomerPhoneNumber;'
		await client.query(create_phone_num_view);

        await client.query("COMMIT");

        var get_report_query = 'SELECT A.customer_id, A.username, A.first_name, COALESCE(A.middle_name::text, \'\') as middle_name,' +
						        ' A.last_name, A.email, phone_number.phone,' +
								' reservation_info.total_reservations, reservation_info.total_tools_rented' +
						 		' FROM CUSTOMER AS A' +
						 		' INNER JOIN phone_number ON A.customer_id = phone_number.customer_id' +
						 		' INNER JOIN reservation_info ON A.customer_id = reservation_info.customer_id' +
						 		' WHERE A.primary_number_type = phone_number.number_type' +
						 		' ORDER BY reservation_info.total_tools_rented ASC, A.last_name DESC;';

 		const report = await client.query(get_report_query);

		return reply(JSON.stringify(report.rows, null, 4)).code(200);
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        return reply("Unable to generate customer report.").code(500);
    } finally { 
        await client.release();
    }
}

/* 
	example output:

	[
		{
			"customer_id": 4,
			"username": ".3h.e-i'd.a_.y.",
			"first_name": "Alexa",
			"middle_name": "Hi",
			"last_name": "There",
			"email": "heiday@gmail",
			"phone": "2211334441",
			"total_reservations": "1",
			"total_tools_rented": "1"
		},
		{
			"customer_id": 2,
			"username": "h.e-i'd.a_.y.81818",
			"first_name": "Hallo",
			"middle_name": "Ma",
			"last_name": "Ed",
			"email": "heiday@gmail",
			"phone": "1111334441",
			"total_reservations": "1",
			"total_tools_rented": "1"
		},
		{
			"customer_id": 3,
			"username": "h.e-i'd.a_.y.",
			"first_name": "Mallow",
			"middle_name": "Me",
			"last_name": "Bob",
			"email": "heiday@gmail",
			"phone": "1111334441",
			"total_reservations": "1",
			"total_tools_rented": "2"
		},
		{
			"customer_id": 1,
			"username": "h.e-i'69d.a_.y.556",
			"first_name": "HH'e-i",
			"middle_name": "Matt",
			"last_name": "Day",
			"email": "heidaay@gmail",
			"phone": "2211334441546456454564",
			"total_reservations": "3",
			"total_tools_rented": "4"
		}
	]

	if middle_name is empty string:
	{
        "customer_id": 2,
        "username": "h.e-i'd.a_.y.81818",
        "first_name": "Hallo",
        "middle_name": "",
        "last_name": "Ed",
        "email": "heiday@gmail",
        "phone": "1111334441",
        "total_reservations": "1",
        "total_tools_rented": "1"
	}
	
	if middle_name is null:
	{
        "customer_id": 2,
        "username": "h.e-i'd.a_.y.81818",
        "first_name": "Hallo",
        "middle_name": "",
        "last_name": "Ed",
        "email": "heiday@gmail",
        "phone": "1111334441",
        "total_reservations": "1",
        "total_tools_rented": "1"
    }
*/