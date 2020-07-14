var fs = require('fs');
var blend = require('..');
var Queue = require('./queue');

function benchTint() {
    return new Promise((resolve, reject) => {
        
        console.log('Started Execution for bench tint');
        console.time('benchTint');


        // Actual benchmarking code:

        var iterations = 100;
        var concurrency = 10;

        var images = [
            { buffer: fs.readFileSync('test/fixture/tinting/iceland.png'),
            tint:blend.parseTintString(blend.upgradeTintString('30;50'))
            },
            { buffer: fs.readFileSync('test/fixture/tinting/heat.png'),
            tint:{h:[.5,1],s:[1,1],l:[0,1],a:[0,1]}
            }
        ];

        var written = false;

        var queue = new Queue(function(i, done) {
            blend(images, {
                width: 256,
                height: 256,
                quality: 256,
                encoder:'libpng',
                mode:'hextree'
            }, function(err, data) {
                if (!written) {
                    fs.writeFileSync('./out-tint1.png', data);
                    written = true;
                }
                done();
            });
        }, concurrency);

        queue.on('empty', function() {
            var msec = Date.now() - start;
            console.warn('[Tint] Iterations: %d', iterations);
            console.warn('[Tint] Concurrency: %d', concurrency);
            console.warn('[Tint] Per second: %d', iterations / (msec / 1000));
            console.timeEnd('benchTint');
            resolve();
        });

        for (var i = 1; i <= iterations; i++) {
            queue.add(i, false);
        }

        var start = Date.now();
        queue.start();
    });
}

module.exports = benchTint;
