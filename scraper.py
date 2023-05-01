import requests
import time
import re
import paramiko

# URL TO SCRAPE PROXIES
urls = [
    "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all",
    "https://proxyspace.pro/http.txt",
    "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/https.txt",
    "https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/master/http.txt",
    "https://raw.githubusercontent.com/saisuiu/Lionkings-Http-Proxys-Proxies/main/free.txt",
    "https://raw.githubusercontent.com/tahaluindo/Free-Proxies/main/proxies/http.txt",
    "https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/http.txt",
]

proxies = []
for url in urls:
    response = requests.get(url)

    if response.status_code == 200:
        extracted_proxies = re.findall(r"\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}\b", response.text)
        proxies.extend(extracted_proxies)

check_url = "https://www.google.com/"
proxy = []

for proxy in proxies:
    start = time.time()
    try:
        response = requests.get(check_url, proxies={"http": proxy})
        if response.status_code == 200:
            proxy.append(proxy)
            print("checking proxies!")
    except:
        print("Proxy {proxy} is not working.")
with open("proxy.txt", "w") as f:
    for proxy in proxy:
        f.write("{proxy}")

print("{len(good_proxies)} good proxies have been saved to proxy.txt")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect("IP", port=22, username="root", password="PASSWORD")

sftp = ssh.open_sftp()
sftp.put("proxy.txt", "/home/stable/proxy.txt")
sftp.close()

ssh.close()
