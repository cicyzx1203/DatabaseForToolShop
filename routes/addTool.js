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

const accessorySchema = Joi.object({
    description: Joi.string().max(1000).required(),
    quantity: Joi.number().greater(0).required()
});

module.exports = {
    method: 'POST',
    path: '/add_tool',
    config: {
        validate: {
            payload: {
                category: Joi.string().valid('Hand', 'Garden', 'Ladder', 'Power').required(),
                sub_type: Joi.string().max(250).valid('Pliers', 'Wrench', 'Hammer', 'Screwdriver', 'Gun', 
                                                      'Socket', 'Ratchet', 'Step', 'Straight', 'Mixer', 'Generator', 
                                                      'Saw', 'Air-Compressor', 'Drill', 'Sander', 'Digger', 'Pruner', 
                                                      'Wheelbarrows', 'Rakes', 'Striking').required(),
                sub_option: Joi.string().max(250).required(),
                power_source: Joi.string().max(250).valid('Electric', 'Cordless', 'Gas', 'Manual').required(),
                manufacturer: Joi.string().max(250).required(),
                material: Joi.string().allow('').max(250),
                width_or_diameter: Joi.number().greater(0).required(),
                length: Joi.number().greater(0).required(),
                weight: Joi.number().greater(0).required(),
                purchase_price: Joi.number().greater(0).required(),
                clerk_id: Joi.number().integer().required(),

                // Power Tool Accessories
                accessories: Joi.array().min(0).items(accessorySchema),

                // Whatever isn't needed could be sent over too with empty string or 0. 
                // If it's needed and it's empty or 0, an error will be thrown later.
                // boolean values should always be true or false and inserted as such

                // Power Sander
                volt_rating: Joi.number().integer().min(0),
                amp_rating: Joi.number().min(0),
                min_rpm_rating: Joi.number().integer().min(0),
                max_rpm_rating: Joi.number().integer().min(0),
                dust_bag: Joi.boolean(),

                // Power Drill
                min_torque_rating: Joi.number().min(0),
                max_torque_rating: Joi.number().min(0),
                adjustable_clutch: Joi.boolean(),

                // Power Air Compressor
                pressure_rating: Joi.number().min(0),
                tank_size: Joi.number().min(0),

                // Power Saw
                blade_size: Joi.number().min(0),

                // Power Generator
                power_rating: Joi.number().min(0),

                // Power Mixer
                motor_rating: Joi.number().min(0),
                drum_size: Joi.number().min(0),

                // Cordless Power Tool
                battery_type: Joi.string().max(250).allow(''),

                // Hand Plier
                adjustable: Joi.boolean(),

                // Hand Wrench
                drive_size: Joi.number().min(0),

                // Hand Hammer
                anti_vibration: Joi.boolean(),

                // Hand Screwdriver
                screw_size: Joi.number().integer().min(0),

                // Hand Gun
                gauge_rating: Joi.number().integer().min(0),
                capacity: Joi.number().integer().min(0),

                // Hand Socket
                sae_size: Joi.number().min(0),

                // Step Ladder
                step_count: Joi.number().integer().min(0),
                weight_capacity: Joi.number().min(0),
                pail_shelf: Joi.boolean(),

                // Straight Ladder
                rubber_feet: Joi.boolean(),

                // Striking Tool
                handle_material: Joi.string().max(250).allow(''),
                head_weight: Joi.number().min(0),

                // Digger
                blade_length: Joi.number().min(0),
                blade_width: Joi.number().min(0),

                // Pruner
                blade_material: Joi.string().max(250).allow(''),

                // WheelBarrow
                bin_volume: Joi.number().min(0),
                bin_material: Joi.string().max(250).allow(''),
                wheel_count: Joi.number().integer().min(0),

                // Rake
                tine_count: Joi.number().integer().min(0)
            }        
        },
        handler: addTool,
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
};

async function addTool (request, reply) {
    const client = await pool.connect();

    let clerk_id = request.payload.clerk_id;
    const cherk_clerk_existence = 'SELECT * FROM Clerk WHERE clerk_id = $1;';
    try {
        const clerk_result = await client.query(cherk_clerk_existence, [clerk_id]);
        if (clerk_result.rowCount == 0) {
            throw "Clerk doesn't exist.";
        }
    } catch (error) {
        console.log(error);
        await client.release();
        return reply(error).code(400);
    }

    try {
        await client.query('BEGIN'); // Start transaction

        let category = request.payload.category;
        let sub_type = request.payload.sub_type;
        let sub_option = request.payload.sub_option;
        let power_source = request.payload.power_source;
        let manufacturer = request.payload.manufacturer;
        let material = request.payload.material ? request.payload.material : null;
        let width_or_diameter = request.payload.width_or_diameter;
        let length = request.payload.length;
        let weight = request.payload.weight;
        let purchase_price = request.payload.purchase_price;

        const insert_tool_query = 'INSERT INTO Tool (category, sub_type, sub_option, power_source, ' +
                                  'manufacturer, material, width_or_diameter, length, weight, purchase_price, clerk_id_add) ' +
                                  'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING tool_id;';
        let tool_values = [category, sub_type, sub_option, power_source, manufacturer, material, width_or_diameter, length, 
                           weight, purchase_price, clerk_id];

        const inserted_tool = await client.query(insert_tool_query, tool_values);
        let new_tool_id = inserted_tool.rows[0].tool_id;

        if (category === 'Hand') {
            let insert_hand_query = '';
            let hand_values = [];

            let adjustable = request.payload.adjustable;
            let drive_size = request.payload.drive_size;
            let anti_vibration = request.payload.anti_vibration;
            let screw_size = request.payload.screw_size;
            let gauge_rating = request.payload.gauge_rating;
            let capacity = request.payload.capacity;
            let sae_size = request.payload.sae_size;

            switch(sub_type) {
                case 'Pliers':
                    // null check for booleans
                    if (adjustable == null) {
                        throw "Missing adjustable.";
                    }
                    insert_hand_query = 'INSERT INTO HandPlier (tool_id, adjustable) VALUES ($1, $2);';
                    hand_values = [new_tool_id, adjustable];
                    break;
                case 'Wrench':
                    /* front end should check for user inputs of 0, otherwise if it gets here, we assume null */
                    if (!drive_size) {
                        drive_size = null;
                    }
                    insert_hand_query = 'INSERT INTO HandWrench (tool_id, drive_size) VALUES ($1, $2);';
                    hand_values = [new_tool_id, drive_size];
                    break;
                case 'Hammer':
                    insert_hand_query = 'INSERT INTO HandHammer (tool_id, anti_vibration) VALUES ($1, $2);';
                    hand_values = [new_tool_id, anti_vibration];
                    break;
                case 'Screwdriver':
                    if (!screw_size) {
                        throw "Missing screw size.";
                    }
                    insert_hand_query = 'INSERT INTO HandScrewdriver (tool_id, screw_size) VALUES ($1, $2);';
                    hand_values = [new_tool_id, screw_size];
                    break;
                case 'Gun':
                    if (!gauge_rating || !capacity) {
                        throw "Missing capacity/gauge rating.";
                    }
                    insert_hand_query = 'INSERT INTO HandGun (tool_id, gauge_rating, capacity) VALUES ($1, $2, $3);';
                    hand_values = [new_tool_id, gauge_rating, capacity];
                    break;
                case 'Socket':
                    if (!drive_size || !sae_size) {
                        throw "Missing drive size/sae size.";
                    }
                    insert_hand_query = 'INSERT INTO HandSocket (tool_id, drive_size, sae_size) VALUES ($1, $2, $3);';
                    hand_values = [new_tool_id, drive_size, sae_size];
                    break;
                case 'Ratchet':
                    if (!drive_size) {
                        throw "Missing drive size.";
                    }
                    insert_hand_query = 'INSERT INTO HandRatchet (tool_id, drive_size) VALUES ($1, $2);';
                    hand_values = [new_tool_id, drive_size];
                    break;
            }

            if (insert_hand_query.length == 0 || hand_values.length == 0) {
                throw "Invalid hand tool";
            }

            await client.query(insert_hand_query, hand_values);
        } else if (category === 'Ladder') {
            let insert_ladder_query = '';
            let ladder_values = [];

            let step_count = request.payload.step_count;
            let weight_capacity = request.payload.weight_capacity;
            let pail_shelf = request.payload.pail_shelf;
            let rubber_feet = request.payload.rubber_feet;

            switch(sub_type) {
                case 'Step':
                    if (!step_count || !weight_capacity) {
                        throw "Missing step count/weight capacity.";
                    }
                    insert_ladder_query = 'INSERT INTO StepLadder (tool_id, step_count, weight_capacity, pail_shelf) ' + 
                                          'VALUES ($1, $2, $3, $4);';
                    ladder_values = [new_tool_id, step_count, weight_capacity, pail_shelf];
                    break;
                case 'Straight':
                    if (!step_count || !weight_capacity) {
                        throw "Missing step count/weight capacity.";
                    }
                    insert_ladder_query = 'INSERT INTO StraightLadder (tool_id, step_count, weight_capacity, rubber_feet) ' + 
                                          'VALUES ($1, $2, $3, $4);';
                    ladder_values = [new_tool_id, step_count, weight_capacity, rubber_feet];
                    break;
            }

            if (insert_ladder_query.length == 0 || ladder_values.length == 0) {
                throw "Invalid ladder tool";
            }

            await client.query(insert_ladder_query, ladder_values);
        } else if (category === 'Power') {
            let insert_power_query = '';
            let insert_cordless_power_query = '';
            let power_values = [];
            let cordless_power_values = [];

            let battery_type = request.payload.battery_type;
            let volt_rating = request.payload.volt_rating;
            let amp_rating = request.payload.amp_rating;
            let min_rpm_rating = request.payload.min_rpm_rating;
            let max_rpm_rating = request.payload.max_rpm_rating;
            let motor_rating = request.payload.motor_rating;
            let drum_size = request.payload.drum_size;
            let power_rating = request.payload.power_rating;
            let blade_size = request.payload.blade_size;
            let pressure_rating = request.payload.pressure_rating;
            let tank_size = request.payload.tank_size;
            let adjustable_clutch = request.payload.adjustable_clutch;
            let min_torque_rating = request.payload.min_torque_rating;
            let max_torque_rating = request.payload.max_torque_rating;
            let dust_bag = request.payload.dust_bag;

            if (power_source === 'Cordless') {
                if (!battery_type) {
                    throw "Missing battery type.";
                }
                if ((battery_type != 'Li-Ion') && (battery_type != 'NiCd') && (battery_type != 'NiMH')) {
                    throw "Battery type must be one of Li-Ion, NiCd, or NiMH";
                }
                insert_cordless_power_query = 'INSERT INTO CordlessPowerTool (tool_id, battery_type) ' + 
                                              'VALUES ($1, $2);';
                cordless_power_values = [new_tool_id, battery_type];
                await client.query(insert_cordless_power_query, cordless_power_values);
            }

            if (!max_rpm_rating) {
                max_rpm_rating = null;
            }

            switch(sub_type) {
                case 'Mixer':
                    if (!volt_rating || !amp_rating || !min_rpm_rating || !motor_rating || !drum_size) {
                        throw "Missing volt rating/amp rating/min rpm/motor rating/drum size.";
                    }
                    insert_power_query = 'INSERT INTO PowerMixer (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, ' +
                                         'motor_rating, drum_size) ' + 
                                         'VALUES ($1, $2, $3, $4, $5, $6, $7);';
                    power_values = [new_tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, motor_rating, drum_size];
                    break;
                case 'Generator':
                    if (!volt_rating || !amp_rating || !min_rpm_rating || !power_rating) {
                        throw "Missing volt rating/amp rating/min rpm/power rating.";
                    }
                    insert_power_query = 'INSERT INTO PowerGenerator (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, ' +
                                         'power_rating) ' + 
                                         'VALUES ($1, $2, $3, $4, $5, $6);';
                    power_values = [new_tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, power_rating];
                    break;
                case 'Saw':
                    if (!volt_rating || !amp_rating || !min_rpm_rating || !blade_size) {
                        throw "Missing volt rating/amp rating/min rpm/blade size.";
                    }
                    insert_power_query = 'INSERT INTO PowerSaw (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, ' +
                                         'blade_size) ' + 
                                         'VALUES ($1, $2, $3, $4, $5, $6);';
                    power_values = [new_tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, blade_size];
                    break;
                case 'Air-Compressor':
                    if (!volt_rating || !amp_rating || !min_rpm_rating || !tank_size) {
                        throw "Missing volt rating/amp rating/min rpm/tank size.";
                    }
                    if (!pressure_rating) {
                        pressure_rating = null;
                    }
                    insert_power_query = 'INSERT INTO PowerAirCompressor (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, ' +
                                         'pressure_rating, tank_size) ' + 
                                         'VALUES ($1, $2, $3, $4, $5, $6, $7);';
                    power_values = [new_tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, pressure_rating, tank_size];
                    break;
                case 'Drill':
                    if (!volt_rating || !amp_rating || !min_rpm_rating || !min_torque_rating) {
                        throw "Missing volt rating/amp rating/min rpm/min torque.";
                    }
                    if (!max_torque_rating) {
                        max_torque_rating = null;
                    }
                    insert_power_query = 'INSERT INTO PowerDrill (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, ' +
                                         'adjustable_clutch, min_torque_rating, max_torque_rating) ' + 
                                         'VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
                    power_values = [new_tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, adjustable_clutch, min_torque_rating, max_torque_rating];
                    break;
                case 'Sander':
                    if (!volt_rating || !amp_rating || !min_rpm_rating || dust_bag == null) {
                        throw "Missing volt rating/amp rating/min rpm/dust bag.";
                    }
                    insert_power_query = 'INSERT INTO PowerSander (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, ' +
                                         'dust_bag) ' + 
                                         'VALUES ($1, $2, $3, $4, $5, $6);';
                    power_values = [new_tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, dust_bag];
                    break;
            }

            if (insert_power_query.length == 0 || power_values.length == 0) {
                throw "Invalid power tool";
            }

            await client.query(insert_power_query, power_values);

            const insert_accessory_query = 'INSERT INTO Accessory(tool_id, accessory_description, quantity) ' +
                                           'VALUES($1, $2, $3);';

            let accessories = request.payload.accessories;
            for (i = 0; i < accessories.length; i++) {
                let accessory_values = [new_tool_id, accessories[i].description, accessories[i].quantity];
                await client.query(insert_accessory_query, accessory_values);
            }
        } else if (category === 'Garden') {
            let insert_garden_query = '';
            let garden_values = [];

            let handle_material = request.payload.handle_material;
            let blade_length = request.payload.blade_length;
            let blade_width = request.payload.blade_width;
            let blade_material = request.payload.blade_material;
            let bin_volume = request.payload.bin_volume;
            let bin_material = request.payload.bin_material;
            let wheel_count = request.payload.wheel_count;
            let tine_count = request.payload.tine_count;
            let head_weight = request.payload.head_weight;

            switch(sub_type) {
                case 'Digger':
                    if (!handle_material || !blade_length || !blade_width) {
                        throw "Missing handle material/blade length/blade width.";
                    }
                    insert_garden_query = 'INSERT INTO Digger (tool_id, handle_material, blade_length, blade_width) ' + 
                                          'VALUES ($1, $2, $3, $4);';
                    garden_values = [new_tool_id, handle_material, blade_length, blade_width];
                    break;
                case 'Pruner':
                    if (!handle_material || !blade_length) {
                        throw "Missing handle material/blade length.";
                    }
                    if (!blade_material) {
                        blade_material = null;
                    }
                    insert_garden_query = 'INSERT INTO Pruner (tool_id, handle_material, blade_length, blade_material) ' + 
                                          'VALUES ($1, $2, $3, $4);';
                    garden_values = [new_tool_id, handle_material, blade_length, blade_material];
                    break;
                case 'Wheelbarrows':
                    if (!handle_material || !bin_material || !wheel_count) {
                        throw "Missing handle material/bin material/wheel count.";
                    }
                    if (!bin_volume) {
                        bin_volume = null;
                    }
                    insert_garden_query = 'INSERT INTO WheelBarrow (tool_id, handle_material, bin_volume, bin_material, wheel_count) ' + 
                                          'VALUES ($1, $2, $3, $4, $5);';
                    garden_values = [new_tool_id, handle_material, bin_volume, bin_material, wheel_count];
                    break;
                case 'Rakes':
                    if (!handle_material || !tine_count) {
                        throw "Missing handle material/tine count.";
                    }
                    insert_garden_query = 'INSERT INTO Rake (tool_id, handle_material, tine_count) ' + 
                                          'VALUES ($1, $2, $3);';
                    garden_values = [new_tool_id, handle_material, tine_count];
                    break;
                case 'Striking':
                    if (!handle_material || !head_weight) {
                        throw "Missing handle material/head weight.";
                    }
                    insert_garden_query = 'INSERT INTO StrikingTool (tool_id, handle_material, head_weight) ' + 
                                          'VALUES ($1, $2, $3);';
                    garden_values = [new_tool_id, handle_material, head_weight];
                    break;
            }

            if (insert_garden_query.length == 0 || garden_values.length == 0) {
                throw "Invalid garden tool";
            }

            await client.query(insert_garden_query, garden_values);
        }

        await client.query('COMMIT'); // End transaction
        reply("Successfully added the tool.").code(200);
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        reply(error).code(400);
    } finally { 
        await client.release();
    }
}

/*
    sample request #1:
    {
        "category": "Power",
        "sub_type": "Saw",
        "sub_option": "Circular",
        "power_source": "Cordless",
        "manufacturer": "Phillips",
        "material": "",
        "width_or_diameter": 3.50,
        "length": 8.75,
        "weight": 19.50,
        "purchase_price": 35.00,
        "clerk_id": 3,
        "blade_size": 7.75,
        "volt_rating":110,
        "amp_rating":1.0,
        "min_rpm_rating": 2000,
        "battery_type":"Li-Ion",
        "accessories": [
            {
                "description": "7.2V Li-Ion Battery",
                "quantity": 2
            },
            {
                "description": "Hard Case",
                "quantity": 5
            }
        ]
    }
*/
