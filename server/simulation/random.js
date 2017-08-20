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

module.exports = {
  randomDavAddress,
  randomDroneModel,
};
