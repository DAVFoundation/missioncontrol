const { generateRandom } = require('../../server/simulation/drone');

describe('generateRandom()', () => {

  const sampleArguments = {coords: {lat: 1, long: 1}, distance: 1000 };

  test('returns an object', () => {
    expect(
      typeof generateRandom(sampleArguments)
    ).toBe('object');
  });

  test('returns an object with an id', () => {
    expect(
      generateRandom(sampleArguments)
    ).toHaveProperty('id');
  });

  test('returns an object with a model', () => {
    expect(
      generateRandom(sampleArguments)
    ).toHaveProperty('model');
  });

  test('returns an object with coords', () => {
    expect(
      generateRandom(sampleArguments)
    ).toHaveProperty('coords');
  });

  test('returns an object with a missions_completed_7_days attribute', () => {
    expect(
      generateRandom(sampleArguments)
    ).toHaveProperty('missions_completed_7_days');

  });
});
