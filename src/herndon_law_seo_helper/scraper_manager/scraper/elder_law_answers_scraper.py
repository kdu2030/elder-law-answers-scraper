import requests
from typing import List
from bs4 import BeautifulSoup, Tag
from enum import Enum

class ScraperErrorCode(Enum):
    UNKNOWN = 0
    UNABLE_TO_FIND_ARTICLE = 1
    ARTICLE_POST_FAILED = 2


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

    def is_article_qa(self, article_element: Tag):
        article_url = f"{self.ELDER_LAW_ANSWERS_BASE_URL}{article_element.get('href')}"
        article_html = requests.get(article_url)
        article_parser = BeautifulSoup(article_html.content, "html.parser")
        question_icon = article_parser.select(".question__icon")
        if question_icon and len(question_icon) > 0:
            return True
        return False

    def find_article(self, posted_articles: List[str]) -> str:
        posted_articles_set = set(posted_articles)
        for page_index in range(self.MAX_ARTICLE_PAGES):
            ela_page = requests.get(f"{self.ELDER_LAW_ANSWERS_BASE_URL}/news-and-information?page=${page_index + 1}")
            parser = BeautifulSoup(ela_page.content, "html.parser")
            article_links = parser.select(".excerpt__title a")

            for article_link in article_links:
                article_text = article_link.get_text()
                if not self.is_article_qa(article_link) and article_text not in posted_articles_set:
                    return article_link.get("href")

        raise ScraperException(ScraperErrorCode.UNABLE_TO_FIND_ARTICLE.value)

    def post_article(self, relative_url: str):
        article_url = f"{self.ELDER_LAW_ANSWERS_BASE_URL}{relative_url}"
        article_response = requests.get(article_url)
        parser = BeautifulSoup(article_response.content, "html.parser")

        article_title = parser.select(".heading__title")[0].get_text()
        article_paragraphs = parser.select(".article")

        article_content = ""
        for article_paragraph in article_paragraphs:
            article_content += article_paragraph.decode_contents()

        post_endpoint = f"{self.HERNDON_LAW_BASE_URL}/wp-json/wp/v2/posts"
        post_data = {
            "title": article_title,
            "content": article_content,
            "status": "publish"
        }

        response = requests.post(post_endpoint, json=post_data,
                                 auth=requests.auth.HTTPBasicAuth(self.website_username, self.website_password))

        if response.status_code != 200:
            raise ScraperException(ScraperErrorCode.ARTICLE_POST_FAILED.value)
