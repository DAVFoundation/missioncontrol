const { randomDroneModel, randomDavAddress, randomMissionsCompleted } = require('../../server/simulation/random');

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

describe('randomDavAddress()', () => {

  test('returns a string', () => {
    expect(
      typeof randomDavAddress()
    ).toBe('string');
  });

  test('returns a string that is 42 characters long', () => {
    expect(
      randomDavAddress().length
    ).toEqual(42);
  });

});

describe('randomMissionsCompleted()', () => {

  test('returns a object', () => {

    expect(typeof randomMissionsCompleted()).toBe('object');

  });

  test('returns a object with two keys', () => {

    const mock = randomMissionsCompleted();

    expect(mock).toHaveProperty('missionsCompleted', expect.any(Number));

    expect(mock).toHaveProperty('missionsCompleted7Days', expect.any(Number));

  });

  test('missionsCompleted7Days less than missionsCompleted and greater than 0', () => {

    for(i = 0; i < 10; i++) {

      const mock = randomMissionsCompleted();

      expect(mock.missionsCompleted7Days).toBeGreaterThan(0);

      expect(mock.missionsCompleted7Days)
        .toBeLessThanOrEqual(mock.missionsCompleted);

    }

  });

});
