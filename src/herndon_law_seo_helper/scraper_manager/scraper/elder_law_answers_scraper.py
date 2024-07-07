import requests
from requests.auth import HTTPBasicAuth


class ElderLawAnswersScraper:
    HERNDON_LAW_BASE_URL = "https://www.herndonlawva.com"
    ELDER_LAW_ANSWERS_BASE_URL = "https://attorney.elderlawanswers.com"

    def __init__(self, website_username: str, website_password: str):
        self.website_username = website_username
        self.website_password = website_password

    def post_article(self):
        post_endpoint = f"{self.HERNDON_LAW_BASE_URL}/wp-json/wp/v2/posts"
        post_data = {
            "title": "Test Post",
            "content": "<h1>This is a test</h1>",
            "status": "publish"
        }

        response = requests.post(post_endpoint, json=post_data,
                                 auth=HTTPBasicAuth(self.website_username, self.website_password))
        print(response.json())