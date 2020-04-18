-- Sample values to enter into the tables on our database.

INSERT INTO Customer (customer_id, username, email, password, first_name, middle_name, last_name, primary_number_type, street, city, state, zip_code, credit_card_name, credit_card_number, cvc, exp_date_month, exp_date_year)
VALUES ();

INSERT INTO CustomerPhoneNumber (customer_id, number_type, area_code, phone, extension)
VALUES ();

INSERT INTO Clerk (clerk_id, username, email, password, first_name, middle_name, last_name, date_of_hire)
VALUES ();

INSERT INTO Tool (tool_id, category, sub_type, sub_option, power_source, manufacturer, material, width_or_diameter, length, weight, purchase_price, clerk_id_add)
VALUES ();

INSERT INTO Reservation (tool_id, confirmation_number, start_date, end_date, customer_id, clerk_id_pickup, clerk_id_dropoff)
VALUES ();

INSERT INTO SaleOrder (tool_id, for_sale_date, clerk_id_create)
VALUES ();

INSERT INTO Purchase (tool_id, confirmation_number, sold_date, customer_id)
VALUES ();

INSERT INTO Service (tool_id, service_id, start_date, end_date, cost, clerk_id_request)
VALUES ();

INSERT INTO Accessory (tool_id, accessory_description, quantity)
VALUES ();

INSERT INTO HandPlier (tool_id, adjustable)
VALUES ();

INSERT INTO HandWrench (tool_id, drive_size)
VALUES ();

INSERT INTO HandHammer (tool_id, anti_vibration)

INSERT INTO HandScrewdriver (tool_id, screw_size)
VALUES ();

INSERT INTO HandGun (tool_id, gauge_rating, capacity)
VALUES ();

INSERT INTO HandSocket (tool_id, drive_size, sae_size)
VALUES ();

INSERT INTO HandRatchet (tool_id, drive_size)
VALUES ();

INSERT INTO StepLadder (tool_id, step_count, weight_capacity, pail_shelf)
VALUES ();

INSERT INTO StraightLadder (tool_id, step_count, weight_capacity, rubber_feet)
VALUES ();

INSERT INTO Digger (tool_id, handle_material, blade_length, blade_width)
VALUES ();

INSERT INTO Pruner (tool_id, handle_material, blade_length, blade_material)
VALUES ();

INSERT INTO WheelBarrow (tool_id, handle_material, bin_volume, bin_material, wheel_count)
VALUES ();

INSERT INTO Rake (tool_id, handle_material, head_weight)
VALUES ();

INSERT INTO StrikingTool (tool_id, handle_material, head_weight)
VALUES ();

INSERT INTO CordlessPowerTool (tool_id, battery_type)
VALUES ();

INSERT INTO PowerMixer (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, motor_rating, drum_size)
VALUES ();

INSERT INTO PowerGenerator (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, power_rating)
VALUES ();

INSERT INTO PowerSaw (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, blade_size)
VALUES ();

INSERT INTO PowerAirCompressor (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, pressure_rating, tank_size)
VALUES ();

INSERT INTO PowerDrill (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, adjustable_clutch, min_torque_rating, max_torque_rating)
VALUES ();

INSERT INTO PowerSander (tool_id, volt_rating, amp_rating, min_rpm_rating, max_rpm_rating, dust_bag)
VALUES ();
