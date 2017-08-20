const { randomDavAddress } = require('./random');

const generateRandom = () => {
  return {
    'id': randomDavAddress(),
    'model': 'DJX CargoMate 3',
    'coords': {lat: 32.069450, long: 34.772898},
    'rating': 4.9,
    'missions_completed': 36,
    'missions_completed_7_days': 3,
  };
};

module.exports = {
  generateRandom
};
