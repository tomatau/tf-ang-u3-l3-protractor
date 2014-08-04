process.env.NODE_ENV = process.env.NODE_ENV || 'TEST';
var db = require('../api/db.js');

describe("Test Pages", function() {

  db.serialize(function() {
    db.run('DELETE FROM urls');
  });

  afterEach(function() {
    db.serialize(function() {
      db.run('DELETE FROM urls');
    });
  });


  function createUrlEntry(title, url) {
    browser.get("#/new");
    element(by.model('formCtrl.form.title')).sendKeys(title);
    element(by.model('formCtrl.form.url')).sendKeys(url);
    return element(by.css('input[type=submit]')).click();
  }

  it('should have no listings on the index page and show a special message', function() {
    browser.get("#/");
    expect(element.all(by.css('.url-listing')).count()).toBe(0);
    expect(element.all(by.css('.empty-url-listing')).count()).toBe(1);
    expect(element(by.css('.empty-url-listing')).getText()).toMatch(/no URL listings/);
  });

  it('should create a new URL listing', function() {
    var customTitle = 'title-' + Math.random();
    var customUrl = 'http://my-new-website.com/' + Math.random();

    createUrlEntry(customTitle, customUrl).then(function() {
      browser.getLocationAbsUrl().then(function(url) {
        expect(url).toMatch(/#\/urls/);
        expect(element.all(by.css('.url-listing')).count()).toBe(1);

        expect(element(by.css('.url-listing .listing-title')).getText()).toContain(customTitle);
        expect(element(by.css('.url-listing .listing-url')).getText()).toContain(customUrl);

        expect(element.all(by.css('.empty-url-listing')).count()).toBe(0);
      });
    });
  });

  it('should search based off of the URL', function() {
    createUrlEntry("url one", "http://url-one.com")
    createUrlEntry("url two", "http://url-two.com");
    createUrlEntry("url three", "http://url-three.com");
    // browser.debugger();

    browser.get("#/");
    expect(element.all(by.css('.url-listing')).count()).toBe(3);

    browser.get("#/?q=one");
    expect(element.all(by.css('.url-listing')).count()).toBe(1);

    browser.get("#/?q=x");
    expect(element.all(by.css('.url-listing')).count()).toBe(0);
  });

  it('should remove listings when they have been deleted', function () {
    var customTitle = 'title-' + Math.random();
    var customUrl = 'http://my-new-website.com/' + Math.random();
    createUrlEntry(customTitle, customUrl);
    
    browser.get("#/?q=title");
    element(by.buttonText('Delete')).click();

    browser.get("#/");
    expect(element.all(by.css('.url-listing')).count()).toBe(0);
  });

  it('should update the list when edited', function () {
    var customTitle = 'title-' + Math.random();
    var customUrl = 'http://my-new-website.com/' + Math.random();
    var changedTitle = "changed";

    createUrlEntry(customTitle, customUrl);
    
    browser.get("#/?q=title");
    element(by.cssContainingText('a', 'Edit')).click()
        .then(function() {
      element(by.model('formCtrl.form.title')).sendKeys(changedTitle);
      element(by.css('input[type=submit]')).click()
          .then(function(){
        expect(element(by.css('.url-listing .listing-title'))
          .getText()).toContain(
            changedTitle
          );
      });
    });
  });
});
