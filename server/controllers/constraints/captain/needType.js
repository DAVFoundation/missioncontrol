const needTypes = require('../../../config/needTypes');

module.exports = {
  need_type: {
    presence: true,
    inclusion: {
      within: needTypes
    }
  },
  dav_id: {
    presence: {
      allowEmpty: false
    },
    type: 'string'
  },
  'region.longitude': {
    numericality: {
      lessThanOrEqualTo: 180,
      greaterThanOrEqualTo: -180
    }
  },
  'region.latitude': {
    numericality: {
      lessThanOrEqualTo: 90,
      greaterThanOrEqualTo: -90
    }
  },
  'region.radius': {
    numericality: {
      greaterThan: 0
    }
  },
  'region.global': {
    type: 'boolean'
  }
};