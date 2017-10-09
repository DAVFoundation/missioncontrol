const { generateRandomVehicles } = require('../../server/simulation/vehicles');
const { randomDavAddress, randomDroneModel, randomCoords, randomRating, randomMissionsCompleted } = require('../../server/simulation/random');

describe('randomVehicle()', () => {
  test('returns an array of size 4', () => {
    const count = 5;
    const myVehicle = generateRandomVehicles(count, randomCoords, 2000);
    expect(myVehicle).toBeInstanceOf(Array); //check that it's an array
    expect(myVehicle).toHaveLength(count); // check that the length is right
    myVehicle.forEach(function(entry) { // for each object check that it contains the right fields.
      expect('id' in entry).toBe(true);
      expect('icon' in entry).toBe(true);
      expect('model' in entry).toBe(true);
      expect('coords' in entry).toBe(true);
      expect('rating' in entry).toBe(true);
      expect('missions_completed' in entry).toBe(true);
      expect('missions_completed_7_days' in entry).toBe(true);

    });
  })
 })
;
