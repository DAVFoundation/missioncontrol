include "Types.thrift"
include "DAVUser.thrift"

/**
 * This structure is used to represent a state of a vehicle at a certain point in time
 */
struct VehicleState {
  1: required Types.Timestamp timestamp,
  2: required Types.Coordinates coordinates,
  3: optional i16 heading,
  4: optional i16 height,
  5: optional i8 battery_level,
  6: optional Types.WayPoints waypoints,
  7: optional string mission_status,
}

struct VehicleDetails {
  1: required DAVUser.DAVUser vehicleId,
  2: optional string model,
  3: optional Types.Coordinates coordinates,
  4: optional i16 missions_completed,
  5: optional i16 missions_completed_7_days,
}
