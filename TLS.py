import os
from os import name, system
from pystyle import Colors, Colorate, Center
if name == 'nt':
    system("title Đậu Đậu - HTTP2 Tunnel")
    system("mode 101, 25")
os.system("cls" if os.name == "nt" else "clear")
panel = """
  ________  __         ______             __                                                       
 /        |/  |       /      \           /  |                                                 
 $$$$$$$$/ $$ |      /$$$$$$  |         _$$ |_    __    __  _______   _______    ______    ______  
    $$ |   $$ |      $$ \__$$/  ______ / $$   |  /  |  /  |/       \ /       \  /      \  /      \ 
    $$ |   $$ |      $$      \ /      |$$$$$$/   $$ |  $$ |$$$$$$$  |$$$$$$$  |/$$$$$$  |/$$$$$$  |
    $$ |   $$ |       $$$$$$  |$$$$$$/   $$ | __ $$ |  $$ |$$ |  $$ |$$ |  $$ |$$    $$ |$$ |  $$/ 
    $$ |   $$ |_____ /  \__$$ |          $$ |/  |$$ \__$$ |$$ |  $$ |$$ |  $$ |$$$$$$$$/ $$ |      
    $$ |   $$       |$$    $$/           $$  $$/ $$    $$/ $$ |  $$ |$$ |  $$ |$$       |$$ |      
    $$/    $$$$$$$$/  $$$$$$/             $$$$/   $$$$$$/  $$/   $$/ $$/   $$/  $$$$$$$/ $$/       
"""
print(Colorate.Diagonal(Colors.red_to_yellow, Center.XCenter(panel)))
print()
host=input(Colorate.Diagonal(Colors.red_to_yellow, "       [+] URL Taget: "))
time=int(input(Colorate.Diagonal(Colors.red_to_yellow, "       [+] Time (s): ")))
print(Colorate.Diagonal(Colors.red_to_yellow, "  ========================================================================="))
input(Colorate.Diagonal(Colors.red_to_yellow, '       Vui lòng xác nhận attack (Enter)'))
os.system("cls" if os.name == "nt" else "clear")
print()
print(Colorate.Diagonal(Colors.red_to_yellow, "  ========================================================================="))
print(Colorate.Diagonal(Colors.red_to_yellow, "       Url               =     {}".format(host)))
print(Colorate.Diagonal(Colors.red_to_yellow, "       Time              =     {} giây".format(time)))
print(Colorate.Diagonal(Colors.red_to_yellow, "       Methods (default)     =     GET"))
print(Colorate.Diagonal(Colors.red_to_yellow, "       port (default)         =     443"))
print(Colorate.Diagonal(Colors.red_to_yellow, "  ========================================================================="))
os.system(f"node TLS.js {host} {time}")
print(Colorate.Diagonal(Colors.red_to_yellow, "  ========================================================================="))
input(Colorate.Diagonal(Colors.red_to_yellow, '       ấn Enter để thoát'))
# https://github.com/DauDau432/HTTP2-Flooder/
