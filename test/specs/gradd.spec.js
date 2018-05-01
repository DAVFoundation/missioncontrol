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
/* const { emailGraddStatusPayloadRequest,buildMissionParamFromMission } = require('../../server/gradd/gradd');
const { updateGraddPayload } = require('../../server/controllers/MissionController');
const dummyMissionId = 1;
const dummyGraddPayload = `Mock GRADD payload JSON`;

dummyMission = {
  mission_id        : "AAAA1111",
  pickup_latitude   : 0,
  pickup_longitude  : 0,
  pickup_altitude   : 0,
  pickup_heading    : 0,
  pickup_distance   : 0,
  dropoff_latitude  : 10,
  dropoff_longitude : 10,
  dropoff_altitude  : 0,
  coordinates       : []
};
let paramBase64 = buildMissionParamFromMission(dummyMission);
console.log(paramBase64);
let decoded = Buffer.from(paramBase64, 'base64');
console.log("\n\n\n");
// console.log(JSON.stringify(decoded, null, 4));
console.log(JSON.parse(Buffer.from(paramBase64, 'base64').toString()));
 */
//JSON.parse(Buffer.from("eyJtaXNzaW9uX2lkIjoiQUFBQTExMTEiLCJwaWNrdXBfbGF0aXR1ZGUiOjAsInBpY2t1cF9sb25naXR1ZGUiOjAsInBpY2t1cF9hbHRpdHVkZSI6MCwicGlja3VwX2hlYWRpbmciOjAsInBpY2t1cF9kaXN0YW5jZSI6MCwiZHJvcG9mZl9sYXRpdHVkZSI6MTAsImRyb3BvZmZfbG9uZ2l0dWRlIjoxMCwiZHJvcG9mZl9hbHRpdHVkZSI6MCwiY29vcmRpbmF0ZXMiOltdfQ==", 'base64').toString())

/* 
describe('buildMissionParamFromMission', dummyMission => {
  test(`builds a base64 encoded parameter from a mission object`, () => {
    expect(
      (() => {
        let paramBase64 = buildMissionParamFromMission(dummyMission);
        console.log(paramBase64);
        return paramBase64;
      })()
    ).stringMatching(/\w+/);
  });
});
 *//* 
describe('emailGraddStatusPayloadRequest', ()=>{
  test(`sends an email to gradd, and updates a vehicle status to 'contract_received'`, () => {
    expect(
      (()=>{
        emailGraddStatusPayloadRequest(dummyMissionId);
        return true;
      })()
    ).toBe(true);
  });
});
describe('updateGraddPayload', ()=>{
  test(`updates mock mission with dummy gradd payload`, () => {
    expect(
      (()=>{
        let dummyRequest = { params: { mission_id:dummyMissionId, gradd_payload: dummyGraddPayload}};
        updateGraddPayload(dummyRequest);
        return true;
      })()
    ).toBe(true);
  });
});
 */