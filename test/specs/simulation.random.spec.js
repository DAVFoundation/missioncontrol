const {
  randomDroneModel,
  randomDavAddress,
  randomMissionsCompleted,
  randomCoords,
} = require('../../server/simulation/random');

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
  const sampleArguments = { coords: { lat: 1, long: 1 }, radius: 1000 };
  const coords = {
    lat1: sampleArguments.coords.lat,
    long1: sampleArguments.coords.lat,
    lat2: randomCoords(sampleArguments).lat,
    long2: randomCoords(sampleArguments).long
  };
  /**
   * Haversine Formula: returns the distance from one point to another
   * @returns {Number} a number containing distance in meters
   */
  const getDistance = ({ lat1, long1, lat2, long2 }) => {
    const R = 6371; // radius of the earth in km
    const dLat = degToRad(lat2 - lat1);
    const dLong = degToRad(long2 - long1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = (R * c) * 1000;
    return d;
  };
  const degToRad = (deg) => { return deg * (Math.PI / 180); };

  test('returns a coordinate that is no further than given coordinates by given radius', () => {
    expect(
      getDistance(coords)
    ).toBeLessThanOrEqual(sampleArguments.radius);
  });
});
