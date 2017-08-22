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

const randomCoords = ( {coords, distance} ) => {
  let angle=Math.random()*2*Math.PI;
  let radius=Math.random()*distance;
  let Longpm=1/111321.377778; // degrees per meter
  let Latpm=1/1111348.61111; // degrees per meter
  let x=parseFloat((coords.lat+Latpm*radius*Math.cos(angle)).toFixed(6));
  let y=parseFloat((coords.long+Longpm*radius*Math.sin(angle)).toFixed(6));
  return {lat:x, long:y};
};

module.exports = {
  randomDavAddress,
  randomDroneModel,
  randomRating,
  randomCoords,
};
