const createConstraints = require('./constraints/captain/create');
const needTypeConstraints = require('./constraints/captain/needType');
const validate = require('../lib/validate');
const { addNewCaptain, addNeedTypeForCaptain } = require('../store/captains');

const create = async (req, res) => {
  let params = req.body;
  const validationErrors = validate(params, createConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    const davId = await addNewCaptain(params);
    res.status(200).json({ dav_id: davId });
  }
};


const registerNeedTypeForCaptain = async (req, res) => {
  let params = req.body;
  const { davId } = req.params;
  params.dav_id = davId;
  const validationErrors = validate(params, needTypeConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    try {
      const davId = await addNeedTypeForCaptain(params);
      res.json({ dav_id: davId });
    }
    catch (error) {
      res.status(500).send(JSON.stringify(error));
    }
  }
};

module.exports = { create, registerNeedTypeForCaptain };