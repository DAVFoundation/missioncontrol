module.exports = {
  /*  id: {
     presence: {
       allowEmpty: false
     },
     type: 'string'
   }, */
  ttl: {
    numericality: {
      onlyInteger: true,
      strict: true
    }
  },
  bid_id: {
    presence: {
      allowEmpty: false
    }
  },
  dav_id: {
    presence: {
      allowEmpty: false
    },
    type: 'string'
  }
};