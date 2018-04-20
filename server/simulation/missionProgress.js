const { updateMission } = require('../store/missions');

module.exports = {
  'travelling_pickup': {
    status: 'travelling_pickup',
    nextVehicleStatus: 'landing_pickup',
    nextMissionUpdate: 'landing_pickup',
    conditionForNextUpdate: (mission, vehicle) => {
      let elapsedTime = Date.now() - (parseFloat(mission.user_signed_at) + parseFloat(mission.time_to_pickup));
      let isAtTerminal = false;

      if(vehicle.coords.lat == mission.pickup_latitude && vehicle.coords.long == mission.pickup_longitude) {
        isAtTerminal = true;
      }

      return (elapsedTime > 0 && isAtTerminal);
    },
  },
  'landing_pickup': {
    status: 'landing_pickup',
    nextVehicleStatus: 'waiting_pickup',
    nextMissionUpdate: 'waiting_pickup',
    conditionForNextUpdate: mission => {
      let elapsedTime = Date.now() - mission.landing_pickup_at;
      let elapsedSeconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      return elapsedSeconds > 2;
    },
  },
  'waiting_pickup': {
    status: 'waiting_pickup',
    conditionForNextUpdate: () => {
      return false;
    }
  },
  'takeoff_pickup': {
    status: 'takeoff_pickup',
    nextVehicleStatus: 'travelling_dropoff',
    nextMissionUpdate: 'travelling_dropoff',
    beforeUpdate: async (mission) => {
      const waitTime = Date.now() - parseFloat(mission.waiting_pickup_at);
      const newTimeToDropoff = parseFloat(mission.time_to_dropoff) + waitTime;
      await updateMission(mission.id, {'time_to_dropoff': newTimeToDropoff});
    },
    conditionForNextUpdate: mission => {
      let elapsedTime = Date.now() - mission.waiting_pickup_at;
      let elapsedSeconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      return elapsedSeconds > 2;
    },
  },
  'travelling_dropoff': {
    status: 'travelling_dropoff',
    nextVehicleStatus: 'landing_dropoff',
    nextMissionUpdate: 'landing_dropoff',
    conditionForNextUpdate: mission => {
      let elapsedTime = Date.now() - (parseFloat(mission.travelling_dropoff_at) + parseFloat(mission.time_to_dropoff));
      return elapsedTime > 0;
    },
  },
  'landing_dropoff': {
    status: 'landing_dropoff',
    nextVehicleStatus: 'waiting_dropoff',
    nextMissionUpdate: 'waiting_dropoff',
    conditionForNextUpdate: mission => {
      let elapsedTime = Date.now() - mission.landing_dropoff_at;
      let elapsedSeconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      return elapsedSeconds > 2;
    },
  },
  'waiting_dropoff': {
    status: 'waiting_dropoff',
    nextVehicleStatus: 'available',
    nextMissionUpdate: 'completed',
    conditionForNextUpdate: mission => {
      let elapsedTime = Date.now() - mission.waiting_dropoff_at;
      let elapsedSeconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      return elapsedSeconds > 2;
    },
  },
  'available': {
    status: 'available',
    beforeUpdate: async (mission) => {
      await updateMission(mission.mission_id, {'status': 'completed'});
    },
    conditionForNextUpdate: () => {
      return false;
    },
  },
};
