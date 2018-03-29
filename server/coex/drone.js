
const { updateVehicleStatus, getVehicle, getVehicles, addNewVehicle, updateVehiclePosition } = require('../store/vehicles');
const { getMission, updateMission } = require('../store/missions');
const { createMissionUpdate } = require('../store/mission_updates');
const Rx = require('rxjs/Rx');
const DroneApi = require('../lib/drone-api');
const geolib = require('geolib');
const { getElevations } = require('../lib/elevation');

const DRONE_AVG_VELOCITY = 10.0; // m/s
const DRONE_PRICE_RATE = 1e-14 / 1000; // DAV/m
const DRONE_CRUISE_ALT = 1000;

const DRONE_ID_MAP = {
  9: { pubkey: '0xa050930bc8c5762c7994a35eb27b5b619254c438', privatekey: '' } //    `0x${Array(40).fill().map(() => Math.floor((Math.random() * 15)).toString(16)).join('')}`
};

class CoExDrone {
  constructor() {
    this.droneApi = new DroneApi();
    this.dronesByCoexId = {};
    this.dronesByDavID = {};
  }

  async init() {
    this.droneUpdates = Rx.Observable.timer(0, 1000).subscribe(async () => {
      try {
        await this.updateVehicles();
      }
      catch (error) {
        console.error(error);
      }
    });
  }

  async dispose() {
    this.droneUpdates.unsubscribe();
  }

  async addDrone(drone) {
    if (!this.dronesByCoexId[drone.id]) {
      this.dronesByCoexId[drone.id] = drone;
      this.dronesByDavID[drone.davId] = drone;
    }
  }

  async beginMission(vehicleId, missionId) {
    const missionUpdates = Rx.Observable.timer(0, 1000)
      .mergeMap(async () => await getMission(missionId))
      .distinctUntilChanged((mission1, mission2) => mission1.status === mission2.status)
      .subscribe(async mission => {
        try {
          const drone = this.dronesByDavID[vehicleId];
          const droneState = await this.droneApi.getState(drone.id);
          droneState.id = drone.id;

          switch (mission.status) {
            case 'awaiting_signatures':
              // TODO: this should be implemented by Ethereum integration - NOT HERE!
              await updateMission(missionId, {
                'vehicle_signed_at': Date.now(),
                'status': 'in_progress'
              });
              break;
            case 'in_progress':
              await this.onInProgress(mission, droneState, missionUpdates);
              break;
            case 'in_mission':
              await this.onInMission(mission, droneState, missionUpdates);
              break;
            default:
              console.log(`bad mission.status ${mission}`);
              break;
          }
        }
        catch (error) {
          console.error(error);
        }
      }, (error) => {
        console.error(error);
      });
  }

  async onInProgress(mission, droneState, missionUpdates) {
    await updateMission(mission.mission_id, {
      'status': 'in_mission',
      'vehicle_start_longitude': droneState.location.lon,
      'vehicle_start_latitude': droneState.location.lat
    });

    await this.onInMission(mission, droneState, missionUpdates);
  }

  async onInMission(mission, droneState, missionUpdates) {
    let vehicle = await getVehicle(mission.vehicle_id);
    await updateVehiclePosition(vehicle, droneState.location.lon, droneState.location.lat);
    const [{ elevation: pickupAlt }, { elevation: dropoffAlt }] = (await getElevations([
      { lat: mission.pickup_latitude, long: mission.pickup_longitude },
      { lat: mission.dropoff_latitude, long: mission.dropoff_longitude }
    ])).map(o => { o.elevation = parseFloat(o.elevation); return o; });

    switch (vehicle.status) {
      case 'contract_received':
        await this.droneApi.goto(droneState.id, mission.pickup_latitude, mission.pickup_longitude,
          DRONE_CRUISE_ALT - droneState.location.alt, pickupAlt - droneState.location.alt, false);
        await this.updateStatus(mission, 'travelling_pickup', 'travelling_pickup');
        break;
      case 'travelling_pickup':
        break;
      case 'landing_pickup':
        break;
      case 'waiting_pickup':
        break;
      case 'takeoff_pickup':
        await this.droneApi.goto(droneState.id, mission.dropoff_latitude, mission.dropoff_longitude,
          DRONE_CRUISE_ALT - droneState.location.alt, dropoffAlt - droneState.location.alt, true);
        await this.updateStatus(mission, 'travelling_dropoff', 'travelling_dropoff');
        break;
      case 'travelling_dropoff':
        break;
      case 'landing_dropoff':
        break;
      case 'waiting_dropoff':
        break;
      case 'available':
        missionUpdates.unsubscribe();
        break;
      default:
        console.log(`bad vehicle.status ${vehicle}`);
        break;
    }
  }

  async updateStatus(mission, missionStatus, vehicleStatus) {
    await updateMission(mission.mission_id, {
      [missionStatus + '_at']: Date.now()
    });
    await createMissionUpdate(mission.mission_id, missionStatus);
    await updateVehicleStatus(mission.vehicle_id, vehicleStatus);
  }

  async updateVehicles() {
    const drones = await this.droneApi.listDrones();

    drones.filter(drone => drone.description.match(/\bSITL\b/))
      .forEach(async (drone) => {
        try {
          await this.updateVehicle(drone);
        } catch (error) {
          console.error(error);
        }
      });
  }

  async updateVehicle(drone) {
    drone.davId = DRONE_ID_MAP[drone.id].pubkey;
    this.addDrone(drone);
    const state = await this.droneApi.getState(drone.id);

    let vehicles = await getVehicles([drone.davId]);
    if (vehicles.length > 0) {
      let vehicle = vehicles[0];
      vehicle.coords = {
        long: state.location.lon,
        lat: state.location.lat,
      };
      updateVehiclePosition(vehicle);
    } else {
      let vehicle = {
        id: drone.davId,
        model: 'CopterExpress-d1',
        icon: `https://lorempixel.com/100/100/abstract/?${drone.davId}`,
        coords: {
          long: state.location.lon,
          lat: state.location.lat,
        },
        missions_completed: 0,
        missions_completed_7_days: 0,
        status: 'available',
      };
      addNewVehicle(vehicle);
    }
  }

  getBid(davId, origin, pickup, dropoff) {
    dropoff = {
      lat: parseFloat(dropoff.lat),
      long: parseFloat(dropoff.long)
    };
    const distToPickup = geolib.getDistance(
      { latitude: origin.lat, longitude: origin.long },
      { latitude: pickup.lat, longitude: pickup.long },
      1, 1
    );

    const distToDropoff = geolib.getDistance(
      { latitude: pickup.lat, longitude: pickup.long },
      { latitude: dropoff.lat, longitude: dropoff.long },
      1, 1
    );

    const totalDist = distToPickup + distToDropoff;

    const bidInfo = {
      price: `${totalDist / DRONE_PRICE_RATE}`,
      price_type: 'flat',
      price_description: 'Flat fee',
      time_to_pickup: (distToPickup / DRONE_AVG_VELOCITY) + 1,
      time_to_dropoff: (distToDropoff / DRONE_AVG_VELOCITY) + 1,
      drone_manufacturer: 'Copter Express',
      drone_model: 'SITL',
      expires_at: Date.now() + 3600000,
      ttl: 120 // TTL in seconds
    };

    return bidInfo;
  }
}

module.exports = new CoExDrone();
