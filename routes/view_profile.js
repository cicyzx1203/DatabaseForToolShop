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
  path: '/view_profile', 
  config: {
    validate: {
      payload: {
        customer_id: Joi.number().integer().required()
      }
    },
    handler: ViewProfile,
      cors: {
          origin: ['*'],
          additionalHeaders: ['cache-control', 'x-requested-with']
      }
  }
};

async function ViewProfile (request, reply) { // Make this function ASYNC in order to avoid using promises
 
  let customer_id = request.payload.customer_id;
  var email;
  var full_name;
  var home_phone = '';
  var work_phone = '';
  var cell_phone = '';
  var address;
 
  const get_user_profile = 'SELECT * FROM Customer LEFT OUTER JOIN CustomerPhoneNumber ON Customer.customer_id = CustomerPhoneNumber.customer_id WHERE Customer.customer_id= $1';
  const client = await pool.connect();

  try {
    const res = await client.query(get_user_profile, [customer_id]);
    // console.log(res);

    if (res.rowCount == 0) {
      reply("No such user.").code(400);
      await client.release();
      return;
    } else {
      email = res.rows[0].email;
      if (res.rows[0].middle_name) {
          full_name = res.rows[0].first_name + ' ' + res.rows[0].middle_name + ' ' + res.rows[0].last_name;
      } else {
          full_name = res.rows[0].first_name + ' ' + res.rows[0].last_name;
      }
      address = res.rows[0].street.concat(', ', res.rows[0].city, ', ', res.rows[0].state, ' ', res.rows[0].zip_code);
  
      for (i = 0; i < res.rowCount; i++) {
        if (res.rows[i].number_type === 'home_phone'){ 
          //console.log('home_phone');
          home_phone = res.rows[i].area_code + '' + res.rows[i].phone + '' + (res.rows[i].extension || '');
          continue;
        }
        if (res.rows[i].number_type === 'work_phone'){
            work_phone = res.rows[i].area_code + '' + res.rows[i].phone + '' + (res.rows[i].extension || '');
            continue;
        }
        if (res.rows[i].number_type === 'cell_phone'){
            cell_phone = res.rows[i].area_code + '' + res.rows[i].phone + '' + (res.rows[i].extension || '');
            continue;
        }
      } 
      // console.log(customerid);
      // console.log(full_name);
      // console.log(address);
    }
  } catch (error) {
    console.log(error);
    await client.release();
    return reply(error).code(400);
  }

  var reservations = [];
  const get_resv_info = 'SELECT * from Reservation where customer_id = $1 ORDER BY end_date DESC, confirmation_number';
  try {
    const res2 = await client.query(get_resv_info, [customer_id]);
    //console.log(res2);
    var tools = [];
    
    if (res2.rowCount > 0){
      var resv_id = 0;
      var start_date;
      var end_date;
      var number_of_days;
      var dropoff_id; 
      var pickup_id;
      var dropoff_name;
      var pickup_name;
      var tool_deposit = 0;
      var tool_rental = 0;
      var toolid;
      var tool_name; 
      for ( i = 0; i < res2.rowCount; i++) {
        if (res2.rows[i].confirmation_number != resv_id) {
          if (resv_id != 0) {
            reservations.push({'reservation_id':resv_id, 
                              'tools': tools,
                              'start_date': start_date,
                              'end_date': end_date,
                              'pick_up_clerk': pickup_name,
                              'drop_off_clerk': dropoff_name,
                              'number_of_days' : number_of_days,
                              'total_deposit_price': tool_deposit.toFixed(2),
                              'total_rental_price': tool_rental.toFixed(2)});
          }
          //console.log(reservations);        
          resv_id = res2.rows[i].confirmation_number;
          start_date = res2.rows[i].start_date.toISOString().slice(0,10);
          end_date = res2.rows[i].end_date.toISOString().slice(0,10);
          number_of_days = (res2.rows[i].end_date - res2.rows[i].start_date) / 86400000 + 1 ;
          dropoff_id = res2.rows[i].clerk_id_dropoff;
          pickup_id = res2.rows[i].clerk_id_pickup;

          const get_pickup_name = 'SELECT first_name, middle_name, last_name FROM Clerk where clerk_id = $1';
          const res3 = await client.query(get_pickup_name, [pickup_id]);
          //console.log(res3);
          if (res3.rowCount > 0) {
            if (res3.rows[0].middle_name) {
              pickup_name = res3.rows[0].first_name + ' ' + res3.rows[0].middle_name + ' ' + res3.rows[0].last_name;
            } else {
              pickup_name = res3.rows[0].first_name + ' ' + res3.rows[0].last_name;
            }
          } else {
            pickup_name = '';
          }
          
          const get_dropoff_name = 'SELECT first_name, middle_name, last_name FROM Clerk where clerk_id = $1';
          const res4 = await client.query(get_dropoff_name, [dropoff_id]);
          //console.log(res4);
          if (res4.rowCount > 0) {
            if (res4.rows[0].middle_name) {
              dropoff_name = res4.rows[0].first_name + ' ' + res4.rows[0].middle_name + ' ' + res4.rows[0].last_name;
            } else {
              dropoff_name = res4.rows[0].first_name + ' ' + res4.rows[0].last_name;
            }
          } else {
            dropoff_name = '';
          }

          tool_deposit = 0;
          tool_rental = 0;
          tools = [];
        }
            
        toolid = res2.rows[i].tool_id;
        const get_tool_info = 'SELECT purchase_price, power_source, sub_option, sub_type from Tool where tool_id = $1';
        const res5 = await client.query(get_tool_info, [toolid]);
        //console.log(res5);
        tool_name = '';
        if ((res5.rows[0].power_source).toLowerCase() != 'manual') {
          tool_name += res5.rows[0].power_source + ' ';
        }
        tool_name = tool_name + res5.rows[0].sub_option + ' ' + res5.rows[0].sub_type;
        //console.log(tool_name);
        tools.push(tool_name);


        var daily_rental_price = Math.ceil(15 * res5.rows[0].purchase_price) / 100;
        tool_deposit += Math.ceil(res5.rows[0].purchase_price * 40) / 100 ;
        //console.log(tool_deposit);
        tool_rental += Math.round(daily_rental_price * number_of_days * 100) / 100;
        //console.log(tool_rental);
      }

      reservations.push({'reservation_id':resv_id,
                        'tools': tools,
                        'start_date': start_date,
                        'end_date': end_date,
                        'pick_up_clerk': pickup_name,
                        'drop_off_clerk': dropoff_name,
                        'number_of_days' : number_of_days,
                        'total_deposit_price': tool_deposit.toFixed(2),
                        'total_rental_price': tool_rental.toFixed(2)});
    }
  } catch (error) {
    console.log(error);
    await client.release();
    return reply(error).code(400);
  }
         
  let returnPayload = {
        'email': email,
        'full_name': full_name,
        'home_phone' : home_phone,
        'work_phone' : work_phone,
        'cell_phone' : cell_phone,
        'address' : address,
        'reservations' : reservations 
      };

  reply(JSON.stringify(returnPayload, null, 4)).code(200);
  await client.release();
}

/*
  sample request #1:
  user with multiple reservations where not all reservations have clerk info
  {
    "username": ".3h.e-i'd.a_.y."
  }

  sample response #2:
  {
    "email": "heiday@gmail",
    "full_name": "Alexa Hi There",
    "home_phone": "1111334441626",
    "work_phone": "",
    "cell_phone": "2211334441",
    "address": "11 Street_address, New York, South Dakota 12414-1222",
    "reservations": [
        {
            "reservation_id": 14,
            "tools": [
                "Rigid Straight",
                "Rigid Straight"
            ],
            "start_date": "2017-11-22",
            "end_date": "2017-11-28",
            "pick_up_clerk": "Steve B Adam",
            "drop_off_clerk": "",
            "number_of_days": 7,
            "total_deposit_price": "1.00",
            "total_rental_price": "2.66"
        },
        {
            "reservation_id": 5,
            "tools": [
                "Hex Screwdriver"
            ],
            "start_date": "2017-11-13",
            "end_date": "2017-11-18",
            "pick_up_clerk": "Steve Bob Adam",
            "drop_off_clerk": "Steve Bob Adam",
            "number_of_days": 6,
            "total_deposit_price": "0.50",
            "total_rental_price": "1.14"
        }
    ]
  }

  sample request #2:
  user without any reservations
  {
    "username": "newuser1"
  }

  sample response #2:
  {
    "email": "newuser123@a.com",
    "full_name": "New User",
    "home_phone": "4725342513",
    "work_phone": "",
    "cell_phone": "462537951346399",
    "address": "111 Abel Street, St. Joseph, Alabama 66562-4652",
    "reservations": []
  }

  sample request #3:
  user with one completed reservation
  {
    "username": "jk123hi12345"
  }

  sample response #3:
  {
    "email": "jkadam@gmail",
    "full_name": "Adam Smith",
    "home_phone": "",
    "work_phone": "121173434163433116",
    "cell_phone": "4514531341",
    "address": "11 Hope Street, New Jersey, South Dakota 12414-1222",
    "reservations": [
        {
            "reservation_id": 16,
            "tools": [
                "Rigid Straight"
            ],
            "start_date": "2017-01-15",
            "end_date": "2017-01-20",
            "pick_up_clerk": "Steve Bob Adam",
            "drop_off_clerk": "Steve B Adam",
            "number_of_days": 6,
            "total_deposit_price": "0.50",
            "total_rental_price": "1.14"
        }
    ]
  }
*/
