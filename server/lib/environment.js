const davEnv = process.env.DAV_ENV;

const hasStore = () => ['simulated'].includes(davEnv);

module.exports = {
  hasStore
};
