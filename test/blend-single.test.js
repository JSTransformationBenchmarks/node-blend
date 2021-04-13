(async function () {
  const fs_readFilePromise = require('util').promisify(require('fs').readFile);

  var assert = require('assert');

  var fs = require('fs');

  var blend = require('..');

  var utilities = require('./support/utilities');

  var images = [await fs_readFilePromise('test/fixture/1.png'), await fs_readFilePromise('test/fixture/2.png'), await fs_readFilePromise('test/fixture/pattern.png'), await fs_readFilePromise('test/fixture/9.webp')];
  describe('reencode', function () {
    it('should reencode as PNG 24 bit', function (done) {
      blend([images[0]], {
        reencode: true,
        compression: 1
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length > 16000);
        utilities.imageEqualsFile(data, 'test/fixture/results/14.png', done);
      });
    });
    it('should reencode as PNG 24 bit with a better compression ratio', function (done) {
      blend([images[0]], {
        reencode: true,
        compression: 9
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length <= 16000);
        utilities.imageEqualsFile(data, 'test/fixture/results/14b.png', done);
      });
    });
    it('should reencode as JPEG 80%', function (done) {
      blend([images[0]], {
        reencode: true,
        format: 'jpeg'
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length < 10000);
        utilities.imageEqualsFile(data, 'test/fixture/results/15.jpg', 0.01, done);
      });
    });
    it('should reencode as JPEG 40%', function (done) {
      blend([images[0]], {
        reencode: true,
        format: 'jpeg',
        quality: 40
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length < 5000);
        utilities.imageEqualsFile(data, 'test/fixture/results/16.jpg', 0.01, done);
      });
    });
    it('should reencode as PNG 32 colors', function (done) {
      blend([images[0]], {
        reencode: true,
        quality: 32
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length < 12000);
        utilities.imageEqualsFile(data, 'test/fixture/results/17.png', done);
      });
    });
    it('should reencode as PNG 8 colors', function (done) {
      blend([images[0]], {
        reencode: true,
        quality: 8
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length < 8000);
        utilities.imageEqualsFile(data, 'test/fixture/results/18.png', done);
      });
    });
    it('should reencode as WebP 80%', function (done) {
      blend([images[0]], {
        reencode: true,
        format: 'webp'
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length < 8000);
        assert.ok(data.length > 3965);
        utilities.imageEqualsFile(data, 'test/fixture/results/30.webp', 260, done);
      });
    });
    it('should reencode as WebP 40%', function (done) {
      blend([images[0]], {
        reencode: true,
        format: 'webp',
        quality: 40
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length < 4000);
        assert.ok(data.length > 2000);
        utilities.imageEqualsFile(data, 'test/fixture/results/31.webp', 426, done);
      });
    });
    it('should read WebP and reencode as PNG True color', function (done) {
      blend([images[3]], {
        reencode: true
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length < 25000);
        assert.ok(data.length > 20000);
        utilities.imageEqualsFile(data, 'test/fixture/results/32.png', done);
      });
    });
    it('should read WebP and reencode as PNG 128', function (done) {
      blend([images[3]], {
        reencode: true,
        quality: 128
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length < 15000);
        assert.ok(data.length > 10000);
        utilities.imageEqualsFile(data, 'test/fixture/results/33.png', done);
      });
    });
    it('should reencode 2 images with the uppermost opaque', function (done) {
      blend([images[1], images[0]], {
        reencode: true
      }, function (err, data) {
        if (err) return done(err);
        assert.ok(data.length > 15000);
        utilities.imageEqualsFile(data, 'test/fixture/results/14c.png', done);
      });
    });
    it('should reencode an interlaced PNG', function (done) {
      blend([images[2]], {
        reencode: true
      }, function (err, data) {
        if (err) return done(err);
        utilities.imageEqualsFile(data, 'test/fixture/results/26.png', done);
      });
    });
  });
})();