const { getDavIdIconUrl } = require('../../server/lib/davIdIcon.js');
const { checkIfAbsoluteURL } = require('../helpers/index.js');
const dummyDavId = '0xdfddfdfdfdfdfdfdfdfdfdfdfdfddfdfdfdfdfdd';

describe('getDavIdIconUrl()', () => {
  test('returns an absolute URL', () => {
    expect(
      checkIfAbsoluteURL(getDavIdIconUrl(dummyDavId))
    ).toBe(true);
  });

  test('returns a string containing the given davID', () => {
    expect(
      getDavIdIconUrl(dummyDavId).includes(dummyDavId)
    ).toBe(true);
  });  
  
});
