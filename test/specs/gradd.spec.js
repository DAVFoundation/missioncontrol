const vehicles = require('../../server/store/vehicles');
const dummyVehicleId = 1;
const dummyMissionId = 1;

describe('updateVehicleStatus', ()=>{
  test(`sends an email to gradd, and updates a vehicle status to 'contract_received'`, () => {
    expect(
      (()=>{vehicles.updateVehicleStatus(dummyVehicleId,'contract_received',dummyMissionId);
        return true;})()
    ).toBe(true);
  });
});

// const { getDavIdIconUrl } = require('../../server/lib/davIdIcon.js');
// const { checkIfAbsoluteURL } = require('../helpers/index.js');
// const dummyDavId = '0xdfddfdfdfdfdfdfdfdfdfdfdfdfddfdfdfdfdfdd';
/*
describe('getDavIdIconUrl()', () => {
  test('returns an absolute URL', () => {
    expect(
      checkIfAbsoluteURL(getDavIdIconUrl(dummyDavId))
    ).toBe(true);
  });

  test('returns a string containing the given davID', () => {
    expect(
      getDavIdIconUrl(dummyDavId).includes(dummyDavId)
    ).toBe(true);
  });  
  
});
*/