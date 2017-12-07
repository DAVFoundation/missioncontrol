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

  test('Return contains the davID within it options',() => {     
    expect(       
      checkIfReturnDavId(getDavIdIconUrl(dummyDavId))     
    ).toBeTruthy();   
  });    
  
  const checkIfReturnDavId = (url) => {     
    if (url.toLowerCase().indexOf(dummyDavId) >= 0) {       
      return true;     
    } else {       
      return false;     
    }   
  }
});
