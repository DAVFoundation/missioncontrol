const { generateRandom } = require('../../server/simulation/drone');

describe('generateRandom()', () => {

  const sampleArguments = {coords: {lat: 1, long: 1}, distance: 1000 };

  test('expected to return an object with attributes id, model, icon, coords, rating, mission_completed, mission_completed_7_days', () => {
    const actualObject = generateRandom(sampleArguments);
    const expectedProperties = ['id', 'model', 'icon', 'coords', 'rating', 'missions_completed_7_days', 'missions_completed'];
    expect(
      typeof generateRandom(sampleArguments)
    ).toBe('object');
    expect(Object.keys(actualObject)).toEqual(expect.arrayContaining(expectedProperties));
  });
});
