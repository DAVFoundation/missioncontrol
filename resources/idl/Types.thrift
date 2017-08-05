/*
 * Standard UNIX timestamp
 */
typedef i64 Timestamp

/*
 * Authentication token
 */
typedef string AuthenticationToken

/*
 * Standard UNIX timestamp
 */
struct Coordinates {
    1: required double latitude;
    2: required double longitude;
}
