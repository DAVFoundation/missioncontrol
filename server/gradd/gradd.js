const email = require('./../lib/email');

const GRADD_FROM = `dmauas@gmail.com`;
const GRADD_TO = `dmauas@gmail.com`;
const GRADD_TITLE = `Gradd title`;
const GRADD_BODY = `Gradd body`;

const buildLinkToGraddForm = missionId => {
  let link = `<a href="http://aws.domain.com/link-to-form&missionId=${missionId}">Press Here to input route JSON</a>`;
  return link;
};
const emailGraddStatusPayloadRequest = async (missionId) => {
  let gradd_body = GRADD_BODY + `<br/>` + buildLinkToGraddForm(missionId);
  return await email.mail(GRADD_FROM, GRADD_TO, GRADD_TITLE, gradd_body);
};

module.exports = {
  emailGraddStatusPayloadRequest
};