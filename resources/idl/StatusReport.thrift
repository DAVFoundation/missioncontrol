/*
 * This is the main IDL file for status reports to Mission Control
 */

// Includes
include "DAVUser.thrift"
include "Vehicle.thrift"
include "Types.thrift"

/*
 * The StatusReport service is used by Captains to send updates to Mission Control
 */
service StatusReport {

    void report_status(
        1: DAVUser.DAVUser vehicleID,
        2: Vehicle.VehicleState state,
    )

}
