-- Sample values to enter into the tables on our database.

INSERT INTO Customer (username, email, password, first_name, middle_name, last_name, primary_number_type, street, city, state, zip_code, credit_card_name, credit_card_number, cvc, exp_date_month, exp_date_year)
VALUES ('marino13', 'marino13@hotmail.com', 'miamiDolphins', 'Dan', 'Constantine', 'Marino', 'cell', '347 Don Shula Dr', 'Miami', 'FL', '33056', 'NFL', '1234567891234567', '123', 'March', '2018');

INSERT INTO CustomerPhoneNumber (number_type, area_code, phone, extension)
VALUES ('cell', '305', '123', '4567', '8912');

INSERT INTO Clerk (username, email, password, first_name, middle_name, last_name, date_of_hire)
VALUES ('shula7', 'shula7@aol.com', '1972Season', 'Don', 'Francis', 'Shula', '1970-1-1');

INSERT INTO Tool (category, sub_type, sub_option, power_source, manufacturer, material, width_or_diameter, length, weight, purchase_price)
VALUES ('power', 'wired', 'stuff', 'DC', 'Black & Decker', 'metal', '8', '3', '10', '600');

INSERT INTO Reservation (confirmation_number, start_date, end_date, customer_id, clerk_id_pickup, clerk_id_dropoff)
VALUES ('1234', '2017-2-3', '2017-2-6', '1', '1');

INSERT INTO SaleOrder (for_sale_date)
VALUES ('2017-4-5');

INSERT INTO Purchase (confirmation_number, sold_date)
VALUES ('1234', '2017-5-6');

INSERT INTO Service (start_date, end_date, cost)
VALUES ('2017-7-8', '2017-9-10', '600');

INSERT INTO Accessory (accessory_description, quantity)
VALUES ('molded handle wrap', '7');

INSERT INTO HandPlier (adjustable)
VALUES ('TRUE');

INSERT INTO HandWrench (drive_size)
VALUES ('8');

INSERT INTO HandHammer (anti_vibration)
VALUES ('FALSE');

INSERT INTO HandScrewdriver (screw_size)
VALUES ('2');

INSERT INTO HandGun (gauge_rating, capacity)
VALUES ('2', '7');

INSERT INTO HandSocket (drive_size, sae_size)
VALUES ('8', '9');

INSERT INTO HandRatchet (drive_size)
VALUES ('4');

INSERT INTO StepLadder (step_count, weight_capacity, pail_shelf)
VALUES ('12', '350', 'TRUE');

INSERT INTO StraightLadder (step_count, weight_capacity, rubber_feet)
VALUES ('14', '400', 'FALSE');

INSERT INTO Digger (handle_material, blade_length, blade_width)
VALUES ('plastic', '12', '9');

INSERT INTO Pruner (handle_material, blade_length, blade_material)
VALUES ('metal', '16', 'carbon steel');

INSERT INTO WheelBarrow (handle_material, bin_volume, bin_material, wheel_count)
VALUES ('rubber', '400', 'chromoly', '1');

INSERT INTO Rake (handle_material, head_weight)
VALUES ('metal', '3');

INSERT INTO StrikingTool (handle_material, head_weight)
VALUES ('rubber', '5');

INSERT INTO CordlessPowerTool (battery_type)
VALUES ('lithium');

INSERT INTO PowerMixer (volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, motor_rating, drum_size)
VALUES ('120', '12', '500', '2000', '300', '90');

INSERT INTO PowerGenerator (volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, power_rating)
VALUES ('240', '120', '1000', '4000', '70');

INSERT INTO PowerSaw (volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, blade_size)
VALUES ('80', '100', '1000', '10000', '15');

INSERT INTO PowerAirCompressor (volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, pressure_rating, tank_size)
VALUES ('400', '10', '1', '2', '20', '200');

INSERT INTO PowerDrill (volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, adjustable_clutch, min_torque_rating, max_torque_rating)
VALUES ('30', '50', '100', '1000', 'TRUE', '200', '500');

INSERT INTO PowerSander (volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, dust_bag)
VALUES ('40', '60', '800', '1000', 'FALSE');
