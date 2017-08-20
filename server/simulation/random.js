const randomstring = require('randomstring');

const manufacturerNames = ['DJX', 'Parakeet', 'Gruff', 'Unique', 'FlyHawk'];
const modelNames = ['CargoMate', 'Postman', 'ShipIt', 'Air Ship'];

const randomDavAddress = () => {
  return '0x'+randomstring.generate({
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
  return 4.8;
};

const randomCoords = ( /*{coords, distance}*/ ) => {
  return {lat: 32.069450, long: 34.772898};
};

module.exports = {
  randomDavAddress,
  randomDroneModel,
  randomRating,
  randomCoords,
};
