/*
 * This is the main IDL file for Registration calls from Captain
 */

// Includes
include "DAVUser.thrift"
include "Vehicle.thrift"

/*
 * The Registration service is used by Captains to register and deregister with Mission Control
 */
service Registration {

    string register_vehicle(
        1: Vehicle.VehicleDetails vehicleDetails
    )

    void deregister_vehicle(
        1: DAVUser.DAVUser vehicleID,
    )

    bool vehicle_is_registered(
        1: DAVUser.DAVUser vehicleID,
    )

}
