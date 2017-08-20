const randomstring = require('randomstring');

const randomDavAddress = () => {
  return '0x'+randomstring.generate({
    length: 40,
    charset: 'hex'
  });
};

module.exports = {
  randomDavAddress
};
