module.exports = {
  pickup_at: {
    numericality: {
      greaterThan: Date.now() - 60000
    }
  },
  pickup_latitude: {
    presence: true,
    numericality: {
      lessThanOrEqualTo: 90,
      greaterThanOrEqualTo: -90
    }
  },
  pickup_longitude: {
    presence: true,
    numericality: {
      lessThanOrEqualTo: 180,
      greaterThanOrEqualTo: -180
    }
  },
  dropoff_latitude: {
    presence: true,
    numericality: {
      lessThanOrEqualTo: 90,
      greaterThanOrEqualTo: -90
    }
  },
  dropoff_longitude: {
    presence: true,
    numericality: {
      lessThanOrEqualTo: 180,
      greaterThanOrEqualTo: -180
    }
  },
  requester_name: {
    length: {
      minimum: 3,
    }
  },
  requester_phone_number: {
    length: {
      minimum: 8,
    }
  },
  cargo_type: {
    presence: true,
    numericality: {
      onlyInteger: true,
      strict: true,
      lessThanOrEqualTo: 18,
      greaterThanOrEqualTo: 1
    }
  },
  hazardous_goods: {
    numericality: {
      onlyInteger: true,
      strict: true,
      lessThanOrEqualTo: 9,
      greaterThanOrEqualTo: 1
    }
  },
  ip_protection_level: {
    numericality: {
      onlyInteger: true,
      strict: true,
      lessThanOrEqualTo: 69,
      greaterThanOrEqualTo: 54
    }
  },
  height: {
    numericality: {
      greaterThan: 0
    }
  },
  width: {
    numericality: {
      greaterThan: 0
    }
  },
  length: {
    numericality: {
      greaterThan: 0
    }
  },
  weight: {
    numericality: {
      greaterThan: 0
    }
  },
  insurance_required: {
    type: 'boolean'
  },
  insured_value: {
    numericality: {
      greaterThan: 0
    }
  },
  insured_value_currency: {
    length: {
      is: 3
    }
  }
};
