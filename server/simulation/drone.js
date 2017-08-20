const { randomDavAddress, randomDroneModel, randomCoords, randomRating } = require('./random');

const generateRandom = ({coords, distance}) => {
  return {
    'id': randomDavAddress(),
    'model': randomDroneModel(),
    'icon': 'http://lorempixel.com/100/100/abstract/',
    'coords': randomCoords({coords, distance}),
    'rating': randomRating(),
    'missions_completed': 36,
    'missions_completed_7_days': 3,
  };
};

module.exports = {
  generateRandom
};
