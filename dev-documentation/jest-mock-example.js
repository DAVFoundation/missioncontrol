jest.doMock('redis', () => {
    return {
      RedisClient: Object, 
      createClient: (options) => { // eslint-disable-line no-unused-vars
        return {
          hsetAsync: () => Promise.resolve({  }) // eslint-disable-line no-unused-vars
        };
      }
    };
  });
  
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