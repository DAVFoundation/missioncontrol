include "Types.thrift"
include "DAVUser.thrift"

/**
 * This structure is used to represent a state of a vehicle at a certain point in time
 */
struct VehicleState {
  1: required Types.Timestamp timestamp,
  2: Types.Coordinates coordinates,
}

struct VehicleDetails {
  1: required DAVUser.DAVUser vehicleID,
  2: string model,
  3: Types.Coordinates coordinates,
  4: double rating,
  5: i16 missions_completed,
  6: i16 missions_completed_7_days,
}
