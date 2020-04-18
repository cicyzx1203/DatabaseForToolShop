const {Pool} = require('pg');

const pool = new Pool({
    user: 'gatechuser',
    host: 'localhost',
    database: 'cs6400_fa17_team036',
    password: 'gatech123',
    port: 5432,
});

const Joi = require('joi');

// ==================== Route Configurations =========================

module.exports = {
    method: 'POST',
    path: '/get_available_tools',
    config: {
        validate: {
            payload: {
                start_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}/).required(),
                end_date: Joi.string().regex(/^\d{4}-\d{2}-\d{2}/).required(),
                category: Joi.string().max(250).valid('All Tools', 'Hand', 'Garden', 'Ladder', 'Power').required(),
                power_source: Joi.string().max(250).valid('All', 'Electric', 'Cordless', 'Gas', 'Manual').required(),
                sub_type: Joi.string().max(250).valid('All', 'Pliers', 'Wrench', 'Hammer', 'Screwdriver', 
                                                      'Gun', 'Socket', 'Ratchet', 'Step', 'Straight', 'Mixer', 'Generator', 
                                                      'Saw', 'Air-Compressor', 'Drill', 'Sander', 'Digger', 'Pruner', 
                                                      'Wheelbarrows', 'Rakes', 'Striking').required(),
                sub_option: Joi.string().max(250).allow('').required()
            }
        },
        handler: getAvailableTools,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
};

async function getAvailableTools (request, reply) {
    let start_date = request.payload.start_date;
    let end_date = request.payload.end_date;
    let category = request.payload.category;
    let power_source = request.payload.power_source;
    let sub_type = request.payload.sub_type;
    let sub_option = request.payload.sub_option;

    const client = await pool.connect()

    try {
        var tools_query = 'SELECT tool_id, sub_type, sub_option, power_source, purchase_price FROM Tool';

        var where_params = '';
        if (category != 'All Tools') {
            where_params += 'category = \'' + category + '\'';
        }

        if (power_source != 'All') {
            if (where_params.length > 0) {
                where_params += ' AND ';
            }
            where_params += 'power_source = \'' + power_source + '\'';
        }

        if (sub_type != 'All') {
            if (where_params.length > 0) {
                where_params += ' AND ';
            }
            where_params += 'sub_type = \'' + sub_type + '\'';
        }

        if (sub_option != '') {
            if (where_params.length > 0) {
                where_params += ' AND ';
            }
            let keyword = sub_option.replace(/^\s+|\s+$/g, '');
            where_params += 'LOWER(sub_option) LIKE LOWER(\'%' + keyword + '%\')';
        }

        if (where_params.length > 0) {
            tools_query += ' WHERE ' + where_params + ';';
        }

        const tools_list = await client.query(tools_query);

        var tool_list_response = [];

        for (i = 0; i < tools_list.rowCount; i++) {
            var value = tools_list.rows[i];

            /*
             * You clash with another reservation if your start date is in the middle of another reservation OR
             * when your start date is BEFORE another reservation BUT your end date is in the middle/past it.
             */
            var reservations_query = 'SELECT * FROM Reservation ' +
                                     'WHERE (($1::date >= start_date AND $2::date <= end_date) OR ' + 
                                     '($3::date < start_date AND $4::date >= start_date)) AND tool_id = $5;';

            let values = [start_date, start_date, start_date, end_date, value.tool_id];

            const clashes_results = await client.query(reservations_query, values);
            var isToolAvailable = (clashes_results.rowCount == 0);

            if (isToolAvailable) {
                var tool_info = {};

                tool_info['tool_id'] = value.tool_id;

                // Daily rental prices are 15% of the original purchase price rounded up to nearest cent. 
                var rental_price = Math.ceil(15 * value.purchase_price) / 100;
                tool_info['rental_price'] = rental_price.toFixed(2);

                // Deposit prices are 40% of the original purchase price rounded up to nearest cent.
                var deposit_price = Math.ceil(40 * value.purchase_price) / 100;
                tool_info['deposit_price'] = deposit_price.toFixed(2);

                // Tool description = [power-src] + [sub-option] + [sub-type]
                // If power source is manual, leave it out, since it is inferred
                var toolDesc = '';
                if (value.power_source != 'Manual') {
                    toolDesc += value.power_source + ' ';
                }
                toolDesc = toolDesc + value.sub_option + ' ' + value.sub_type;

                tool_info['description'] = toolDesc;

                tool_list_response.push(tool_info);
            }
        }

        reply(JSON.stringify(tool_list_response, null, 4)).code(200);
    } catch (error) {
        console.log(error);
        reply("Unable to get available tools.").code(500);
    } finally { 
        await client.release();
    }
}


/*
    sample request:
    {
        "start_date": "2017-11-29",
        "end_date": "2017-11-30",
        "category": "All Tools",
        "power_source": "Manual",
        "sub_type": "All",
        "sub_option": ""
    }

    sample response:
    [
        {
            "tool_id": 3,
            "rental_price": "0.19",
            "deposit_price": "0.50",
            "description": "Hex Screwdriver"
        },
        {
            "tool_id": 6,
            "rental_price": "0.19",
            "deposit_price": "0.50",
            "description": "Rigid Straight"
        },
        {
            "tool_id": 5,
            "rental_price": "0.19",
            "deposit_price": "0.50",
            "description": "Rigid Straight"
        }
    ]
*/