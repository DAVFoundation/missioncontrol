const email = require('./../lib/email');

const GRADD_FROM = `dmauas@gmail.com`;
const GRADD_TO = `dmauas@gmail.com`;
const GRADD_TITLE = `Gradd title`;
const GRADD_BODY = `Gradd body\n<br/>\n`;
const MISSION_ID_PARAM_NAME = `mission_id`;

const buildLinkToGraddForm = missionIdParamValue => {
  let link = `<a href="http://aws.domain.com/link-to-form&${MISSION_ID_PARAM_NAME}=${missionIdParamValue}">Press Here to input route JSON</a>`;
  return link;
};
const emailGraddStatusPayloadRequest = async (missionId) => {
  let gradd_body = GRADD_BODY + `<br/>\n` + buildLinkToGraddForm(missionId);
  console.log(gradd_body);
  return await email.mail(GRADD_FROM, GRADD_TO, GRADD_TITLE, gradd_body);
};

module.exports = {
  emailGraddStatusPayloadRequest
};