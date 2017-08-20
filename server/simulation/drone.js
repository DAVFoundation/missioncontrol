const { randomDavAddress, randomDroneModel, randomCoords, randomRating } = require('./random');
const { getDavIdIconUrl } = require('../lib/davIdIcon');

const generateRandom = ({coords, distance}) => {
  const davAddress = randomDavAddress();
  return {
    'id': davAddress,
    'model': randomDroneModel(),
    'icon': getDavIdIconUrl(davAddress),
    'coords': randomCoords({coords, distance}),
    'rating': randomRating(),
    'missions_completed': 36,
    'missions_completed_7_days': 3,
  };
};

module.exports = {
  generateRandom
};
