include "Types.thrift"

/**
 * This structure is used to represent a state of a vehicle at a certain point in time
 */
struct VehicleState {
  1: required Types.Timestamp timestamp,
  2: Types.Coordinates coordinates,
}
