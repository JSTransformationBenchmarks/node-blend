(async function () {
  const fs_readFilePromise = require('util').promisify(require('fs').readFile);

  var a = await fs_readFilePromise(__dirname + '/fixture/segfault-a.png');
  var b = await fs_readFilePromise(__dirname + '/fixture/segfault-b.png');
  var c = await fs_readFilePromise(__dirname + '/fixture/8.png');

  var blend = require('../index.js');

  var assert = require('assert');

  describe('blend', function () {
    it('should error (a + a)', function (done) {
      blend([a, a], function (err, data) {
        assert.ok(err);
        done();
      });
    });
    it('should error (b + b)', function (done) {
      blend([b, b], function (err, data) {
        assert.ok(err);
        done();
      });
    });
    it('should error (a + c)', function (done) {
      blend([a, c], function (err, data) {
        assert.ok(err);
        done();
      });
    });
    it('should error (a + b)', function (done) {
      blend([a, b], function (err, data) {
        assert.ok(err);
        done();
      });
    });
  });
})();