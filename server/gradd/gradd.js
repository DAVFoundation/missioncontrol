const email = require('./../lib/email');

const GRADD_FROM = `DAV Foundation`;
const GRADD_TO = `dmauas@gmail.com`;
const GRADD_TITLE = `New DAV contract received`;
const GRADD_BODY = `Gradd body\n\n`;
const MISSION_PARAM_NAME = `mission`;
const SCHEME = 'https';
const DOMAIN = 'missions.io';
const DUMMY_MISSION = {
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

const buildMissionParamFromMission = (mission_param) => {
  //todo: build json with initial coords
  let mission = mission_param || DUMMY_MISSION
  let param = {};
  param.mission_id = mission.mission_id;
  param.pickup_latitude = mission.pickup_latitude;
  param.pickup_longitude = mission.pickup_longitude;
  param.pickup_altitude = 0;
  param.pickup_heading = 0;
  param.pickup_distance = 0;
  param.dropoff_latitude = mission.dropoff_latitude;
  param.dropoff_longitude = mission.dropoff_longitude;
  param.dropoff_altitude = 0;
  param.coordinates = [];
  let paramBase64 = Buffer.from( JSON.stringify(param) ).toString('base64');
  return paramBase64;
}
const buildLinkToGraddForm = mission => {
  let missionParamBase64 = buildMissionParamFromMission(mission);
  let link = `<a href="${SCHEME}://${DOMAIN}/graddPayloadForm.html&${MISSION_PARAM_NAME}=${missionParamBase64}">Press Here to input route JSON</a>`;
  return link;
};
const emailGraddStatusPayloadRequest = async (mission) => {
  let gradd_body = GRADD_BODY + `<br/>\n` + buildLinkToGraddForm(mission);
  return await email.mail(GRADD_FROM, GRADD_TO, GRADD_TITLE, gradd_body);
};

module.exports = {
  emailGraddStatusPayloadRequest,
  buildMissionParamFromMission
};