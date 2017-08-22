const randomString = require('randomstring');

const manufacturerNames = ['DJX', 'Parakeet', 'Gruff', 'Unique', 'FlyHawk'];
const modelNames = ['CargoMate', 'Postman', 'ShipIt', 'Air Ship'];

const randomDavAddress = () => {
  return '0x'+randomString.generate({
    length: 40,
    charset: 'hex'
  });
};

const randomManufacturerName = () => {
  return manufacturerNames[Math.floor(Math.random()*manufacturerNames.length)];
};

const randomModelName = () => {
  return modelNames[Math.floor(Math.random()*modelNames.length)];
};

const randomDroneModel = () => {
  return `${randomManufacturerName()} ${randomModelName()}`;
};

const randomRating = () => {
  const rating = (Math.random() * 4) + 1;
  return rating.toPrecision(2);
};

const randomCoords = ({ coords, distance }) => {
  const angle = Math.random() * 2 * Math.PI;
  const radius = Math.random() * distance;
  const longDegreesPerMeter = 1 / 111321.377778; // longitude degrees per meter
  const latDegreesPerMeter = 1 / 111134.86111; // latitude degrees per meter
  const x = parseFloat((coords.lat + latDegreesPerMeter * radius * Math.cos(angle)).toFixed(6));
  const y = parseFloat((coords.long + longDegreesPerMeter * radius * Math.sin(angle)).toFixed(6));
  return { lat: x, long: y };
};

module.exports = {
  randomDavAddress,
  randomDroneModel,
  randomRating,
  randomCoords,
};
