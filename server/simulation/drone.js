const { randomDavAddress, randomDroneModel, randomCoords, randomMissionsCompleted } = require('./random');
const { getDavIdIconUrl } = require('../lib/davIdIcon');

const generateRandom = ({ coords, radius }) => {
  const davAddress = randomDavAddress();
  const { missionsCompleted, missionsCompleted7Days } = randomMissionsCompleted();
  return {
    id: davAddress,
    model: randomDroneModel(),
    icon: getDavIdIconUrl(davAddress),
    coords: randomCoords({ coords, radius }),
    missions_completed: missionsCompleted,
    missions_completed_7_days: missionsCompleted7Days,
    status: 'available',
  };
};

module.exports = {
  generateRandom,
};
