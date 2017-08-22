const { randomDroneModel } = require('../../server/simulation/random');

describe('randomDroneModel()', () => {

  test('returns a string', () => {
    expect(
      typeof randomDroneModel()
    ).toBe('string');
  });

  test('returns at least two words', () => {
    expect(
      randomDroneModel().split(' ').length
    ).toBeGreaterThanOrEqual(2);
  });

});
