const { getDavIdIconUrl } = require('../../server/lib/davIdIcon.js');
const { URL } = require('url');
const dummyDavId = '0xdfddfdfdfdfdfdfdfdfdfdfdfdfddfdfdfdfdfdd';

describe('getDavIdIconUrl()', () => {
  test('returns an absolute URL', () => {
    expect(
      checkIfAbsoluteURL(getDavIdIconUrl(dummyDavId))
    ).toBeTruthy();
  });
  
  const checkIfAbsoluteURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (err) {
      return false;  
    }
  };

  test('returns a string containing the given davID', () => {
    expect(
      getDavIdIconUrl(dummyDavId).includes(dummyDavId)
    ).toBeTruthy();
  });  
  
});
