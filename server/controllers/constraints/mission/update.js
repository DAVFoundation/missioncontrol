module.exports = {
  latitude: {
    // presence: true,
    numericality: {
      lessThanOrEqualTo: 90,
      greaterThanOrEqualTo: -90
    }
  },
  longitude: {
    // presence: true,
    numericality: {
      lessThanOrEqualTo: 180,
      greaterThanOrEqualTo: -180
    }
  },
  status: {
    // inclusion: {
    //   within: ['in_progress', 'in_mission', 'movingToPickup', 'atPickup', 'movingToDropoff', 'atDropoff']
    // }
  },
  // dav_id: {
  //   presence: {
  //     allowEmpty: false
  //   },
  //   type: 'string'
  // }
};