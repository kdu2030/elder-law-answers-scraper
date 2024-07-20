from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from datetime import datetime
from ..models.blog_posts import BlogPost, PostFailureLog
from dateutil.relativedelta import relativedelta
from ..scraper.elder_law_answers_scraper import ScraperErrorCode


def get_blog_post_attempts():
    current_date = datetime.now()
    current_month = current_date.month
    current_year = current_date.year

    start_date = datetime(year=current_year, month=current_month, day=1)
    end_date = start_date + relativedelta(months=1)

    successful_posts = BlogPost.objects.filter(
        date_posted__range=(start_date, end_date))

    failure_posts = PostFailureLog.objects.filter(
        date_attempted__range=(start_date, end_date)
    )

    attempt_table_data = []

    for successful_post in successful_posts:
        attempt_table_data.append({
            "date_attempted": successful_post.date_posted,
            "status": "Success",
            "status_metadata": successful_post.post_title
        })

    # TODO: Handle Failure Reason Formatting
    for failure_post in failure_posts:
        attempt_table_data.append({
            "date_attempted": failure_post.date_attempted,
            "status": "Warning" if failure_post.error_code == ScraperErrorCode.UNABLE_TO_FIND_ARTICLE.value else "Failure",
            "status_metadata": "Test"
        })

    # TODO: Sort by Date attempted
    return attempt_table_data


def dashboard_get(request: HttpRequest) -> HttpResponse:
    print(get_blog_post_attempts())

    return render(request, "scraper_manager/dashboard.html")
