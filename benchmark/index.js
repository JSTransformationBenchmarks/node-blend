
//const benchStitchCanvas = require('./bench-stitch-canvas');
const benchStitch = require('./bench-stitch');
const benchTint = require('./bench-tint');
const benchTint2 = require('./bench-tint2');
const reencodeJpg = require('./reencode-jpg');
const reencodePng = require('./reencode-png');
const reencodeWebp = require('./reencode-webp');

const benchmarks = [];

console.log('Starting Benchmarks');
console.time('benchmark');

benchmarks.push(benchStitch());
benchmarks.push(benchTint());
benchmarks.push(benchTint2());
benchmarks.push(reencodeJpg());
benchmarks.push(reencodePng());
benchmarks.push(reencodeWebp());

Promise.all(benchmarks)
.then(() => {
    console.timeEnd('benchmark');
});
