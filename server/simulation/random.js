const randomstring = require('randomstring');

const randomDavAddress = () => {
  return '0x'+randomstring.generate({
    length: 40,
    charset: 'hex'
  });
};

const randomDroneModel = () => {
  return 'DJX CargoMate 2';
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
