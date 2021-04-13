(async function () {
  const fs_readFilePromise = require('util').promisify(require('fs').readFile);

  var assert = require('assert');

  var fs = require('fs');

  var blend = require('..');

  var utilities = require('./support/utilities');

  var images = [await fs_readFilePromise('test/fixture/1.png'), await fs_readFilePromise('test/fixture/2.png'), await fs_readFilePromise('test/fixture/3.png'), await fs_readFilePromise('test/fixture/4.png'), await fs_readFilePromise('test/fixture/5.png')];
  describe('cropping', function () {
    it('should crop the image to width and height', function (done) {
      blend(images, {
        width: 128,
        height: 128
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/20.png', done);
      });
    });
    it('should expand the image to width and height', function (done) {
      blend(images, {
        width: 384,
        height: 384
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/21.png', done);
      });
    });
  });
})();