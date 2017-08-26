/*
 * Standard UNIX timestamp
 */
typedef i64 Timestamp

/*
 * Coordinates object containing latitude and longitude
 */
struct Coordinates {
    1: required double latitude;
    2: required double longitude;
}
