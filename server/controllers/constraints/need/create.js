module.exports = {
  pickup_at: {
    numericality: {
      greaterThan: Date.now()
    }
  },
  pickup_latitude: {
    presence: true,
    numericality: {
      lessThanOrEqualTo: 90,
    }
  },
  pickup_longitude: {
    presence: true,
    numericality: {
      lessThanOrEqualTo: 180,
    }
  },
  dropoff_latitude: {
    presence: true,
    numericality: {
      lessThanOrEqualTo: 90,
    }
  },
  dropoff_longitude: {
    presence: true,
    numericality: {
      lessThanOrEqualTo: 180,
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
    type: 'number',
    inclusion: {
      within: Array.from(new Array(18), (x,i) => i + 1)
    }
  },
  hazardous_goods: {
    type: 'number',
    inclusion: {
      within: Array.from(new Array(9), (x,i) => i + 1)
    }
  },
  insurance_required: {
   type: 'boolean'
  },
  insured_value: {
    type: 'number'
  },
  insured_value_currency: {
    length: {
      is: 3
    }
  }
};
