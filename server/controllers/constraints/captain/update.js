module.exports = {
  'id': {
    presence: {
      allowEmpty: false
    },
    type: 'string'
  },
  'coords': {
    presence: true
  },
  'coords.lat': {
    presence: true,
    numericality: {
      lessThanOrEqualTo: 90,
      greaterThanOrEqualTo: -90
    }
  },
  'coords.long': {
    presence: true,
    numericality: {
      lessThanOrEqualTo: 180,
      greaterThanOrEqualTo: -180
    }
  },
};