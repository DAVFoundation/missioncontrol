const {
  randomDroneModel,
  randomDavAddress,
  randomRating,
  randomMissionsCompleted,
  randomCoords,
} = require('../../server/simulation/random');
const turf = require('@turf/turf');

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

  test('returns a string that starts with 0x and followed by 40 hexadecimal chars', () => {
    expect(
      randomDavAddress()
    ).toMatch(new RegExp('^0x([0-f]{40})$'));
  });
});

describe('randomRating()', () => {
  test('returns a floating point number between 4.3 and 5.0', () => {
    const randomValue = randomRating();
    expect(randomValue).toBeGreaterThanOrEqual(4.3);
    expect(randomValue).toBeLessThanOrEqual(5.0);
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
    ).toBe(true);

    expect(
      randomMissionsCompleted().missionsCompleted
    ).toBeLessThanOrEqual(90);

    expect(
      randomMissionsCompleted().missionsCompleted
    ).toBeGreaterThanOrEqual(4);
  });
});

describe('randomCoords()', () => {
  test('returns a coordinate that is no further than given coordinates by given radius', () => {
    const sampleArguments = { coords: { lat: 1, long: 1 }, radius: 1000 };
    const origin = sampleArguments.coords;
    const pickup = randomCoords(sampleArguments);
    const originPoint = turf.point([parseFloat(origin.long), parseFloat(origin.lat)]);
    const pickupPoint = turf.point([parseFloat(pickup.long), parseFloat(pickup.lat)]);
    expect(
      turf.distance(originPoint, pickupPoint, { units: 'meters' })
    ).toBeLessThanOrEqual(sampleArguments.radius);
  });
});
