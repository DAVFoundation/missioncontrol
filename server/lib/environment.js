const davEnv = process.env.DAV_ENV;

function hasStore() {
  const hasStore = ['simulated'].includes(davEnv);
  return  hasStore;
}

module.exports = {
  hasStore
};
