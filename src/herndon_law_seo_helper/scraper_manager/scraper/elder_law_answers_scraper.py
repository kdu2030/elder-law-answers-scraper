import requests
from typing import List
from bs4 import BeautifulSoup
from enum import Enum


class ScraperErrorCode(Enum):
    UNKNOWN = 0
    UNABLE_TO_FIND_ARTICLE = 1

class ScraperException(Exception):
    def __init__(self, error_code: ScraperErrorCode):
        self.error_code = error_code

class ElderLawAnswersScraper:
    HERNDON_LAW_BASE_URL = "https://www.herndonlawva.com"
    ELDER_LAW_ANSWERS_BASE_URL = "https://www.elderlawanswers.com"
    MAX_ARTICLE_PAGES = 20

    def __init__(self, website_username: str, website_password: str):
        self.website_username = website_username
        self.website_password = website_password

    def find_article(self, posted_articles: List[str]) -> str:
        posted_articles_set = set(posted_articles)
        for page_index in range(self.MAX_ARTICLE_PAGES):
            ela_page = requests.get(f"{self.ELDER_LAW_ANSWERS_BASE_URL}/news-and-information?page=${page_index + 1}")
            parser = BeautifulSoup(ela_page.content, "html.parser")
            article_links = parser.select(".excerpt__title a")
            for article_link in article_links:
                if article_link.get_text() not in posted_articles_set:
                    return article_link.get("href")

        raise ScraperException(ScraperErrorCode.UNABLE_TO_FIND_ARTICLE.value)

    def post_article(self):
        post_endpoint = f"{self.HERNDON_LAW_BASE_URL}/wp-json/wp/v2/posts"
        post_data = {
            "title": "Test Post",
            "content": "<h1>This is a test</h1>",
            "status": "publish"
        }

        response = requests.post(post_endpoint, json=post_data,
                                 auth=requests.auth.HTTPBasicAuth(self.website_username, self.website_password))
        print(response.json())
