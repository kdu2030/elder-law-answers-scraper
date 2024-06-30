from playwright.sync_api import Playwright, Browser
from enum import Enum


class ScraperErrorCode(Enum):
    UNKNOWN = 0
    LOGIN_FAILED = 1


class ScraperException(Exception):
    def __init__(self, error_code: ScraperErrorCode):
        self.error_code = error_code


class ElderLawAnswersScraper:
    ELDER_LAW_ANSWERS_BASE_URL = "https://attorney.elderlawanswers.com"

    def __init__(self, playwright: Playwright, username: str, password: str):
        self.browser: Browser = playwright.chromium.launch(headless=False)
        self.username = username
        self.password = password

    def sign_in(self):
        page = self.browser.new_page()
        page.goto(f"{self.ELDER_LAW_ANSWERS_BASE_URL}/login")

        username_input = page.query_selector("input#id")
        username_input.fill(self.username)

        password_input = page.query_selector("input#password")
        password_input.fill(self.password)

        button_input = page.query_selector("button[type='submit']")
        button_input.click()

        # Wait for error message to show up
        page.wait_for_timeout(20)

        login_error = page.query_selector(".login-form .text-danger")
        if login_error:
            raise ScraperException(ScraperErrorCode.LOGIN_FAILED.value)

        # # TODO: For testing purposes only, remove
        # page.wait_for_event("close", timeout=0)
