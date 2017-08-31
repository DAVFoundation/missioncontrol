// const redis = require('./redis');

const getBidsForRequest = (/*requestId*/) => {
  return [
    {
      vehicle_id: '0xe0b0932e414e0b6bb511ffd81d671a052639987e',
      bid: 0.8,
      pickup: Date.now()+(1000*60*2),
      dropoff: Date.now()+(1000*60*10),
    },
    {
      vehicle_id: '0xf5a8f609a454a2d37b618c33a2c190112afb3dcf',
      bid: 0.7,
      pickup: Date.now()+(1000*60*2.5),
      dropoff: Date.now()+(1000*60*15),
    },
  ];
};

module.exports = {
  getBidsForRequest
};
