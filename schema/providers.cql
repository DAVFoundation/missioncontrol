CREATE TABLE IF NOT EXISTS services.providers_drone_delivery (
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
CREATE INDEX idx_min_lat
   ON services.providers_drone_delivery (min_lat);
CREATE INDEX idx_min_long
   ON services.providers_drone_delivery (min_long);
CREATE INDEX idx_max_lat
   ON services.providers_drone_delivery (max_lat);
CREATE INDEX idx_max_long
   ON services.providers_drone_delivery (max_long);

CREATE TABLE IF NOT EXISTS services.providers_boat_charging (
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

CREATE INDEX idx_min_lat
   ON services.providers_boat_charging (min_lat);
CREATE INDEX idx_min_long
   ON services.providers_boat_charging (min_long);
CREATE INDEX idx_max_lat
   ON services.providers_boat_charging (max_lat);
CREATE INDEX idx_max_long
   ON services.providers_boat_charging (max_long);

CREATE TABLE IF NOT EXISTS services.providers_ride_hailing (
    topic_id text PRIMARY KEY, 
    min_lat double, 
    min_long double, 
    max_lat double, 
    max_long double
);

CREATE INDEX idx_ride_hailing_min_lat
   ON services.providers_ride_hailing (min_lat);
CREATE INDEX idx_ride_hailing_min_long
   ON services.providers_ride_hailing (min_long);
CREATE INDEX idx_ride_hailing_max_lat
   ON services.providers_ride_hailing (max_lat);
CREATE INDEX idx_ride_hailing_max_long
   ON services.providers_ride_hailing (max_long);
