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

  test('returns an object containing missionsCompleted7Days which is less than or equal to missionsCompleted', () => {
    const prop = randomMissionsCompleted();
    expect(
      prop.missionsCompleted7Days
    ).toBeLessThanOrEqual(prop.missionsCompleted);

    expect(
      Number.isInteger(prop.missionsCompleted7Days)
    ).toBe(true);

    expect(
      prop.missionsCompleted7Days
    ).toBeGreaterThan(0);

  });

  test('returns an object containing missionsCompleted which is an integer between 4 and 90', () => {
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
  
  test('missionsCompleted7Days should return an integer less than or equal to missionsCompleted', () => {
    var missionsCompletedObject = randomMissionsCompleted();
    var missionsCompleted7Days = missionsCompletedObject.missionsCompleted7Days, 
      missionsCompleted = missionsCompletedObject.missionsCompleted;
    expect(
      Number.isInteger(missionsCompleted7Days)
    ).toBe(true);
    expect(
      missionsCompleted7Days >= 0
    ).toBe(true);
    expect(
      missionsCompleted7Days <= missionsCompleted
    ).toBe(true);
  });

});
