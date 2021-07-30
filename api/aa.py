from bs4 import BeautifulSoup
import httpx
i=1
url=f"https://ck101.com"
print(url)
req=httpx.get(url)
res=req.text
print(req.text)
# root = BeautifulSoup(res, "html.parser")
# max_page_number=root.find('div',attrs={"class":"pageTools"})
# print(max_page_number)