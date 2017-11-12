const { generateRandomVehicles } = require('../../server/simulation/vehicles.js');

describe('generateRandomVehicles()', () => {
  test('returns an array with a length same to the vehicleCount argument', () => {
    expect(
      generateRandomVehicles(4, {}, 2000)
    ).toHaveLength(4);
  });

  test('returns an array of objects specifically matching given props', () => {
    expect(
      Array.isArray(generateRandomVehicles(1, {}, 2000))
    ).toBe(true);

    expect(
      Object.keys(generateRandomVehicles(1, {}, 2000)[0]).sort()
    ).toEqual(['id', 'model', 'icon', 'coords', 'rating', 'missions_completed', 'missions_completed_7_days'].sort());
  });
});
