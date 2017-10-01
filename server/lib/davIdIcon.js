/**
 * Get the icon url 
 * 
 * @param {String} davId. A string of length 42 beginning with 0x followed by 40 hexadecimal characters
 * @returns {string}  An URL to the icon
 */
 const getDavIdIconUrl = davId => {
  if (!davId){
    return new Error('No valid davId provided')
  }
  return `https://lorempixel.com/100/100/abstract/?${davId}`
};

module.exports = {
  getDavIdIconUrl
};
