/*
 * This is the main IDL file for status reports from Captain
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
        1: required DAVUser.DAVUser vehicleID,
        2: required Vehicle.VehicleState state,
    )

}
