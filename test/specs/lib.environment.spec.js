const { hasStore } = require('../../server/lib/environment.js');

describe('hasStore', () => {
  
  test(`returns false when the DAV_ENV environment variable isn't set to 'simulated'`, () => {
    expect.assertions(1);
    if (process.env.DAV_ENV !== 'simulation') {
      expect(hasStore).toBe(false);
    }
  });  
});