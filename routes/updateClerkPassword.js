const {Pool} = require('pg');

const pool = new Pool({
    user: 'gatechuser',
    host: 'localhost',
    database: 'cs6400_fa17_team036',
    password: 'gatech123',
    port: 5432,
})

const Joi = require('joi');

module.exports = {
    method: 'POST',
    path: '/update_clerk_password',
    config: {
        validate: {
            payload: {
            	clerk_id: Joi.number().integer().required(),
            	password: Joi.string().max(250).required()
            }        
        },
        handler: updateClerkPassword,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
};

async function updateClerkPassword (request, reply) {
	let clerk_id = request.payload.clerk_id;
	let password = request.payload.password;
	const client = await pool.connect();

	const check_if_clerk_exists_query = 'SELECT * from Clerk where clerk_id = $1 AND password = \'temp123\'';
	const update_clerk_password_query = 'UPDATE Clerk SET password = $1 WHERE clerk_id = $2 AND password = \'temp123\'';

	/* The user must exist in order to change their password */
	const user_count = await client.query(check_if_clerk_exists_query, [clerk_id]);
	if (user_count.rowCount < 1) {
		reply("Clerk does not exist or cannot change his or her password").code(401);
		await client.release();
		return;
	}

	/* Can't use default pass as a new password */
	if (password === 'temp123') {
		reply("Please use a different password other than default").code(403);
		await client.release();
		return;
	}

	/* If the user exists and their password is NOT 'temp123', then we attempt to change their password */
	try {
		let user_payload_values = [password, clerk_id];
		let result = await client.query(update_clerk_password_query, user_payload_values);
		reply("Password successfully updated").code(200);
	} catch (error) {
		console.log(error);
		reply("Unable to change password from default").code(400);
	} finally { 
        await client.release();
    }
}

