const {createNeed, getNeed, deleteNeed} = require('../store/needs');
const {deleteBidsForNeed} = require('../store/bids');
const createConstraints = require('./constraints/need/create');
const validate = require('../lib/validate');

const create = async (req, res) => {
  const params = req.body;
  const validationErrors = validate(params, createConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    const allowedParamsKeys = Object.keys(createConstraints);
    Object.keys(params).forEach(key => {if (!allowedParamsKeys.includes(key)) delete params[key];});
    params.user_id = req.query.user_id;
    const needId = await createNeed(params);
    if (needId) {
      res.json({needId});
    } else {
      res.status(500).send('Something broke!');
    }
  }
};


const cancel = async (req, res) => {
  const {needId} = req.params;
  const need = await getNeed(needId);
  if (need) {
    await deleteNeed(need);
    await deleteBidsForNeed(need);
    res.send('need cancelled');
  } else {
    res.status(500).send('Something broke!');
  }
};


module.exports = {create, cancel};
