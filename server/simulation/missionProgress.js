module.exports = [
  {
    status: 'travelling_pickup',
    nextVehicleStatus: 'landing_pickup',
    nextMissionStatus: 'landing_pickup',
    conditionForNextStatus: mission => {
      let elapsedTime = Date.now() - mission.time_to_pickup;
      return elapsedTime > 0;
    },
  },
  {
    status: 'landing_pickup',
    nextVehicleStatus: 'waiting_pickup',
    nextMissionStatus: 'waiting_pickup',
    conditionForNextStatus: mission => {
      let elapsedTime = Date.now() - mission.landing_pickup_at;
      let elapsedSeconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      return elapsedSeconds > 2;
    },
  },
  {
    status: 'waiting_pickup',
    nextVehicleStatus: 'travelling_dropoff',
    nextMissionStatus: 'travelling_dropoff',
    conditionForNextStatus: mission => {
      let elapsedTime = Date.now() - mission.waiting_pickup_at;
      let elapsedSeconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      return elapsedSeconds > 2;
    },
  },
  {
    status: 'travelling_dropoff',
    nextVehicleStatus: 'landing_dropoff',
    nextMissionStatus: 'landing_dropoff',
    conditionForNextStatus: mission => {
      let elapsedTime = Date.now() - mission.time_to_dropoff;
      return elapsedTime > 0;
    },
  },
  {
    status: 'landing_dropoff',
    nextVehicleStatus: 'waiting_dropoff',
    nextMissionStatus: 'waiting_dropoff',
    conditionForNextStatus: mission => {
      let elapsedTime = Date.now() - mission.landing_dropoff_at;
      let elapsedSeconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      return elapsedSeconds > 2;
    },
  },
  {
    status: 'waiting_dropoff',
    nextVehicleStatus: 'available',
    nextMissionStatus: 'completed',
    conditionForNextStatus: mission => {
      let elapsedTime = Date.now() - mission.waiting_dropoff_at;
      let elapsedSeconds = ((elapsedTime % 60000) / 1000).toFixed(0);
      return elapsedSeconds > 2;
    },
  },
  {
    status: 'available',
    conditionForNextStatus: () => {
      return false;
    },
  },
];
