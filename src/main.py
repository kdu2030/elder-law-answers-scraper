from scraper.elder_law_answers_scraper import ElderLawAnswersScraper
from playwright.sync_api import sync_playwright


def main():
    with sync_playwright() as playwright:
        scraper = ElderLawAnswersScraper(playwright, "test", "test")
        scraper.sign_in()


if __name__ == "__main__":
    main()
