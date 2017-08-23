const { randomDroneModel, randomDavAddress,randomMissionsCompleted } = require('../../server/simulation/random');

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

  test('returns a  positive integer that is less than or equal to the value of missionsCompleted', () => {
    expect(
      randomMissionsCompleted().missionsCompleted
    ).toBeLessThanOrEqual(90); 
    expect(
      randomMissionsCompleted().missionsCompleted
    ).toBeGreaterThanOrEqual(4);
  });

});
