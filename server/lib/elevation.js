const redis = require('../store/redis');
const Promise = require('bluebird');
const request = require("request");

const getFromElevationApi = async (locations = []) => {
  /* TODO - query by batches of 512 locations */
  const base_url = 'https://maps.googleapis.com/maps/api/elevation/json';
  let params = {
    locations: locations.map((l) => {
      return l.lat + ',' + l.long
    }).join("|"),
    key: process.env.ELEVATION_API_KEY
  };
  let query = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

  return new Promise((resolve, reject) => {
    request.get(base_url + '?' + query, {json: true}, (err, request, body) => {
      if (err) {
        reject(new Error("Error in request to Google Elevation API" + err));
      }
      if (body.status != 'OK') {
        reject(new Error("Error in request to Google Elevation API " + body.status + '. ' + body.error_message));
      }
      let newLocations = [];
      body.results.forEach((new_location) => {
        newLocations.push({
          coord: {lat: new_location.location.lat, long: new_location.location.lng},
          elevation: new_location.elevation
        })
      });
      resolve(newLocations);
    });
  });
};

const generateElevationKey = (coordinate) => {
  return "elv_" + coordinate.lat + '_' + coordinate.long;
};

const getElevations = async (coordinates = [], precision = 50) => {
  let results = [];
  let unknownLocations = [];

  for (let i = 0; i < coordinates.length; i++) {
    let coordinate = coordinates[i];
    let elevation = await redis.getAsync(generateElevationKey(coordinate));
    if (false && elevation) {
      results.push({coord: coordinate, elevation: elevation});
    }
    else {
      unknownLocations.push(coordinate);
    }
  }
  if (unknownLocations.length > 0) {
    try {
      const newLocations = await getFromElevationApi(unknownLocations);
      let redis_multi = redis.multi();
      newLocations.forEach(new_location => {
        redis_multi.set(generateElevationKey(new_location.coord), new_location.elevation);
      });
      redis_multi.exec();
      results = results.concat(newLocations);
    } catch (err) {
      console.error("Unable to fetch some locations elevation. ", {locations: unknownLocations, err: err.message});
    }
  }
  return results;
};

module.exports = {
  getElevations,
};
