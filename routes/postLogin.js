const {Pool} = require('pg');
const Boom = require('boom');

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
    path: '/login',
    config: {
        validate: {
            payload: {
                username: Joi.string().required(),
                password: Joi.string().required(),
                type: Joi.string().required()
            }        
        },
        handler: handleLogin,
        cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
};


/**
 *
 * @param request
 * @param reply
 * @returns {Promise.<void>}
 */
async function handleLogin (request, reply) {
    const type = request.payload.type;
    const username = request.payload.username;
    const password = request.payload.password;

    switch(type){
        case "customer":
            handleCustomer(username, password, reply);
            break;
        case "clerk":
            handleClerk(username, password, reply);
        break;
    }
}

/**
 *
 * @param username
 * @param password
 * @param reply
 * @returns {Promise.<void>}
 */
async function handleCustomer(username, password, reply){
    // Connect to the Database
    const client = await pool.connect()

    // Step 1 is to query the username and see if it is a username we have in the database
    const res = await client.query('Select username from Customer where username=$1::text', [username]);

    // Check if there are no rows and reply that the user is not registered if this is the case
    if(res.rows.length === 0){
        let error = new Error(`${username} is not a registered customer`)
        return reply(Boom.boomify(error, {statusCode: 401}))
    }

    // Username is found lets make sure the password is, too.
    const checkPassword = await client.query('select customer_id, first_name from Customer where username=$1 and password=$2', [username, password]);

    // Check it's an empty record then the username and password don't match otherwise it's a 200 and send them forth
    await client.release();

    if(checkPassword.rows.length === 0){
        return reply(Boom.badRequest(`${username} incorrect password`));
    } else{
        return reply({customer_id: checkPassword.rows[0].customer_id,
        first_name: checkPassword.rows[0].first_name}).code(200)
    }
}

/**
 *
 * @param username
 * @param password
 * @param reply
 * @returns {Promise.<void>}
 */
async function handleClerk(username, password, reply) {

    const tempPassword = "temp123";
    //Connect to the database
    const client = await pool.connect();

    // Check to see if the username is in the clerks tables
    const res = await client.query('SELECT username from Clerk where username=$1::text', [username]);

    // If it's an empty object return that the user doesn't exist
    if(res.rows.length === 0){
        return reply(Boom.badRequest(`${username} is not a registered clerk`));
    }

    // If it's correct check the password
    const checkPassword = await client.query("Select clerk_id, password, first_name from Clerk where username=$1::text and password=$2::text", [username, password]);

    await client.release();

    // First check if the record is empty
    if(checkPassword.rows.length === 0){
        return reply(Boom.badRequest(`The password does not match for this user ${username}, please talk to an administrator`));
    }

    // Next check if the the password is the same as the temp password

    if (password === tempPassword) {
        reply({clerk_id: checkPassword.rows[0].clerk_id, first_name: checkPassword.rows[0].first_name}).code(202)
    } else {
        return reply({clerk_id: checkPassword.rows[0].clerk_id, first_name: checkPassword.rows[0].first_name}).code(201)
    }

}