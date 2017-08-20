const { randomDavAddress, randomDroneModel, randomRating } = require('./random');

const generateRandom = () => {
  return {
    'id': randomDavAddress(),
    'model': randomDroneModel(),
    'icon': 'http://lorempixel.com/100/100/abstract/',
    'coords': {lat: 32.069450, long: 34.772898},
    'rating': randomRating(),
    'missions_completed': 36,
    'missions_completed_7_days': 3,
  };
};

module.exports = {
  generateRandom
};
