const { getBidsForNeed, addNewBid } = require('../store/bids');
const { createMission } = require('../store/missions');
const { updateCaptainStatus } = require('../store/captains');
const { getBid,saveBid } = require('../store/bids');
const validate = require('../lib/validate');
// const droneApi = require('../coex/drone');

const create = async (req, res) => {
  const { needId } = req.params;
  const params = req.body;
  params.need_id = needId;

  const validationErrors = validate(params, {}); //createConstraints);
  if (validationErrors) {
    res.status(422).json(validationErrors);
  } else {
    let bid = await addNewBid(params, needId);
    // await addNewVehicle(bid.id);
    // bid = await getBid(bid.id);
    if (bid) {
      res.json(bid);
    } else {
      res.status(500).send('Something broke!');
    }
  }
};

const fetch = async (req, res) => {
  try {
    const { needId } = req.params;
    const bids = (!needId) ? [] : await getBidsForNeed(needId);
    res.status(200).json(bids);
  }
  catch (error) {
    res.status(500).send('Something broke.');
    console.error(error);
  }
};

const chooseBid = async (req, res) => {
  const { user_id } = req.query;
  const { bidId } = req.params;
  const mission = await createMission({
    user_id,
    bidId,
  });
  if (mission) {
    let bid=await getBid(bidId);
    bid.chosen=true;
    await saveBid(bid);
    await updateCaptainStatus(mission.captain_id, 'contract_received');
    res.json({ mission });
  } else {
    res.status(500).send('Something broke!');
  }
};

const fetchChosen = async (req, res) => {
  const { needId } = req.params;
  const bids = (await getBidsForNeed(needId)).filter(bid=>bid.chosen==='true');
  res.status(200).send(bids);
};

module.exports = { fetch, chooseBid, fetchChosen, create };
