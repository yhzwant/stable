import requests
import sys
import threading

class colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    RESET = '\033[0m'

ASCII_ART = '''

_._     _,-'""`-._
(,-.`._,'(       |\`-/|
    `-.-' \ )-`( , o o)
          `-    \`_`"'"-

Credit : https://github.com/ShinyChariot1337/python-checkerproxy/
'''

def check_proxy(proxy, timeout, output_file):
    proxies = {
        'http': 'http://' + proxy,
        'https': 'https://' + proxy
    }
    try:
        response = requests.get('http://google.com', proxies=proxies, timeout=timeout / 1000.0)
        if response.status_code == 200:
            with open(output_file, 'a') as file:
                file.write(proxy + '\n')
            return True
    except:
        return False

def main(proxy_file, proxy_type, output_file, timeout):
    with open(output_file, 'w') as file:
        pass

    with open(proxy_file, 'r') as file:
        proxies = file.read().splitlines()

    total_proxies = len(proxies)
    verified_count = 0
    non_verified_count = 0

    def check_proxy_thread(proxy):
        if check_proxy(proxy, timeout, output_file):
            nonlocal verified_count
            with threading.Lock():
                verified_count += 1
            print(colors.GREEN + "Valid proxy : " + proxy + colors.RESET)
        else:
            nonlocal non_verified_count
            with threading.Lock():
                non_verified_count += 1
            print(colors.RED + "Invalid proxy : " + proxy + colors.RESET)

    threads = []
    for proxy in proxies:
        thread = threading.Thread(target=check_proxy_thread, args=(proxy,))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    print("\nThe test of the proxies is finished. Valid proxies have been saved in the", output_file + "\n")
    print("Final results:\n")
    print("Verified proxies   :", verified_count, "/", total_proxies)
    print("Unverified proxies :", non_verified_count, "/", total_proxies)
    print(ASCII_ART)

def print_help():
    print("Usage: python3 proxy_checker.py <proxy_file> <proxy_type> <output_file> <timeout> ")
    print("Arguments:")
    print("  <proxy_file> : Path of the file containing the proxies to be tested")
    print("  <proxy_type> : Type of proxy to search for.")
    print("  <output_file> : Path of the output file to save valid proxies")
    print("  <timeout>: Timeout in milliseconds for each test request")
    print()
    print("Exemple:")
    print("  python3 checker.py proxies.txt http valides.txt 5000")

if __name__ == '__main__':
    if len(sys.argv) != 5:
        print_help()
        sys.exit(1)

    proxy_file = sys.argv[1]
    proxy_type = sys.argv[2]
    output_file = sys.argv[3]
    timeout = int(sys.argv[4])

    main(proxy_file, proxy_type, output_file, timeout)