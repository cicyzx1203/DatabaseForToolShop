-- DROP USER IF EXISTS
DROP USER IF EXISTS gatechUser;
-- CREATE USER 
CREATE USER gatechUser WITH PASSWORD 'gatech123';
-- DROP DATABASE IF EXISTS
DROP DATABASE IF EXISTS cs6400_fa17_team036;

-- CREATE DATABASE Give Ownership to user 
CREATE DATABASE cs6400_fa17_team036
    WITH 
    OWNER = gatechUser
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;


-- Tables

-- Customer
CREATE TABLE Customer (
  customer_id serial not null PRIMARY KEY,
  username varchar(250) NOT NULL,
  email varchar(250) NOT NULL,
  password varchar(250) NOT NULL,
  first_name varchar(250) NOT NULL,
  middle_name varchar(250) NOT NULL,
  last_name varchar(250) NOT NULL,
  primary_number_type varchar(250) NOT NULL,
  street varchar(250) NOT NULL,
  city varchar(250) NOT NULL,
  state varchar(250) NOT NULL,
  zip_code varchar(10) NOT NULL,
  credit_card_name varchar(250) NOT NULL,
  credit_card_number int NOT NULL CHECK (credit_card_number > 0),
  cvc int NOT NULL CHECK (cvc > 0),
  exp_date_month varchar(9) NOT NULL,
  exp_date_year int NOT NULL CHECK (exp_date_year > 0) 
);
-- CustomerPhoneNumber
CREATE TABLE CustomerPhoneNumber (
  customer_id int NOT NULL REFERENCES Customer(customer_id),
  number_type varchar(250) NOT NULL,
  area_code int NOT NULL CHECK (area_code > 0),
  phone int NOT NULL CHECK (phone > 0),
  extension int NOT NULL CHECK (extension > 0),
  PRIMARY KEY (customer_id, number_type)
);

-- Clerk
CREATE TABLE Clerk (
  clerk_id serial NOT NULL PRIMARY KEY,
  username varchar(250) NOT NULL,
  email varchar(250) NOT NULL,
  password varchar(250) NOT NULL,
  first_name varchar(250) NOT NULL,
  middle_name varchar(250) NOT NULL,
  last_name varchar(250) NOT NULL,
  date_of_hire date NOT NULL
);

-- Tool
CREATE TABLE Tool (
  tool_id serial NOT NULL PRIMARY KEY,
  category varchar(250) NOT NULL,
  sub_type varchar(250) NOT NULL,
  sub_option varchar(250) NOT NULL,
  power_source varchar(250) NOT NULL,
  manufacturer varchar(250) NOT NULL,
  material varchar(250) NULL,
  width_or_diameter numeric(10,4) NOT NULL CHECK (width_or_diameter > 0),
  length numeric(10,4) NOT NULL CHECK (length > 0),
  weight numeric(10,4) NOT NULL CHECK (weight > 0),
  purchase_price numeric(10,4) NOT NULL CHECK (purchase_price > 0),
  clerk_id_add int NOT NULL references Clerk(clerk_id)
);
-- Reservation
CREATE TABLE Reservation (
  tool_id int NOT NULL references Tool(tool_id),
  confirmation_number int NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  customer_id int NOT NULL References Customer(customer_id),
  clerk_id_pickup int NULL References Clerk(clerk_id),
  clerk_id_dropoff int NULL References Clerk(clerk_id),
  Primary Key(tool_id, confirmation_number)
);
-- SaleOrder
CREATE TABLE SaleOrder (
  tool_id int NOT NULL PRIMARY KEY references Tool(tool_id),
  for_sale_date date NOT NULL,
  clerk_id_create int NOT NULL references Clerk(clerk_id)
);

-- Purchase
CREATE TABLE Purchase (
  tool_id int NOT NULL References SaleOrder(tool_id),
  confirmation_number int NOT NULL,
  sold_date date NOT NULL,
  customer_id int NOT NULL References Customer(customer_id),
  Primary Key (tool_id, confirmation_number)
);
-- Service
CREATE TABLE Service (
  tool_id int NOT NULL References Tool(tool_id),
  service_id serial NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  cost numeric(10,4) NOT NULL CHECK (cost > 0),
  clerk_id_request int NOT NULL References Clerk(clerk_id),
  Primary Key (tool_id, service_id)
);
-- Accessory
CREATE TABLE Accessory (
  tool_id int NOT NULL References Tool(tool_id),
  accessory_description varchar(1000) NOT NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  Primary Key (tool_id, accessory_description)
);

-- HandPlier
CREATE TABLE HandPlier (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  adjustable boolean NOT NULL
);
-- HandWrench
CREATE TABLE HandWrench (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  drive_size numeric(10,4) NULL CHECK (drive_size > 0)
);
-- HandHammer
CREATE TABLE HandHammer (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  anti_vibration boolean NULL
);
-- HandScrewdriver
CREATE TABLE HandScrewdriver (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  screw_size int NOT NULL
);
-- HandGun
CREATE TABLE HandGun (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  gauge_rating int NOT NULL CHECK (gauge_rating > 0),
  capacity int NOT NULL CHECK (capacity > 0)
);
-- HandSocket
CREATE TABLE HandSocket (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  drive_size numeric(10,4) NOT NULL CHECK (drive_size > 0),
  sae_size numeric(10,4) NOT NULL CHECK (sae_size > 0)
);
-- HandRatchet
CREATE TABLE HandRatchet (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  drive_size numeric(10,4) NOT NULL CHECK (drive_size > 0)
);
-- StepLadder
CREATE TABLE StepLadder (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  step_count int NOT NULL CHECK (step_count > 0),
  weight_capacity numeric(10,4) NOT NULL CHECK (weight_capacity > 0),
  pail_shelf boolean NULL
);
-- StraightLadder
CREATE TABLE StraightLadder (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  step_count int NOT NULL CHECK (step_count > 0),
  weight_capacity numeric(10,4) NOT NULL CHECK (weight_capacity > 0),
  rubber_feet boolean NULL
);
-- Digger
CREATE TABLE Digger (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  handle_material varchar(250) NOT NULL,
  blade_length numeric(10,4) NOT NULL CHECK (blade_length > 0),
  blade_width numeric(10,4) NOT NULL CHECK (blade_width > 0)
);
-- Pruner
CREATE TABLE Pruner (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  handle_material varchar(250) NOT NULL,
  blade_length numeric(10,4) NOT NULL CHECK (blade_length > 0),
  blade_material varchar(250) NULL
);
-- WheelBarrow
CREATE TABLE WheelBarrow (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  handle_material varchar(250) NOT NULL,
  bin_volume numeric(10,4) NULL CHECK (bin_volume > 0),
  bin_material varchar(250) NOT NULL,
  wheel_count int NOT NULL CHECK (wheel_count > 0)
);
-- Rake
CREATE TABLE Rake (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  handle_material varchar(250) NOT NULL,
  tine_count int NOT NULL CHECK (tine_count > 0)
);
-- StrikingTool
CREATE TABLE StrikingTool (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  handle_material varchar(250) NOT NULL,
  head_weight numeric(10,4) NOT NULL CHECK (head_weight > 0)
);
-- CordlessPowerTool
CREATE TABLE CordlessPowerTool (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  battery_type varchar(250) NOT NULL
);
-- PowerMixer
CREATE TABLE PowerMixer (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  volt_rating int NOT NULL CHECK (volt_rating > 0),
  amp_rating numeric(10,4) NOT NULL CHECK (amp_rating > 0),
  min_rpm_rating int NOT NULL CHECK (min_rpm_rating > 0),
  max_rpm_rating int NULL CHECK (max_rpm_rating > 0),
  motor_rating numeric(10,4) NOT NULL CHECK (motor_rating > 0),
  drum_size numeric(10,4) NOT NULL CHECK (drum_size > 0)
);
-- PowerGenerator
CREATE TABLE PowerGenerator (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  volt_rating int NOT NULL CHECK (volt_rating > 0),
  amp_rating numeric(10,4) NOT NULL CHECK (amp_rating > 0),
  min_rpm_rating int NOT NULL CHECK (min_rpm_rating > 0),
  max_rpm_rating int NULL CHECK (max_rpm_rating > 0),
  power_rating numeric(10,4) NOT NULL CHECK (power_rating > 0)
);
-- PowerSaw
CREATE TABLE PowerSaw (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  volt_rating int NOT NULL CHECK (volt_rating > 0),
  amp_rating numeric(10,4) NOT NULL CHECK (amp_rating > 0),
  min_rpm_rating int NOT NULL CHECK (min_rpm_rating > 0),
  max_rpm_rating int NULL CHECK (max_rpm_rating > 0),
  blade_size numeric(10,4) NOT NULL CHECK (blade_size > 0)
);
-- PowerAirCompressor
CREATE TABLE PowerAirCompressor (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  volt_rating int NOT NULL CHECK (volt_rating > 0),
  amp_rating numeric(10,4) NOT NULL CHECK (amp_rating > 0),
  min_rpm_rating int NOT NULL CHECK (min_rpm_rating > 0),
  max_rpm_rating int NULL CHECK (max_rpm_rating > 0),
  pressure_rating numeric(10,4) NULL CHECK (pressure_rating > 0),
  tank_size numeric(10,4) NOT NULL CHECK (tank_size > 0)
);

Create TABLE PowerDrill (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  volt_rating int NOT NULL CHECK (volt_rating > 0),
  amp_rating numeric(10,4) NOT NULL CHECK (amp_rating > 0),
  min_rpm_rating int NOT NULL CHECK (min_rpm_rating > 0),
  max_rpm_rating int NULL CHECK (max_rpm_rating > 0),
  adjustable_clutch boolean NULL,
  min_torque_rating numeric(10,4) NOT NULL CHECK (min_torque_rating > 0),
  max_torque_rating numeric(10,4) NULL CHECK (max_torque_rating > 0)
);
-- PowerSander
CREATE TABLE PowerSander (
  tool_id int NOT NULL References Tool(tool_id) Primary Key,
  volt_rating int NOT NULL CHECK (volt_rating > 0),
  amp_rating numeric(10,6) NOT NULL CHECK (amp_rating > 0),
  min_rpm_rating int NOT NULL CHECK (min_rpm_rating > 0),
  max_rpm_rating int NULL CHECK (max_rpm_rating > 0),
  dust_bag boolean NOT NULL
);
