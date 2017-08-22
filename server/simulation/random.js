const randomString = require('randomstring');
const randomFloat = require('random-float');

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

const randomCoords = ( /*{coords, distance}*/ ) => {
  return {lat: randomFloat(32.064842, 32.072351), long: randomFloat(34.764905, 34.786234)};
};

module.exports = {
  randomDavAddress,
  randomDroneModel,
  randomRating,
  randomCoords,
};
