from playwright.sync_api import Playwright, Browser
from enum import Enum
from typing import List


class ScraperErrorCode(Enum):
    UNKNOWN = 0
    LOGIN_FAILED = 1
    UNABLE_TO_FIND_ARTICLE = 2


class ScraperException(Exception):
    def __init__(self, error_code: ScraperErrorCode):
        self.error_code = error_code


class OldElderLawAnswersScraper:
    ELDER_LAW_ANSWERS_BASE_URL = "https://attorney.elderlawanswers.com"
    MAX_ARTICLE_PAGES = 20

    def __init__(self, playwright: Playwright, username: str, password: str):
        self.browser: Browser = playwright.firefox.launch(headless=True)
        self.username = username
        self.password = password

    def sign_in(self):
        self.page = self.browser.new_page()
        self.page.goto(f"{self.ELDER_LAW_ANSWERS_BASE_URL}/login")

        username_input = self.page.query_selector("input#id")
        username_input.fill(self.username)

        password_input = self.page.query_selector("input#password")
        password_input.fill(self.password)

        button_input = self.page.query_selector("button[type='submit']")
        button_input.click()

        # Wait for error message to show up
        self.page.wait_for_timeout(20)

        login_error = self.page.query_selector(".login-form .text-danger")
        if login_error:
            raise ScraperException(ScraperErrorCode.LOGIN_FAILED.value)

    def find_article(self, posted_articles: List[str]):
        posted_articles_set = set(posted_articles)

        for page_index in range(self.MAX_ARTICLE_PAGES):
            self.page.goto(
                f"{self.ELDER_LAW_ANSWERS_BASE_URL}/content-hub?org=ELA&page={page_index + 1}")

            article_elements = self.page.query_selector_all(
                ".article-listings article h2 a")

            for article_element in article_elements:
                if article_element.inner_text() not in posted_articles_set:
                    # article element href is a relative url, already prefixed with /
                    return f"{self.ELDER_LAW_ANSWERS_BASE_URL}{article_element.get_attribute('href')}"

        raise ScraperException(ScraperErrorCode.UNABLE_TO_FIND_ARTICLE.value)

    def post_article(self, article_link: str):
        self.page.goto(article_link)

        article_body = self.page.query_selector(".article")
        article_body.click()

        self.page.evaluate("() => window.scrollTo(0, 0)")

        wordpress_button = self.page.query_selector("a.js-share-wordpress")
        wordpress_button.click()

        article_title = self.page.query_selector("h1.title")
        return article_title.inner_text()
