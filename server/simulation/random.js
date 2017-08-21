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

const randomCoords = ( /*{coords, distance}*/ ) => {

  var initialX = coords.long;
  var initialY = coords.lat;
  // Convert Radius from meters to degrees.
  var rd = distance/111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(initialY);

  return {lat: y+initialY, long: xp+initialX};
};


//// Randomize a location within ISRAEL
//  lat: getRandomArbitrary(29.00,34.00),
//  long: getRandomArbitrary(34.00,36.00)
//
// function getRandomArbitrary(min, max) {
//   return Math.random() * (max - min) + min;
// }

module.exports = {
  randomDavAddress,
  randomDroneModel,
  randomRating,
  randomCoords,
};
