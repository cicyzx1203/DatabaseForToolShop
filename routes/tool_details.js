const { Pool } = require('pg') // Load the Node-postgres module
const pool = new Pool({ // Create a client using your credentials
  user: 'gatechuser',
  host: 'localhost',
  database: 'cs6400_fa17_team036',
  password: 'gatech123',
  port: 5432,
})

const Joi = require('joi');

module.exports = {
  method: 'POST', 
  path: '/tool_details', 
  config: {
    validate: {
        payload: {
            tool_id: Joi.number().integer().required()
        }        
    },
    handler: ToolDetails,
    cors: {
        origin: ['*'],
        additionalHeaders: ['cache-control', 'x-requested-with']
    }
  }
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

async function cordlessAccessories(client, int1, int2, int3, accessories) { 
  //const get_battery_type = 'SELECT * FROM cordlesspowertool WHERE tool_id = $1';
  try{
    /*const res3 = await client.query(get_battery_type, [int1]);
    if (res3.rowCount == 0) {
      throw ("no battery record for this tool.");
    } else {
      accessory_name = '1. ' + int2 + ' Volt ' + int3 + ' AMP ' + res3.rows[0].battery_type + ' Battery';
      accessories.push(accessory_name);*/

      const get_other_accessories = 'SELECT * FROM accessory WHERE tool_id = $1';
      const res4 = await client.query(get_other_accessories, [int1]);
      if (res4.rowCount == 0) {
        return;
      } else {
        for (i = 0; i < res4.rowCount; i++) {
          accessory_name = parseInt(i + 1) + '. (' + res4.rows[i].quantity + ') ' + res4.rows[i].accessory_description;
          accessories.push(accessory_name);
        }
      }
    //}
  } catch (error) {
    console.log(error);
  }
}

async function electricOrGasAccessories(client, int1, accessories) {
  const get_other_accessories = 'SELECT * FROM accessory AS a WHERE a.tool_id = $1';
  try {
    const res4 = await client.query(get_other_accessories, [int1]);

    for (i = 0; i < res4.rowCount; i++) {
      accessory_name = parseInt(i+1) + '. (' + res4.rows[i].quantity + ') ' + res4.rows[i].accessory_description;
      accessories.push(accessory_name);
    }  
  } catch (error) {
    console.log(error);
  }
}

async function ToolDetails (request, reply) { // Make this function ASYNC in order to avoid using promises
  let tool_id = request.payload.tool_id;

  const get_tool_info = 'SELECT * FROM Tool WHERE tool_id = $1';
  const client = await pool.connect();

  var tool_type = '';
  var short_description = '';
  var full_description = '';
  var deposit_price = 0;
  var rental_price = 0;
  var accessories = [];

  var res;
  try {
      res = await client.query(get_tool_info, [tool_id]);
      if (res.rowCount == 0) {
        throw "Tool doesn't exist.";
      }
  } catch (error) {
    console.log(error);
    await client.release();
    let returnPayload = {
      'error': 'No such tool_id: ' + tool_id
    }
    return reply(returnPayload).code(400);
  }
  
  let value = res.rows[0];

  try {
    tool_type = capitalizeFirstLetter(res.rows[0].category).concat(' ', 'Tool');

    deposit_price = (Math.ceil(40 * value.purchase_price) / 100).toFixed(2);
    rental_price = (Math.ceil(15 * value.purchase_price) / 100).toFixed(2);
    
    if (value.power_source != 'Manual') {
      short_description += value.power_source + ' ';
    }
    short_description = short_description + value.sub_option + ' ' + value.sub_type;
  
    let width_or_diameter = value.width_or_diameter;
    let length = value.length;
    let weight = value.weight;
    let sub_option = value.sub_option;
    let sub_type = value.sub_type;
    let manufacturer = value.manufacturer;
    let material = value.material;

    if (capitalizeFirstLetter(sub_type) == 'Screwdriver') {
      const get_tool_info_query = 'SELECT * from handscrewdriver WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);
      
      var material_text = material == null ? '' : capitalizeFirstLetter(material) + ' ';

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb. '
                        + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type) + ' ' + material_text + '#'
                        + res2.rows[0].screw_size + ' by ' + capitalizeFirstLetter(manufacturer);
    }

    else if (capitalizeFirstLetter(sub_type) == 'Ratchet') {
      const get_tool_info_query = 'SELECT * from handratchet WHERE tool_id = $1';  
      const res2 = await client.query(get_tool_info_query, [tool_id]);
      
      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight
                        + ' lb.' + material_text + ' ' + capitalizeFirstLetter(sub_option)
                        + ' ' + capitalizeFirstLetter(sub_type) + ' ' + res2.rows[0].drive_size + 'in. by '
                        + capitalizeFirstLetter(manufacturer);
    }

    else if (capitalizeFirstLetter(sub_type) == 'Pliers') {
      const get_tool_info_query = 'SELECT * from handplier WHERE tool_id = $1'; 
      const res2 = await client.query(get_tool_info_query, [tool_id]);
      
      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var adjustable_text = res2.rows[0].adjustable ? ' Adjustable by ' + capitalizeFirstLetter(manufacturer) : '';

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L '
                          + weight + ' lb.' + material_text + ' '
                          + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type)
                          + adjustable_text;
    }
 
    else if (capitalizeFirstLetter(sub_type) == 'Hammer') {
      const get_tool_info_query = 'SELECT * from handhammer WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);
    
      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var anti_text = res2.rows[0].anti_vibration ? ' Anti-vibration by ' + capitalizeFirstLetter(manufacturer) : '';

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight
        + ' lb.' + material_text
        + ' ' + capitalizeFirstLetter(sub_option)
        + ' ' + capitalizeFirstLetter(sub_type) + anti_text;
    }
  
    else if (capitalizeFirstLetter(sub_type) == 'Gun') {
      const get_tool_info_query = 'SELECT * from handgun WHERE tool_id = $1'; 
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb. '
        + res2.rows[0].gauge_rating + 'G ' + res2.rows[0].capacity + ' Capacity'
        +  material_text + ' ' + capitalizeFirstLetter(sub_option)
        + ' ' + capitalizeFirstLetter(sub_type) + ' '
        + 'by ' + capitalizeFirstLetter(manufacturer);
    } 

    else if (capitalizeFirstLetter(sub_type) == 'Socket') {
      const get_tool_info_query = 'SELECT * from handsocket WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight
        + ' lb. drive-size ' + res2.rows[0].drive_size + ' in. sae-size ' + res2.rows[0].sae_size
        + ' in.' + material_text + ' ' + capitalizeFirstLetter(sub_option) + ' '
        + capitalizeFirstLetter(sub_type) + ' by ' + capitalizeFirstLetter(manufacturer);
    }

    else if (capitalizeFirstLetter(sub_type) == 'Wrench') {
      const get_tool_info_query = 'SELECT * from HandWrench WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var drive_size = res2.rows[0].drive_size;
      var drive_size_text = drive_size == null ? '' : ' drive-size ' + res2.rows[0].drive_size + ' in.';

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight
        + ' lb.' + material_text + ' ' + capitalizeFirstLetter(sub_option) + ' '
        + capitalizeFirstLetter(sub_type) + ' by ' + capitalizeFirstLetter(manufacturer) + drive_size_text;
    }

    else if (capitalizeFirstLetter(sub_type) == 'Pruner') {
      const get_tool_info_query = 'SELECT * FROM pruner WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var blade_material = res2.rows[0].blade_material;
      var blade_material_text = blade_material == null ? '' : capitalizeFirstLetter(blade_material) + ' Blade';

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb. '
        + capitalizeFirstLetter(res2.rows[0].handle_material) + ' handle ' + res2.rows[0].blade_length
        + ' in. ' + blade_material_text + material_text + ' '
        + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type)
        + ' by ' + capitalizeFirstLetter(manufacturer);
    }

    else if (capitalizeFirstLetter(sub_type) == 'Striking') {
      const get_tool_info_query = 'SELECT * FROM strikingtool WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb. '
        + capitalizeFirstLetter(res2.rows[0].handle_material) + '  Handle ' + res2.rows[0].head_weight
        + ' lb. Axe Head Weight' + material_text + ' ' +  capitalizeFirstLetter(sub_option)
        + ' ' + capitalizeFirstLetter(sub_type) + ' by ' + capitalizeFirstLetter(manufacturer);
    }

    else if (capitalizeFirstLetter(sub_type) == 'Digger') {
      const get_tool_info_query = 'SELECT * FROM digger WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb. '
        + capitalizeFirstLetter(res2.rows[0].handle_material) + '  Handle ' + res2.rows[0].blade_length
        + ' in.L x ' + res2.rows[0].blade_width + ' in.W Blade' + material_text + ' '
        + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type) + ' by ' + capitalizeFirstLetter(manufacturer);
    }

    else if (capitalizeFirstLetter(sub_type) == 'Rakes') {
      const get_tool_info_query = 'SELECT * FROM rake WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight
              + ' lb. ' + capitalizeFirstLetter(res2.rows[0].handle_material) + '  Handle '
              + res2.rows[0].tine_count + ' Tines' + material_text + ' '
              + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type)
              + ' by ' + capitalizeFirstLetter(manufacturer);
    }

    else if (capitalizeFirstLetter(sub_type) == 'Wheelbarrows') {
      const get_tool_info_query = 'SELECT * FROM wheelbarrow WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var bin_volume = res2.rows[0].bin_volume;
      var bin_volume_text = bin_volume == null ? '' : ' ' + bin_volume + ' cu ft.';

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb. '
          + capitalizeFirstLetter(res2.rows[0].handle_material) + '  Handle '
          + capitalizeFirstLetter(res2.rows[0].bin_material) + bin_volume_text
          + ' ' + res2.rows[0].wheel_count + ' wheeled' + material_text
          + ' ' + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type)
          + ' by ' + capitalizeFirstLetter(manufacturer);
    }

    else if (capitalizeFirstLetter(sub_type) == 'Straight') {
      const get_tool_info_query = 'SELECT * FROM straightladder WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var rubber_feet_text = res2.rows[0].rubber_feet ? ' with Rubber Feet by ' + capitalizeFirstLetter(manufacturer) : '';

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb. Weight '
        + res2.rows[0].weight_capacity + ' lb. Capacity ' + res2.rows[0].step_count + ' Steps'
        + material_text + ' ' + capitalizeFirstLetter(sub_option) + ' '
        + capitalizeFirstLetter(sub_type) + rubber_feet_text;
    }

    else if (capitalizeFirstLetter(sub_type) == 'Step') {
      const get_tool_info_query = 'SELECT * FROM stepladder WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var pail_shelf_text = res2.rows[0].pail_shelf ? ' with Pail Shelf by ' + capitalizeFirstLetter(manufacturer) : '';

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight
          + ' lb. Weight ' + res2.rows[0].weight_capacity + ' lb. Capacity '
          + res2.rows[0].step_count + ' Steps' + material_text
          + ' ' + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type)
          + pail_shelf_text;
    }

    else if (capitalizeFirstLetter(sub_type) == 'Saw') {
      const get_tool_info_query = 'SELECT * FROM powersaw WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var max_rpm = res2.rows[0].max_rpm_rating;
      var max_rpm_text = max_rpm == null ? '' : '/' + max_rpm;

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L '
          + weight + ' lb.Weight ' + res2.rows[0].blade_size + ' in.Blade '
          + capitalizeFirstLetter(res.rows[0].power_source) + ' ' + capitalizeFirstLetter(sub_type)
          + material_text
          + ' ' +  res2.rows[0].volt_rating + ' Volt ' + res2.rows[0].amp_rating
          + ' Amp ' + res2.rows[0].min_rpm_rating + max_rpm_text
          + ' RPM by ' + capitalizeFirstLetter(manufacturer); 
    
      if (capitalizeFirstLetter(res.rows[0].power_source) == 'Cordless') {
        await cordlessAccessories(client, tool_id, res2.rows[0].volt_rating, res2.rows[0].amp_rating, accessories);        
      } else {
        await electricOrGasAccessories(client, tool_id, accessories);
      } 
    }

    else if (capitalizeFirstLetter(sub_type) == 'Sander') {
      const get_tool_info_query = 'SELECT * FROM powersander WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var max_rpm = res2.rows[0].max_rpm_rating;
      var max_rpm_text = max_rpm == null ? '' : '/' + max_rpm;
      var dust_bag_text = res2.rows[0].dust_bag ? ' with Dust Bag by ' + capitalizeFirstLetter(manufacturer) : "";

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb.Weight '
            + capitalizeFirstLetter(res.rows[0].power_source)
            + ' ' + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type) + material_text +
            + ' ' + res2.rows[0].volt_rating + ' Volt ' + res2.rows[0].amp_rating + ' Amp ' + res2.rows[0].min_rpm_rating
            + max_rpm_text + ' RPM' + dust_bag_text;
      
      if (capitalizeFirstLetter(res.rows[0].power_source) == 'Cordless') {
        await cordlessAccessories(client, tool_id, res2.rows[0].volt_rating, res2.rows[0].amp_rating, accessories);
      } else {
        await electricOrGasAccessories(client, tool_id, accessories);
      }
    }

    else if (capitalizeFirstLetter(sub_type) == 'Generator') {
      const get_tool_info_query = 'SELECT * FROM powergenerator WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var max_rpm = res2.rows[0].max_rpm_rating;
      var max_rpm_text = max_rpm == null ? '' : '/' + max_rpm;

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb.Weight '
          + res2.rows[0].power_rating + ' Watt' + material_text + ' '
          + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type)
          + ' ' +  res2.rows[0].volt_rating + ' Volt ' + res2.rows[0].amp_rating + ' Amp '
          + res2.rows[0].min_rpm_rating + max_rpm_text
          + ' RPM by ' + capitalizeFirstLetter(manufacturer);

      if (capitalizeFirstLetter(res.rows[0].power_source) == 'Cordless') {
        await cordlessAccessories(client, tool_id, res2.rows[0].volt_rating, res2.rows[0].amp_rating, accessories);
      } else {
        await electricOrGasAccessories(client, tool_id, accessories);
      } 
    }
    
    else if (capitalizeFirstLetter(sub_type) == 'Mixer') {
      const get_tool_info_query = 'SELECT * FROM powermixer WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var max_rpm = res2.rows[0].max_rpm_rating;
      var max_rpm_text = max_rpm == null ? '' : '/' + max_rpm;

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight
          + ' lb.Weight ' + res2.rows[0].drum_size + ' cu ft.Drum ' + res2.rows[0].motor_rating
          + ' HP Motor ' + capitalizeFirstLetter(res.rows[0].power_source)
          + material_text+ ' ' + capitalizeFirstLetter(sub_option)
          + ' ' + capitalizeFirstLetter(sub_type) + ' ' +  res2.rows[0].volt_rating + ' Volt '
          + res2.rows[0].amp_rating + ' Amp ' + res2.rows[0].min_rpm_rating + max_rpm_text
          + ' RPM by ' + capitalizeFirstLetter(manufacturer); 

      if (capitalizeFirstLetter(res.rows[0].power_source) == 'Cordless') {
        await cordlessAccessories(client, tool_id, res2.rows[0].volt_rating, res2.rows[0].amp_rating, accessories);
      } else {
        await electricOrGasAccessories(client, tool_id, accessories);
      }
    }

    else if (capitalizeFirstLetter(sub_type) == 'Air-Compressor') {
      const get_tool_info_query = 'SELECT * FROM poweraircompressor WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);
      var max_rpm = res2.rows[0].max_rpm_rating;
      var max_rpm_text = max_rpm == null ? '' : '/' + max_rpm;
      var pressure_rating = res2.rows[0].pressure_rating;
      var pressure_rating_text = pressure_rating == null ? '' : pressure_rating + ' psi ';

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb.Weight '
            + pressure_rating_text + res2.rows[0].tank_size + ' gallon Tank '
            + capitalizeFirstLetter(res.rows[0].power_source) + material_text
            + ' ' + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type) + ' '
            + res2.rows[0].volt_rating + ' Volt ' + res2.rows[0].amp_rating + ' Amp ' + res2.rows[0].min_rpm_rating
            + max_rpm_text +  ' RPM by ' + capitalizeFirstLetter(manufacturer);
      
      if (capitalizeFirstLetter(res.rows[0].power_source) == 'Cordless') {
       await cordlessAccessories(client, tool_id, res2.rows[0].volt_rating, res2.rows[0].amp_rating, accessories);
      } else {
        await electricOrGasAccessories(client, tool_id, accessories);
      }
    }
    
    else if (capitalizeFirstLetter(sub_type) == 'Drill') {
      const get_tool_info_query = 'SELECT * FROM powerdrill WHERE tool_id = $1';
      const res2 = await client.query(get_tool_info_query, [tool_id]);

      var material_text = material == null ? '' : ' ' + capitalizeFirstLetter(material);

      var max_rpm = res2.rows[0].max_rpm_rating;
      var max_rpm_text = max_rpm == null ? '' : '/' + max_rpm;

      var max_torque = res2.rows[0].max_torque_rating;
      var max_torque_text = max_torque == null ? '' : '/' + max_torque;

      var adjustable_clutch_text = res2.rows[0].adjustable_clutch ? ' with Adjustable Clutch' : '';

      full_description = width_or_diameter + ' in.W x ' + length + ' in.L ' + weight + ' lb.Weight '
              + res2.rows[0].min_torque_rating + max_torque_text + ' ft-lb Torque '
              + capitalizeFirstLetter(res.rows[0].power_source) + material_text
              + ' ' + capitalizeFirstLetter(sub_option) + ' ' + capitalizeFirstLetter(sub_type)
              + adjustable_clutch_text + ' ' +  res2.rows[0].volt_rating + ' Volt ' + res2.rows[0].amp_rating
              + ' Amp ' + res2.rows[0].min_rpm_rating + max_rpm_text + ' RPM by '
              + capitalizeFirstLetter(manufacturer);
    
      if (capitalizeFirstLetter(res.rows[0].power_source) == 'Cordless') {
        await cordlessAccessories(client, tool_id, res2.rows[0].volt_rating, res2.rows[0].amp_rating, accessories);
      } else {
        await electricOrGasAccessories(client, tool_id, accessories);
      }  
    }
  } catch (error) {
    console.log(error);
    reply("Unable to fetch tool info.").code(400);
  } finally { 
    await client.release();
  }

  var accessories_string = '';
  if (accessories.length > 0) {
    for (i = 0; i < accessories.length; i++) {
      accessories_string += accessories[i] + ' ';
    }
  } else {
    accessories_string = 'None';
  }

  let returnPayload = {
    'tool_id': tool_id,
    'tool_type': tool_type,
    'short_description': short_description,
    'full_description': full_description,
    'deposit_price': deposit_price,
    'rental_price': rental_price,
    'accessories': accessories_string
  };

  return reply(returnPayload).code(200);
}

/*
  sample request:
  {
    "tool_id": 71
  }

  sample response:
  {
    "tool_id":71,
    "tool_type":"Power Tool",
    "short_description":"Cordless Circular Saw",
    "full_description":"4.1250 in.W x 13.1250 in.L 16.7500 lb.Weight 9.7500 in.Blade Cordless Saw Steel 220 Volt 5.0000 Amp 3500/4500 RPM by DEWALT",
    "deposit_price":"9.84",
    "rental_price":"3.69",
    "accessories":["1. (1) 7.2V NiMH Battery","2. (1) Hard Case"]}
*/