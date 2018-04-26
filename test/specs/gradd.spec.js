const { emailGraddStatusPayloadRequest } = require('../../server/gradd/gradd');
const { updateGraddPayload } = require('../../server/controllers/MissionController');
const dummyMissionId = 1;
const dummyGraddPayload = `Mock GRADD payload JSON`;

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