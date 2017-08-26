/*
 * This is the main IDL file for status reports to Mission Control
 */

// Includes
include "DAVUser.thrift"
include "Vehicle.thrift"
include "Types.thrift"

/*
 * The StatusReport service is used by Captains to send updates to Mission Control
 *
 * @TODO: Define exceptions it should throw in case of invalid authenticationToken
 */
service StatusReport {

    void report_status(
        1: Types.AuthenticationToken authenticationToken,
        2: DAVUser.DAVUser vehicleID,
        3: Vehicle.VehicleState state,
    )

}
