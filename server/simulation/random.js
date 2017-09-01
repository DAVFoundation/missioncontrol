const randomString = require('randomstring');

const manufacturerNames = ['DJX', 'Parakeet', 'Gruff', 'Unique', 'FlyHawk'];
const modelNames = ['CargoMate', 'Postman', 'ShipIt', 'Air Ship'];

const randomDavAddress = () => {
  return '0x'+randomString.generate({
    length: 40,
    charset: 'hex'
  });
};

/**
 * Returns a random manufacturer name chosen from an array of possible names
 * @return {String} A string representing the name of a manufacturer
 */
const randomManufacturerName = () => {
  return manufacturerNames[Math.floor(Math.random()*manufacturerNames.length)];
};

const randomModelName = () => {
  return modelNames[Math.floor(Math.random()*modelNames.length)];
};

const randomDroneModel = () => {
  return `${randomManufacturerName()} ${randomModelName()}`;
};

/**
 * Returns a random rating between 1.0 and 5.0
 *
 * @returns {Number} A floating point number representing a rating between 1.0 and 5.0
 */
const randomRating = () => {
  const rating = ((Math.random() * 4) + 1).toFixed(1);
  return parseFloat(rating);
};

const randomMissionsCompleted = () => {
  const missionsCompleted = Math.floor(Math.random() * (90 - 4) + 4);
  return {
    missionsCompleted: missionsCompleted,
    missionsCompleted7Days: Math.floor(Math.sqrt(missionsCompleted))
  };
};

/**
 * Returns random coordinates that are within a certain distance (in meters)
 * of a given coordinates.
 *
 * @param {{lat: Number, long: Number}} coords - Origin coordinate to generate new random coordinate next to
 * @param {Number} radius - Maximum distance in meters from origin coordinates to generate new coordinate
 * @returns {{lat: Number, long: Number}} A new object containing latitude and longitude
 */
const randomCoords = ({ coords, radius }) => {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radius;
  const longDegreesPerMeter = 1 / 111321.377778; // longitude degrees per meter
  const latDegreesPerMeter = 1 / 111134.86111; // latitude degrees per meter
  const x = parseFloat((coords.lat + latDegreesPerMeter * distance * Math.cos(angle)).toFixed(6));
  const y = parseFloat((coords.long + longDegreesPerMeter * distance * Math.sin(angle)).toFixed(6));
  return { lat: x, long: y };
};

module.exports = {
  randomDavAddress,
  randomDroneModel,
  randomRating,
  randomMissionsCompleted,
  randomCoords,
};
