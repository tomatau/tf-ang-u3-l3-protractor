process.env.NODE_ENV = process.env.NODE_ENV || 'TEST';
var db = require('../api/db.js');

describe("root page (/)", function() {

  beforeEach(function() {
    db.serialize(function() {
      db.run('DELETE FROM urls', function(err) {
      });
    });
  });

  var ROOT = "http://localhost:7777";

  it('should have no listings on the index page and show a special message', function() {
    browser.get(ROOT + "/");
    expect(element.all(by.css('.url-listing')).count()).toBe(0);

    expect(element.all(by.css('.empty-url-listing')).count()).toBe(1);
    expect(element(by.css('.empty-url-listing')).getText()).toMatch(/no URL listings/);
  });
});
