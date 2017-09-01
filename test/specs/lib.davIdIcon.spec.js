const { getDavIdIconUrl, checkIfAbsoluteURL } = require('../../server/lib/davIdIcon.js');

describe('getDavIdIconUrl()', () => {
  test('returns an absolute URL', () => {
    expect(
      checkIfAbsoluteURL(getDavIdIconUrl())
    ).toBeTruthy();
  });

});