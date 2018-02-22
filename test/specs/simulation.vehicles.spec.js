const {
  generateRandomVehicles,
  randomBid,
} = require('../../server/simulation/vehicles.js');
const { randomCoords } = require('../../server/simulation/random.js');

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
    ).toEqual(['id', 'model', 'icon', 'coords', 'missions_completed', 'missions_completed_7_days', 'status'].sort());
  });
});

describe('randomBid()', () => {
  const sampleArguments = { coords: { lat: 1, long: 1 }, radius: 1000 };

  test('returns an object with a price containing a float', () => {
    const bid = randomBid(randomCoords(sampleArguments), randomCoords(sampleArguments), randomCoords(sampleArguments));
    expect(
      typeof bid.price
    ).toBe('string');

    expect(
      typeof bid.time_to_pickup
    ).toBe('number');
  });

  test('returns an object with a time_to_dropoff containing a float', () => {
    const bid = randomBid(randomCoords(sampleArguments), randomCoords(sampleArguments), randomCoords(sampleArguments));
    expect(
      typeof bid.time_to_dropoff
    ).toBe('number');
  });

  test('returns a price that is influenced by the total distance travelled', () => {
    const origin = randomCoords(sampleArguments);
    const bidShort = randomBid(origin, {lat: origin.lat + 0.05, long: origin.long}, {lat: origin.lat + 0.10, long: origin.long});
    
    expect(
      bidShort.price
    ).toBeLessThan(randomBid(origin, {lat: origin.lat + 0.05, long: origin.long}, {lat: origin.lat + 0.15, long: origin.long}).price);

    expect(
      bidShort.price
    ).toBeLessThan(randomBid(origin, {lat: origin.lat + 0.10, long: origin.long}, {lat: origin.lat + 0.15, long: origin.long}).price);
  });
});
