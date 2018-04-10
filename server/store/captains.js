const redis = require('./redis');
const {aerospikeConfig, namespace} = require('../config/aerospike');
const Aerospike = require('aerospike');
const GeoJSON = Aerospike.GeoJSON;
const filter = Aerospike.filter;
const aerospike = Aerospike.client(aerospikeConfig());
const {getBid} = require('./bids');
const Rx = require('rxjs/Rx');

const MAX_LOCAL_RADIUS = 10e5;


const addNewCaptain = async ({dav_id}) => {
  await redis.hmsetAsync(`captains:${dav_id}`,
    'id', dav_id
  );

  return dav_id;
};

const addNeedTypeForCaptain = async ({dav_id, need_type, region}) => {
  await redis.saddAsync(`needTypes:${need_type}`, dav_id); // adds this captain davId to the needType
  await addNeedTypeIndexes(need_type);
  await aerospike.connect();
  let key = new Aerospike.Key(namespace, need_type, dav_id);
  let bins = {
    dav_id: dav_id,
    global: region.radius > MAX_LOCAL_RADIUS ? 1 : 0,
    region: new GeoJSON({
      type: 'AeroCircle',
      coordinates: [[region.longitude, region.latitude], Math.min(region.radius, MAX_LOCAL_RADIUS)]
    })
  };
  let policy = new Aerospike.WritePolicy({
    exists: Aerospike.policy.exists.CREATE_OR_REPLACE
  });
  await aerospike.put(key, bins, {ttl: region.ttl}, policy);
  return dav_id;
};

const addNeedToCaptain = async (davId, needId, ttl) => {
  let captainNeeds = {
    dav_id: davId,
    needs: await getNeeds(davId)
  };
  captainNeeds.needs.push(needId);
  let policy = new Aerospike.WritePolicy({
    exists: Aerospike.policy.exists.CREATE_OR_REPLACE
  });
  await aerospike.connect();
  let key = new Aerospike.Key(namespace, 'needs', davId);
  await aerospike.put(key, captainNeeds, {ttl: ttl}, policy);
  return davId;
};

const addBidToCaptain = async (davId, bidId, ttl) => {
  let captainBids = {
    dav_id: davId,
    bids: await getBids(davId)
  };
  captainBids.bids.push(bidId);
  let policy = new Aerospike.WritePolicy({
    exists: Aerospike.policy.exists.CREATE_OR_REPLACE
  });
  await aerospike.connect();
  let key = new Aerospike.Key(namespace, 'bids', davId);
  await aerospike.put(key, captainBids, {ttl: ttl}, policy);
  return davId;
};

const getNeeds = async (davId) => {
  try {
    let policy = new Aerospike.WritePolicy({
      exists: Aerospike.policy.exists.CREATE_OR_REPLACE
    });
    await aerospike.connect();
    let key = new Aerospike.Key(namespace, 'needs', davId);
    let res = await aerospike.get(key, policy);
    return res.bins.needs;
  }
  catch (error) {
    if (error.message.includes('Record does not exist in database')) {
      return [];
    }
    throw error;
  }
};

const getBids = async (davId) => {
  try {
    let policy = new Aerospike.WritePolicy({
      exists: Aerospike.policy.exists.CREATE_OR_REPLACE
    });
    await aerospike.connect();
    let key = new Aerospike.Key(namespace, 'bids', davId);
    let res = await aerospike.get(key, policy);
    const bidIds = res.bins.bids;
    const bids =   await Promise.all(bidIds.map(async bidId => await getBid(bidId)));
    return bids;
  }
  catch (error) {
    if (error.message.includes('Record does not exist in database')) {
      return [];
    }
    throw error;
  }
};

const createIndex = async (set, bin, type) => {
  try {
    await aerospike.connect();
    await aerospike.createIndex({
      ns: namespace,
      set: set,
      bin: bin,
      index: `idx_${namespace}_${set}_${bin}`,
      datatype: type
    });
  } catch (error) {
    if (error.message.includes('Index with the same name already exists')) {
      return;
    }
    else {
      console.log(error);
      throw error;
    }
  }
};

const addNeedTypeIndexes = async (needType) => {
  await createIndex(needType, 'region', Aerospike.indexDataType.GEO2DSPHERE);
  await createIndex(needType, 'global', Aerospike.indexDataType.NUMERIC);
};

const getCaptain = async davId => {
  return await redis.hgetallAsync(`captains:${davId}`);
};

const getCaptainsForNeedType = (needType, {pickup/* , dropoff */}) => {
  return new Promise(async (resolve, reject) => {
    try {
      let client = await aerospike.connect();
      geoQueryStreamForTerminal(pickup, needType, client)
        .distinct(davId => davId)
        .toArray()
        .subscribe(async davIds => {
          await (Promise.all(davIds.map((id) => {
            return redis.hgetallAsync(`captains:${id}`);
          })))
            .then(captains =>
              resolve(captains));
        }, (error) => {
          console.error(error);
          resolve([]);
        });
    } catch (err) {
      reject(err);
    }
  });
};

const query = (set, filters) => {
  let subject = new Rx.Subject();
  let query = aerospike.query(namespace, set, {filters: filters});
  let stream = query.foreach();

  stream.on('data', (record) => {
    subject.next(record);
  });

  stream.on('error', (error) => {
    subject.error(error);
  });
  stream.on('end', () => {
    subject.complete();
  });
  return subject;
};

const geoQueryStreamForTerminal = (terminal, needType) => {
  return Rx.Observable.merge(
    query(needType, [filter.geoContainsPoint('region', terminal.longitude, terminal.latitude)]),
    query(needType, [filter.equal('global', 1)])
  )
    .map(record => record.bins.dav_id);
};

module.exports = {
  addNewCaptain,
  getCaptain,
  getCaptainsForNeedType,
  addNeedTypeForCaptain,
  addNeedToCaptain,
  addBidToCaptain,
  getNeeds,
  getBids
};
