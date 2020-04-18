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
    path: '/register',
    config: {
        validate: {
            payload: {
                first_name: Joi.string().regex(/^[\S]+$/).max(250).required(),
                middle_name: Joi.string().regex(/^[\S]+$/).max(250).allow('').required(),
                last_name: Joi.string().regex(/^[\S]+$/).max(250).required(),
                home_phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}(x\d+)?$/).allow('').required(),
                work_phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}(x\d+)?$/).allow('').required(),
                cell_phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}(x\d+)?$/).allow('').required(),
                primary_phone: Joi.string().required(),
                username: Joi.string().regex(/^[\S]+$/).max(250).required(),
                email_address: Joi.string().email().max(250).required(),
                password: Joi.string().regex(/^[\S]+$/).max(250).required(),
                street_address: Joi.string().max(250).required(),
                city: Joi.string().max(250).required(),
                state: Joi.string().required(),
                zip_code: Joi.string().regex(/^\d{5}-\d{4}$/).required(),
                name_on_card: Joi.string().max(250).required(),
                cc_num: Joi.string().min(14).required(),
                expiration_month: Joi.string().required(),
                expiration_year: Joi.string().required(),
                cvc: Joi.string().min(3).max(3).required()
            }        
        },
        handler: handleRegister,
        cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
      }
    }
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeFirstLetterInWord(string) {
    return string.replace(/\w\S*/g, capitalizeFirstLetter);
}

function splitPhone(string) {
    return string.split(/[-x]+/);
}

async function handleRegister (request, reply) {

    let first_name = capitalizeFirstLetter(request.payload.first_name);
    let middle_name = request.payload.middle_name ? capitalizeFirstLetter(request.payload.middle_name) : null;
    let last_name = capitalizeFirstLetter(request.payload.last_name);
    let home_phone = request.payload.home_phone;
    let work_phone = request.payload.work_phone;
    let cell_phone = request.payload.cell_phone;
    let primary_phone = request.payload.primary_phone;
    let username = request.payload.username;
    let email_address = request.payload.email_address;
    let password = request.payload.password;
    let street_address = capitalizeFirstLetterInWord(request.payload.street_address);
    let city = capitalizeFirstLetterInWord(request.payload.city);
    let state = capitalizeFirstLetterInWord(request.payload.state);
    let zip_code = request.payload.zip_code;
    let name_on_card = capitalizeFirstLetterInWord(request.payload.name_on_card);
    let cc_num = request.payload.cc_num;
    let expiration_month = request.payload.expiration_month;
    let expiration_year = request.payload.expiration_year;
    let cvc = request.payload.cvc;

    if (((primary_phone === 'home_phone') && !home_phone) ||
        ((primary_phone === 'work_phone') && !work_phone) ||
        ((primary_phone === 'cell_phone') && !cell_phone)) {
            let reply_str = 'Unable to process registration request: '
                            + 'primary phone number has not been provided';
            return reply(reply_str).code(400);
    }

    const check_existing_user = 'SELECT * FROM Customer WHERE username = $1;';
    const add_new_user = 'INSERT INTO Customer (username, email, '
                         + 'password, first_name, middle_name, last_name, '
                         + 'primary_number_type, street, city, state, zip_code, '
                         + 'credit_card_name, credit_card_number, cvc, '
                         + 'exp_date_month, exp_date_year) VALUES '
                         + '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, '
                         + '$13, $14, $15, $16) RETURNING customer_id;';
    const add_user_phone = 'INSERT INTO CustomerPhoneNumber (customer_id, '
                           + 'number_type, area_code, phone, extension) VALUES '
                           + '($1, $2, $3, $4, $5);';
    let insert_new_user_values = [username, email_address, password, 
                                  first_name, middle_name, last_name, 
                                  primary_phone, street_address, city, state, 
                                  zip_code, name_on_card, cc_num, cvc, 
                                  expiration_month, expiration_year];
    let customer_id = 0;

    const client = await pool.connect();
    
    try {
        const check_user_query = await client.query(check_existing_user, [username]);
        if (check_user_query.rowCount != 0) {
            throw "user already exists";
        }
    } catch (error) {
        console.log(error);
        await client.release();
        return reply("Unable to process registration request: failed while checking username").code(400);
    }

    try {
        await client.query('BEGIN') // Start transaction

        const add_user_query = await client.query(add_new_user, insert_new_user_values);
        customer_id = add_user_query.rows[0].customer_id;
        
        if (home_phone) {
            let home_num = splitPhone(home_phone);
            let optional_home_ext = home_phone.includes('x') ? home_num[3] : null;
            let phone_values = [customer_id, 'home_phone', home_num[0], 
                                home_num[1]+home_num[2], optional_home_ext];
            await client.query(add_user_phone, phone_values);
        }

        if (work_phone) {
            let work_num = splitPhone(work_phone);
            let optional_work_ext = work_phone.includes('x') ? work_num[3] : null;
            let work_values = [customer_id, 'work_phone', work_num[0], 
                               work_num[1]+work_num[2], optional_work_ext];
            await client.query(add_user_phone, work_values);
        }

        if (cell_phone) {
            let cell_num = splitPhone(cell_phone);
            let optional_cell_ext = cell_phone.includes('x') ? cell_num[3] : null;
            let cell_values = [customer_id, 'cell_phone', cell_num[0], 
                               cell_num[1]+cell_num[2], optional_cell_ext];
            await client.query(add_user_phone, cell_values);
        }

        await client.query("COMMIT"); // End transaction
        reply({customer_id: customer_id}).code(200);
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        reply("Unable to process registration request").code(400);
    } finally { 
        await client.release();
    }
}