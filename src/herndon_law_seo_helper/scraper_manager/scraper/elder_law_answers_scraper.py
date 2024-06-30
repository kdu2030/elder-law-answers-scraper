from playwright.sync_api import Playwright, Browser


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

        login_error = page.query_selector(".login-form .text-danger")

        # TODO: For testing purposes only, remove
        page.wait_for_event("close", timeout=0)
