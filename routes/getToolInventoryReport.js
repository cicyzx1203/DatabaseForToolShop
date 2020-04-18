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
    path: '/get_tool_inventory_report',
    config: {
        validate: {
            payload: {
                category: Joi.string().valid('All Tools', 'Hand', 'Garden', 'Ladder', 'Power').required(),
                search_keyword: Joi.string().max(250).allow('').required()
            }
        },
        handler: getToolReport,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
};

/*
    return 1 if the first date comes AFTER the second (bigger), 0 if they're equal, -1 if first date is BEFORE the second (smaller)
*/
function compareDates(year1, month1, day1, year2, month2, day2) {
    if (year1 > year2) {
        return 1;
    } else if (year1 < year2) {
        return -1;
    } else {
        /* years are equal, go to months */
        if (month1 > month2) {
            return 1;
        } else if (month1 < month2) {
            return -1;
        } else { /* months are equal */
            if (day1 > day2) {
                return 1;
            } else if (day1 < day2) {
                return -1;
            } else {
                return 0;
            }
        }
    }
}

async function getToolReport (request, reply) {
    let category = request.payload.category;
    let search_keyword = request.payload.search_keyword;

    const client = await pool.connect()

    try {
        var tools_query = 'SELECT t.tool_id, t.power_source, t.sub_option, t.sub_type, t.purchase_price, ' + 
                          'res.confirmation_number, res.start_date, res.end_date, res.clerk_id_dropoff ' +
                          'FROM Tool as t FULL OUTER JOIN Reservation AS res ' +
                          'ON res.tool_id = t.tool_id';
        var where_params = '';
        if (category != 'All Tools') {
            where_params += 'category = \'' + category + '\'';
        }

        /* 
            For keyword search, TA only really mentions sub-option because the other fields (sub-type, power-source) 
            are potentially specified in the other search fields. In this case, since those two other fields cannot be provided in UI drop-downs,
            I search for them with the keyword too. This expects keyword to be a word within sub-option, sub-type, or power-source, 
            but NOT across fields. For example, "Electric", "Reciprocating", and "Saw" are okay to find tool with description
            like "Electric Reciprocating Saw", but "Electric Reciprocating", "Reciprocating Saw", "Electric Saw", etc. will NOT work.
        */
        if (search_keyword != '') {
            if (where_params.length > 0) {
                where_params += ' AND ';
            }
            let keyword = search_keyword.replace(/^\s+|\s+$/g, '');
            where_params += '(LOWER(sub_option) LIKE LOWER(\'%' + keyword + '%\') OR LOWER(sub_type) LIKE LOWER(\'%' + 
                            keyword + '%\') OR LOWER(power_source) LIKE LOWER(\'%' + keyword + '%\'))';
        }

        if (where_params.length > 0) {
            tools_query += ' WHERE ' + where_params;
        }
        tools_query += ' ORDER BY tool_id;'

        const tools_list = await client.query(tools_query);

        var tool_list_response = [];
        var current_status = 'Available';
        var date = '';
        var days_rented = 0;

        for (i = 0; i < tools_list.rowCount; i++) {
            if (tools_list.rows[i].confirmation_number) {
                let start_date_split = tools_list.rows[i].start_date.toISOString().slice(0,10).split('-');
                let end_date_split = tools_list.rows[i].end_date.toISOString().slice(0,10).split('-');

                let current_date = new Date();
                let curr_month = current_date.getMonth() + 1;
                let curr_day = current_date.getDate();
                let curr_year = current_date.getFullYear();

                if ((compareDates(curr_year, curr_month, curr_day, start_date_split[0], start_date_split[1], start_date_split[2]) >= 0) && 
                    (compareDates(curr_year, curr_month, curr_day, end_date_split[0], end_date_split[1], end_date_split[2]) <= 0)) {
                        current_status = 'Rented';
                        date = end_date_split[1] +'/'+ end_date_split[2] +'/'+ end_date_split[0];
                }

                /* do not count days rented into rental profit if item has not been returned */
                if (tools_list.rows[i].clerk_id_dropoff) {
                    days_rented += (parseInt(tools_list.rows[i].end_date - tools_list.rows[i].start_date) / (24*3600*1000)) + 1;
                }
            }

            /* check if we considered all reservations for this tool_id */
            if (((i+1) === tools_list.rowCount) || 
                (((i+1) < tools_list.rowCount) && (tools_list.rows[i].tool_id != tools_list.rows[i+1].tool_id))) {
                    var tool_info = {};
                    tool_info['tool_id'] = tools_list.rows[i].tool_id;
                    tool_info['current_status'] = current_status;
                    tool_info['date'] = date;
                    
                    var toolDesc = '';
                    if (tools_list.rows[i].power_source != 'Manual') {
                        toolDesc += tools_list.rows[i].power_source + ' ';
                    }
                    toolDesc = toolDesc + tools_list.rows[i].sub_option + ' ' + tools_list.rows[i].sub_type;
                    tool_info['description'] = toolDesc;

                    /* Daily rental prices are 15% of the original purchase price rounded up to nearest cent. */
                    let daily_rental_price = Math.ceil(15 * tools_list.rows[i].purchase_price) / 100;
                    let total_rental_price = Math.round(daily_rental_price * days_rented * 100) / 100;
                    let purchase_price = parseFloat(tools_list.rows[i].purchase_price);
                    let total_profit = total_rental_price.toFixed(2) - purchase_price.toFixed(2);
                    tool_info['rental_profit'] = total_rental_price.toFixed(2);
                    tool_info['total_cost'] = purchase_price.toFixed(2);
                    tool_info['total_profit'] = total_profit.toFixed(2);
                    tool_list_response.push(tool_info);

                    /* reset */
                    current_status = 'Available';
                    date = '';
                    days_rented = 0;
            }
        }

        tool_list_response.sort(function(a, b) {
            return b['total_profit'] - a['total_profit'];
        });

        reply(JSON.stringify(tool_list_response, null, 4)).code(200);
    } catch (error) {
        console.log(error);
        reply("Unable to generate tool inventory report.").code(500);
    } finally { 
        await client.release();
    }
}

/*
    sample request #1:
    {
        "category": "All Tools",
        "search_keyword": ""
    }
    
    sample response #1:
    [
        {
            "tool_id": 1,
            "current_status": "Rented",
            "date": "11/28/2017",
            "description": "Hex Screwdriver",
            "rental_profit": "3.23",
            "total_cost": "1.24",
            "total_profit": "1.99"
        },
        {
            "tool_id": 4,
            "current_status": "Rented",
            "date": "11/30/2017",
            "description": "Hex Screwdriver",
            "rental_profit": "1.90",
            "total_cost": "1.24",
            "total_profit": "0.66"
        },
        {
            "tool_id": 3,
            "current_status": "Rented",
            "date": "11/28/2017",
            "description": "Hex Screwdriver",
            "rental_profit": "1.33",
            "total_cost": "1.24",
            "total_profit": "0.09"
        },
        {
            "tool_id": 5,
            "current_status": "Rented",
            "date": "11/28/2017",
            "description": "Rigid Straight",
            "rental_profit": "1.14",
            "total_cost": "1.24",
            "total_profit": "-0.10"
        },
        {
            "tool_id": 6,
            "current_status": "Rented",
            "date": "11/28/2017",
            "description": "Rigid Straight",
            "rental_profit": "1.14",
            "total_cost": "1.24",
            "total_profit": "-0.10"
        },
        {
            "tool_id": 7,
            "current_status": "Available",
            "date": "",
            "description": "Electric Hammer Drill",
            "rental_profit": "0.00",
            "total_cost": "1.24",
            "total_profit": "-1.24"
        },
        {
            "tool_id": 8,
            "current_status": "Available",
            "date": "",
            "description": "Electric Reciprocating Saw",
            "rental_profit": "0.00",
            "total_cost": "1.24",
            "total_profit": "-1.24"
        }
    ]

    sample request #2:
    {
        "category": "Hand",
        "search_keyword": ""
    }

    sample response #2:
    [
        {
            "tool_id": 1,
            "current_status": "Rented",
            "date": "11/28/2017",
            "description": "Hex Screwdriver",
            "rental_profit": "3.23",
            "total_cost": "1.24",
            "total_profit": "1.99"
        },
        {
            "tool_id": 4,
            "current_status": "Rented",
            "date": "11/30/2017",
            "description": "Hex Screwdriver",
            "rental_profit": "1.90",
            "total_cost": "1.24",
            "total_profit": "0.66"
        },
        {
            "tool_id": 3,
            "current_status": "Rented",
            "date": "11/28/2017",
            "description": "Hex Screwdriver",
            "rental_profit": "1.33",
            "total_cost": "1.24",
            "total_profit": "0.09"
        }
    ]

    sample request #3:
    {
        "category": "Power",
        "search_keyword": "reciprocating"
    }

    sample response #3:
    [
        {
            "tool_id": 8,
            "current_status": "Available",
            "date": "",
            "description": "Electric Reciprocating Saw",
            "rental_profit": "0.00",
            "total_cost": "1.24",
            "total_profit": "-1.24"
        }
    ]
*/