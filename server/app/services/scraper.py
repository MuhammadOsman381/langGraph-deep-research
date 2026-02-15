from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
from urllib.parse import urljoin
from bs4 import BeautifulSoup
from urllib.parse import urlparse

def create_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=options
    )
    return driver

def get_domain(url):
    parsed = urlparse(url)
    return parsed.netloc

visited = set()
MAX_DEPTH = 10
MAX_LINKS_PER_PAGE = 3
text_data = []

def crawl(seed_url, url, driver, depth=0, collected=None):
    if collected is None:
        collected = []

    if depth >= MAX_DEPTH:
        return collected

    if url in visited:
        return collected

    visited.add(url)

    try:
        driver.get(url)
        driver.implicitly_wait(5)
        html = driver.page_source
        soup = BeautifulSoup(html, "html.parser")

        for tag in soup.find_all(["header", "footer", "nav", "aside", "script", "style"]):
            tag.decompose()

        text = soup.get_text(separator=" ", strip=True)

        collected.append({
            "url": url,
            "text": text
        })

        links = []
        for a in soup.find_all("a", href=True):
            full_url = urljoin(url, a["href"])
            if full_url.startswith("http"):
                links.append(full_url)

        for link in links[:MAX_LINKS_PER_PAGE]:
            if (get_domain(link) == get_domain(seed_url)):
                get_domain(link)
                continue
            crawl(seed_url, link, driver, depth + 1, collected)

    except Exception as e:
        print(e)

    return collected