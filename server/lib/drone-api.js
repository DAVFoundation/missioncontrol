const axios = require('axios');
const Rx = require('rxjs/Rx');

/*
  curl -H "X-Token:6049a4c4ebe54b769b11f6c9f5b57e5e" https://hub.copterexpress.com/api/drones/list
*/

const API_ROOT = 'https://hub.copterexpress.com/api';
const DAV_API_KEY = '6049a4c4ebe54b769b11f6c9f5b57e5e';
const API_HEADERS = {
  'X-Token': DAV_API_KEY,
  'Content-type': 'application/x-www-form-urlencoded'
};

module.exports =
  class DroneAPI {
    listDrones() {
      return axios.get(`${API_ROOT}/drones/list`, {
        headers: API_HEADERS
      })
        .then(res => res.data,
          e => console.log(e));
    }

    getState(id) {
      return axios.get(`${API_ROOT}/drones/${id}/state`, {
        headers: API_HEADERS
      })
        .then(res => res.data.state);
    }

    stateUpdates(id, interval = 1000) {
      return Rx.Observable.interval(interval)
        .mergeMap(() => {
          return Rx.Observable.fromPromise(this.getState(id));
        });
    }

    goto(id, lat, lng, cruiseAlt, landAlt, release = false) {
      return axios.post(`${API_ROOT}/drones/${id}/command`, {
        headers: API_HEADERS,
        data: {
          'command': 'run_mission',
          'params': {
            'type': 'Delivery',
            'locations': [{
              lat: lat,
              lon: lng,
              altitude_offset: landAlt,
              release_cargo: release
            }],
            'altitude': cruiseAlt
          }
        }
      })
        .then(res => res.data);
    }
  };
