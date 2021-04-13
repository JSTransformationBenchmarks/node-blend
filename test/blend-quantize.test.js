(async function () {
  const fs_readFilePromise = require('util').promisify(require('fs').readFile);

  var assert = require('assert');

  var fs = require('fs');

  var blend = require('..');

  var utilities = require('./support/utilities');

  var images = [await fs_readFilePromise('test/fixture/1.png'), await fs_readFilePromise('test/fixture/2.png'), await fs_readFilePromise('test/fixture/3.png'), await fs_readFilePromise('test/fixture/4.png'), await fs_readFilePromise('test/fixture/5.png')];
  describe('quantization', function () {
    it('should quantize to 128 colors', function (done) {
      blend(images, {
        format: 'png',
        quality: 128
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/quant/1.png', 0.01, done);
      });
    });
    it('should quantize to 64 colors', function (done) {
      blend(images, {
        format: 'png',
        quality: 64
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/quant/2.png', 0.02, done);
      });
    });
    it('should quantize to 16 colors', function (done) {
      blend(images, {
        format: 'png',
        quality: 16
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/quant/3.png', 0.05, done);
      });
    });
    it('should quantize to 8 colors', function (done) {
      blend(images, {
        format: 'png',
        quality: 16
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/quant/4.png', 0.05, done);
      });
    });
  });
})();