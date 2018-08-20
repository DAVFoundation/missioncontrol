CREATE TABLE IF NOT EXISTS services.providers_drone_delivery (
    dav_id text PRIMARY KEY, 
    topic_id text, 
    min_lat double, 
    min_long double, 
    max_lat double, 
    max_long double, 
    max_length double, 
    max_width double, 
    max_height double
);
CREATE INDEX idx_min_lat
   ON services.providers_drone_delivery (min_lat);
CREATE INDEX idx_min_long
   ON services.providers_drone_delivery (min_long);
CREATE INDEX idx_max_lat
   ON services.providers_drone_delivery (max_lat);
CREATE INDEX idx_max_long
   ON services.providers_drone_delivery (max_long);