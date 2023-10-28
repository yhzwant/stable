const axios = require('axios');
const fs = require('fs');

const proxyURLs = [
  'http://212.87.213.146:3000/privateproxy.txt',
  //'http://212.87.213.146:3000/privateproxy2.txt',
  //'http://212.87.213.146:3000/privateproxy3.txt',
  //'http://212.87.213.146:3000/privateproxy4.txt'
];

let totalProxiesReceived = 0;
let totalDuplicates = 0;
let uniqueProxies = new Set();
let failedURLs = [];

const proxyfile = process.argv[2];

if (process.argv.length < 3) {
  console.log('node getproxy.js [Proxyfile]');
  process.exit();
}

async function downloadProxies() {
    totalDuplicates = 0;
    uniqueProxies = new Set();
    failedURLs = [];
    totalProxiesReceived = 0;

  for (const url of proxyURLs) {
    try {
      const response = await axios.get(url, { timeout: 8000 });

      const proxies = response.data.split('\n');
      totalProxiesReceived += proxies.length;

      proxies.forEach(proxy => {
        if (uniqueProxies.has(proxy)) {
          totalDuplicates++;
        } else {
          uniqueProxies.add(proxy);
        }
      });
    } catch (error) {
      failedURLs.push(url);
    }
  }

  const uniqueProxiesArray = Array.from(uniqueProxies);
  const mergedUniqueProxies = uniqueProxiesArray.join('\n');
  fs.writeFileSync(proxyfile, mergedUniqueProxies, { flag: 'w' });
  console.log('');
  console.log(`Proxies overwritten in file ${proxyfile}`);
  console.log('');
  console.log(`Total proxy: ${totalProxiesReceived}`);
  console.log(`Duplicated proxy: ${totalDuplicates}`);
  console.log(`Unique proxies: ${uniqueProxies.size}`);

  if (failedURLs.length > 0) {
    console.log('');
    console.log('Failed to get proxy:');
    failedURLs.forEach(url => console.log(url));
  }
}

downloadProxies();

setInterval(downloadProxies, 60 * 2 * 1000);
