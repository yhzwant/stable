const axios = require('axios');
const fs = require('fs');

const proxyURLs = [
  'https://api.proxyscrape.com/?request=displayproxies&proxytype=http',
  'https://proxyspace.pro/http.txt'
  // Add more URLs here as needed
];

const proxyFile = 'proxy.txt';

async function downloadProxiesFromURL(url) {
  try {
    const response = await axios.get(url);
    const proxies = response.data;
    return proxies;
  } catch (error) {
    console.error(`Error downloading proxies from ${url}:`, error);
    return '';
  }
}

async function downloadProxies() {
  let allProxies = '';

  for (const url of proxyURLs) {
    const proxies = await downloadProxiesFromURL(url);
    allProxies += proxies + '\n';
  }

  if (allProxies) {
    fs.writeFileSync(proxyFile, allProxies, { flag: 'w' });
    console.log(`Proxies written to ${proxyFile}`);
  } else {
    console.error('No proxies were downloaded.');
  }
}

downloadProxies();
