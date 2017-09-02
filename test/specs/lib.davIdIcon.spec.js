const { getDavIdIconUrl } = require('../../server/lib/davIdIcon.js');
const { URL } = require('url');

describe('getDavIdIconUrl()', () => {
  test('returns an absolute URL', () => {
    expect(
      checkIfAbsoluteURL(getDavIdIconUrl())
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
});