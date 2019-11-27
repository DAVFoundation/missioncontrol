CREATE TABLE IF NOT EXISTS davnn.providers_drone_delivery (
    topic_id text PRIMARY KEY,
    min_lat double,
    min_long double,
    max_lat double,
    max_long double,
    max_length double,
    max_width double,
    max_height double,
    max_weight double
);
CREATE INDEX IF NOT EXISTS idx_min_lat
   ON davnn.providers_drone_delivery (min_lat);
CREATE INDEX IF NOT EXISTS idx_min_long
   ON davnn.providers_drone_delivery (min_long);
CREATE INDEX IF NOT EXISTS idx_max_lat
   ON davnn.providers_drone_delivery (max_lat);
CREATE INDEX IF NOT EXISTS idx_max_long
   ON davnn.providers_drone_delivery (max_long);

CREATE TABLE IF NOT EXISTS davnn.providers_vessel_charging (
topic_id text PRIMARY KEY,
    min_lat double,
    min_long double,
    max_lat double,
    max_long double,
    max_length double,
    max_width double,
    max_height double,
    max_weight double
);

CREATE INDEX IF NOT EXISTS idx_vessel_charging_min_lat
   ON davnn.providers_vessel_charging (min_lat);
CREATE INDEX IF NOT EXISTS idx_vessel_charging_min_long
   ON davnn.providers_vessel_charging (min_long);
CREATE INDEX IF NOT EXISTS idx_vessel_charging_max_lat
   ON davnn.providers_vessel_charging (max_lat);
CREATE INDEX IF NOT EXISTS idx_vessel_charging_max_long
   ON davnn.providers_vessel_charging (max_long);

CREATE TABLE IF NOT EXISTS davnn.providers_drone_charging (
topic_id text PRIMARY KEY,
    min_lat double,
    min_long double,
    max_lat double,
    max_long double,
    max_length double,
    max_width double,
    max_height double,
    max_weight double
);

CREATE INDEX IF NOT EXISTS idx_drone_charging_min_lat
   ON davnn.providers_drone_charging (min_lat);
CREATE INDEX IF NOT EXISTS idx_drone_charging_min_long
   ON davnn.providers_drone_charging (min_long);
CREATE INDEX IF NOT EXISTS idx_drone_charging_max_lat
   ON davnn.providers_drone_charging (max_lat);
CREATE INDEX IF NOT EXISTS idx_drone_charging_max_long
   ON davnn.providers_drone_charging (max_long);

CREATE TABLE IF NOT EXISTS davnn.providers_ride_hailing (
    topic_id text PRIMARY KEY,
    min_lat double,
    min_long double,
    max_lat double,
    max_long double
);

CREATE INDEX IF NOT EXISTS idx_ride_hailing_min_lat
   ON davnn.providers_ride_hailing (min_lat);
CREATE INDEX IF NOT EXISTS idx_ride_hailing_min_long
   ON davnn.providers_ride_hailing (min_long);
CREATE INDEX IF NOT EXISTS idx_ride_hailing_max_lat
   ON davnn.providers_ride_hailing (max_lat);
CREATE INDEX IF NOT EXISTS idx_ride_hailing_max_long
   ON davnn.providers_ride_hailing (max_long);

CREATE TABLE IF NOT EXISTS davnn.providers_vehicle_rider (
    topic_id text PRIMARY KEY,
    min_lat double,
    min_long double,
    max_lat double,
    max_long double
);

CREATE INDEX IF NOT EXISTS idx_vehicle_rider_min_lat
   ON davnn.providers_vehicle_rider (min_lat);
CREATE INDEX IF NOT EXISTS idx_vehicle_rider_min_long
   ON davnn.providers_vehicle_rider (min_long);
CREATE INDEX IF NOT EXISTS idx_vehicle_rider_max_lat
   ON davnn.providers_vehicle_rider (max_lat);
CREATE INDEX IF NOT EXISTS idx_vehicle_rider_max_long
   ON davnn.providers_vehicle_rider (max_long);
