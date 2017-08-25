const { randomDavAddress, randomDroneModel, randomCoords, randomRating, randomMissionsCompleted } = require('./random');
const { getDavIdIconUrl } = require('../lib/davIdIcon');

const generateRandom = ({coords, radius}) => {
  const davAddress = randomDavAddress();
  const { missionsCompleted, missionsCompleted7Days } = randomMissionsCompleted();
  return {
    'id': davAddress,
    'model': randomDroneModel(),
    'icon': getDavIdIconUrl(davAddress),
    'coords': randomCoords({coords, radius}),
    'rating': randomRating(),
    'missions_completed': missionsCompleted,
    'missions_completed_7_days': missionsCompleted7Days,
  };
};

module.exports = {
  generateRandom
};
