
var fs = require('fs');
var blend = require('..');
var Queue = require('./queue');

function benchStitch() {
    return new Promise((resolve, reject) => {

        console.log('Started Execution for bench stitch');
        console.time('benchStitch');

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
            blend(images, {
                width: 700,
                height: 600,
                quality: 256,
                encoder:'libpng',
                mode:'hextree'
            }, function(err, data) {
                if (!written) {
                    fs.writeFileSync('./out.png', data);
                    written = true;
                }
                done();
            });
        }, concurrency);

        queue.on('empty', function() {
            var msec = Date.now() - start;
            console.warn('[Stitch] Iterations: %d', iterations);
            console.warn('[Stitch] Concurrency: %d', concurrency);
            console.warn('[Stitch] Per second: %d', iterations / (msec / 1000));
            console.timeEnd('benchStitch');
            resolve();
        });

        for (var i = 1; i <= iterations; i++) {
            queue.add(i, false);
        }

        var start = Date.now();
        queue.start();
    });
}

module.exports = benchStitch;
