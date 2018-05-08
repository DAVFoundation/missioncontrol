const API_KEY = 'key-099572ee6cd2260a358eeb65b3eeeef8';
const DOMAIN = 'mg.dav.network';
const mailgun = require('mailgun-js')({apiKey: API_KEY, domain: DOMAIN});
var mailcomposer = require('mailcomposer');

const mail = async (from,to,title,body) => {
  let mail = mailcomposer({
    from: from,
    to: to,
    subject: title,
    body: body,
    html: body
  });
  mail.build(function(mailBuildError, message) {
    var dataToSend = {
      to: to,
      message: message.toString('ascii')
    };
    mailgun.messages().sendMime(dataToSend, function (sendError, body) {
      if (sendError) {
        console.log(sendError+'\r\n'+body);
        return;
      }
    });
  });
};

module.exports = {
  mail
};