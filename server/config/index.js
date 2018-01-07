const config = {
  requests_ttl: 43200,
  bids_ttl: 3600,
};

module.exports = key => {
  if (!(key in config)) {
    throw `The given key "${key}" to config was invalid`;
  } else {
    return config[key];
  }
};
