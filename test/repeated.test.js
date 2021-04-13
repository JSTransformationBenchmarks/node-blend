(async function () {
  const fs_readFilePromise = require('util').promisify(require('fs').readFile);

  var assert = require('assert');

  var http = require('http');

  var fs = require('fs');

  var blend = require('..');

  var utilities = require('./support/utilities');

  var images = [await fs_readFilePromise('test/fixture/1.png'), await fs_readFilePromise('test/fixture/2.png'), await fs_readFilePromise('test/fixture/3.png'), await fs_readFilePromise('test/fixture/4.png'), await fs_readFilePromise('test/fixture/5.png')];
  describe('repeated blending', function () {
    it('should repeatedly blend images and serve over HTTP', function (done) {
      var length = 0;
      var server = http.createServer(function (req, res) {
        res.writeHead(200);
        blendImages(10);

        function blendImages(i) {
          blend(images, function (err, data) {
            if (err) return done(err);
            length = data.length;
            if (i == 0) res.end(data);else blendImages(i - 1);
          });
        }
      });
      server.listen(38295, function () {
        http.get({
          path: '/',
          port: 38295
        }, function (res) {
          var received = 0;
          res.on('data', function (data) {
            received += data.length;
          });
          res.on('end', function () {
            assert.equal(received, length);
            server.close();
            done();
          });
        });
      });
    });
  });
})();