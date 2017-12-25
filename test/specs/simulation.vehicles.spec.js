const {generateRandomVehicles, randomBid} = require('../../server/simulation/vehicles.js');
const {randomCoords} = require('../../server/simulation/random.js');

describe('generateRandomVehicles()', () => {
  test('returns an array with a length same to the vehicleCount argument', () => {
    expect(generateRandomVehicles(4, {}, 2000)).toHaveLength(4);
  });

  test('returns an array of objects specifically matching given props', () => {
    expect(Array.isArray(generateRandomVehicles(1, {}, 2000))).toBe(true);

    expect(Object.keys(generateRandomVehicles(1, {}, 2000)[0]).sort()).toEqual([
      'id',
      'model',
      'icon',
      'coords',
      'rating',
      'missions_completed',
      'missions_completed_7_days',
      'status'
    ].sort());
  });
});

describe('randomBid()', () => {
  const sampleArguments = {
    coords: {
      lat: 1,
      long: 1
    },
    radius: 1000
  };

  test('returns an object with a price containing a float', () => {
    expect(typeof randomBid(randomCoords(sampleArguments), randomCoords(sampleArguments), randomCoords(sampleArguments)).price).toBe('number');
  });
});
