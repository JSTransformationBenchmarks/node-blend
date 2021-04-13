(async function () {
  const fs_readFilePromise = require('util').promisify(require('fs').readFile);

  var assert = require('assert');

  var fs = require('fs');

  var blend = require('..');

  var utilities = require('./support/utilities');

  var images = [await fs_readFilePromise('test/fixture/1.png'), await fs_readFilePromise('test/fixture/2.png'), await fs_readFilePromise('test/fixture/3.png'), await fs_readFilePromise('test/fixture/4.png'), await fs_readFilePromise('test/fixture/5.png')];
  describe('PNG blending', function () {
    it('should return the last image if it does not have alpha', function (done) {
      blend([images[1], images[0]], function (err, data) {
        if (err) return done(err);
        assert.deepEqual(images[0], data);
        done();
      });
    });
    it('should return the correctly blended file for five valid images', function (done) {
      blend(images, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/1.png', done);
      });
    });
    it('should return the correctly blended file for two valid images', function (done) {
      blend([images[2], images[3]], function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/2.png', done);
      });
    });
  });
  describe('JPEG writing', function () {
    it('should write a JPEG', async function (done) {
      blend([await fs_readFilePromise('test/fixture/1a.jpg'), await fs_readFilePromise('test/fixture/2.png')], {
        format: 'jpeg'
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/6.jpg', 0.01, done);
      });
    });
    it('should write a JPEG with 50% quality', async function (done) {
      blend([await fs_readFilePromise('test/fixture/1a.jpg'), await fs_readFilePromise('test/fixture/2.png')], {
        format: 'jpeg',
        quality: 50
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/7.jpg', 0.01, done);
      });
    });
    it('should write a PNG that is explicitly marked as such', async function (done) {
      blend([await fs_readFilePromise('test/fixture/1c.jpg'), await fs_readFilePromise('test/fixture/2.png')], {
        format: 'png'
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/8.png', 0.01, done);
      });
    });
    it('should write a PNG with an empty parameters hash', async function (done) {
      blend([await fs_readFilePromise('test/fixture/1c.jpg'), await fs_readFilePromise('test/fixture/2.png')], {// empty
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/9.png', 0.01, done);
      });
    });
    it('should blend two JPEG images', async function (done) {
      blend([await fs_readFilePromise('test/fixture/1a.jpg'), await fs_readFilePromise('test/fixture/2.png')], function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/3.png', done);
      });
    });
    it('should blend grayscale JPEGs', async function (done) {
      blend([await fs_readFilePromise('test/fixture/1b.jpg'), await fs_readFilePromise('test/fixture/2.png')], function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/4.png', done);
      });
    });
    it('should blend color JPEGs', async function (done) {
      blend([await fs_readFilePromise('test/fixture/1c.jpg'), await fs_readFilePromise('test/fixture/2.png')], function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/5.png', 0.01, done);
      });
    });
    it('should blend weird PNGs', async function (done) {
      blend([await fs_readFilePromise('test/fixture/105-2.png'), await fs_readFilePromise('test/fixture/105-1.png')], function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/105.png', done);
      });
    });
  });
})();