/*
 * This is the main IDL file for Registration calls to Mission Control
 */

// Includes
include "DAVUser.thrift"
include "Types.thrift"

/*
 * The Registration service is used by Captains to register and deregister with Mission Control
 */
service Registration {

    string register_vehicle(
        1: DAVUser.DAVUser vehicleID,
    )

    void deregister_vehicle(
        1: DAVUser.DAVUser vehicleID,
    )

    bool vehicle_is_registered(
        1: DAVUser.DAVUser vehicleID,
    )

}
