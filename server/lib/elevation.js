const redis = require('../store/redis');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'), {multiArgs: true});

const getFromElevationApi = async (locations = []) => {
  /* TODO - query by batches of 512 locations */
  const base_url = 'https://maps.googleapis.com/maps/api/elevation/json';
  let params = {
    locations: locations.map((location) => {
      return location.lat + ',' + location.long;
    }).join('|'),
    key: process.env.ELEVATION_API_KEY
  };
  let query = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

  return request.getAsync(base_url + '?' + query, {json: true}).then(([, body]) => {
    if (body.status != 'OK') {
      throw new Error('Error in request to Google Elevation API. Status:' + body.status + '. Message: ' + body.error_message);
    }
    return body.results.map((elevation_data) => {
      return {
        coord: {lat: elevation_data.location.lat, long: elevation_data.location.lng},
        elevation: elevation_data.elevation
      };
    });
  });
};

const generateElevationKey = (coordinate) => {
  return 'elv_' + coordinate.lat + '_' + coordinate.long;
};

const getNearByLocationElevation = async (coordinate, precisionRadius) => {
  let nearby_coordinates = await redis.georadiusAsync('location_elevations', coordinate.long, coordinate.lat, precisionRadius, 'm', 'ASC');
  if (nearby_coordinates.length) {
    for (let nearby_coordinate_key of nearby_coordinates) {
      let elevation = await redis.getAsync(nearby_coordinate_key);
      if (elevation) {
        return elevation;
      }
    }
  }
};

const getElevations = async (coordinates = [], precisionRadius = 50) => {
  let results = [];
  let unknownLocations = [];

  for (let coordinate of coordinates) {
    let elevation = await redis.getAsync(generateElevationKey(coordinate));
    if (elevation) {
      results.push({coord: coordinate, elevation: elevation});
    } else {
      // check nearby locations for already existing elevation
      elevation = await getNearByLocationElevation(coordinate, precisionRadius);
      if (elevation) {
        results.push({coord: coordinate, elevation: elevation});
      } else {
        unknownLocations.push(coordinate);
      }
    }
  }
  if (unknownLocations.length > 0) {
    try {
      const newLocations = await getFromElevationApi(unknownLocations);
      let redis_multi = redis.multi();
      newLocations.forEach(new_location => {
        let newLocationKey = generateElevationKey(new_location.coord);
        redis_multi.set(newLocationKey, new_location.elevation);
        redis.geoaddAsync('location_elevations', new_location.coord.long, new_location.coord.lat, newLocationKey);
      });
      redis_multi.exec();
      results = results.concat(newLocations);
    } catch (err) {
      console.error('Unable to fetch some locations elevation. ', {locations: unknownLocations, err: err.message});
    }
  }
  return results;
};

module.exports = {
  getElevations,
};
