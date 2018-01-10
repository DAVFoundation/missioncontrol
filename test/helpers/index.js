const { URL } = require('url');

module.exports.checkIfAbsoluteURL = url => {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
};