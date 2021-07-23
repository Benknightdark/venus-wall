import httpx
from bs4 import BeautifulSoup

html=httpx.get('https://www.jkforum.net/thread-13825466-1-1.html').text
root = BeautifulSoup(html, "html.parser")
images = root.find_all('ignore_js_op')
for image in images:
        if hasattr(image.find('img',attrs={'class':'zoom'}), 'file') == None:
            image_url = image.find('img')['file']
            print(image_url)
        else:                    
            print(image.find('img',attrs={'class':'zoom'})['file'])
    #print(image.find('img',attrs={'class':'zoom'}))