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

  test('returns an object', () => {
    expect(
      typeof randomMissionsCompleted()
    ).toBe('object');
  });

  test('returns an integer that is between 4 and 90', () => {
    expect(
      Number.isInteger(randomMissionsCompleted().missionsCompleted)
    ).toBeTruthy();
    expect(
      randomMissionsCompleted().missionsCompleted
    ).toBeLessThanOrEqual(90);
    expect(
      randomMissionsCompleted().missionsCompleted
    ).toBeGreaterThanOrEqual(4);
  });

});
