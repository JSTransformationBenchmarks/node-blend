var fs = require('fs');
var Canvas = require('canvas'), Image = Canvas.Image;
var Queue = require('./queue');

// Actual benchmarking code:
var iterations = 500;
var concurrency = 10;


var images = [
    { buffer: fs.readFileSync('test/fixture/5241-12663.png'), x: -43, y: -120 },
    { buffer: fs.readFileSync('test/fixture/5242-12663.png'), x: -43+256, y: -120 },
    { buffer: fs.readFileSync('test/fixture/5243-12663.png'), x: -43+512, y: -120 },
    { buffer: fs.readFileSync('test/fixture/5244-12663.png'), x: -43+768, y: -120 },
    { buffer: fs.readFileSync('test/fixture/5241-12664.png'), x: -43, y: -120+256 },
    { buffer: fs.readFileSync('test/fixture/5242-12664.png'), x: -43+256, y: -120+256 },
    { buffer: fs.readFileSync('test/fixture/5243-12664.png'), x: -43+512, y: -120+256 },
    { buffer: fs.readFileSync('test/fixture/5244-12664.png'), x: -43+768, y: -120+256 },
    { buffer: fs.readFileSync('test/fixture/5241-12665.png'), x: -43, y: -120+512 },
    { buffer: fs.readFileSync('test/fixture/5242-12665.png'), x: -43+256, y: -120+512 },
    { buffer: fs.readFileSync('test/fixture/5243-12665.png'), x: -43+512, y: -120+512 },
    { buffer: fs.readFileSync('test/fixture/5244-12665.png'), x: -43+768, y: -120+512 },
    { buffer: fs.readFileSync('test/fixture/5241-12666.png'), x: -43, y: -120+768 },
    { buffer: fs.readFileSync('test/fixture/5242-12666.png'), x: -43+256, y: -120+768 },
    { buffer: fs.readFileSync('test/fixture/5243-12666.png'), x: -43+512, y: -120+768 },
    { buffer: fs.readFileSync('test/fixture/5244-12666.png'), x: -43+768, y: -120+768 }
];

var written = false;

var queue = new Queue(function(i, done) {
    var result = [];
    var remaining = images.length;
    images.forEach(function(tile, j) {
        var img = new Image();

        img.onload = function() {
            result[j] = { image: img, x: tile.x, y: tile.y };
            if (--remaining) return;

            var canvas = new Canvas(700, 600);
            var ctx = canvas.getContext('2d');
            result.forEach(function(tile) {
                ctx.drawImage(tile.image, tile.x, tile.y);
            });
            canvas.toBuffer(function(err, buffer) {
                if (!written) {
                    fs.writeFileSync('./out.png', buffer);
                    written = true;
                }
                if(err) console.error(err);
                done();
            });
        };

        img.src = tile.buffer;
    });
}, concurrency);

queue.on('empty', function() {
    var msec = Date.now() - start;
    console.warn('[Stitch Canvas] Iterations: %d', iterations);
    console.warn('[Stitch Canvas] Concurrency: %d', concurrency);
    console.warn('[Stitch Canvas] Per second: %d', iterations / (msec / 1000));
});

for (var i = 1; i <= iterations; i++) {
    queue.add(i, false);
}

var start = Date.now();
queue.start();
