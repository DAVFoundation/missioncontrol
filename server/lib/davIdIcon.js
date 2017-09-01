const getDavIdIconUrl = () => 'http://lorempixel.com/100/100/abstract/';
const { URL } = require('url');

const checkIfAbsoluteURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;  
  }
};

module.exports = {
  getDavIdIconUrl,
  checkIfAbsoluteURL
};
