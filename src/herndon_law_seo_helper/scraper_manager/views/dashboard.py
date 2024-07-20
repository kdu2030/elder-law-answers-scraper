from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from datetime import datetime
from ..models.blog_posts import BlogPost, PostFailureLog
from dateutil.relativedelta import relativedelta
from ..scraper.elder_law_answers_scraper import ScraperErrorCode


class MonthData:
    def __init__(self, month_label: str, succcess_count: int, warning_count: int, failure_count: int):
        self.success_count = succcess_count
        self.warning_count = warning_count
        self.failure_count = failure_count


def get_attempt_data_for_month(start_date: datetime):
    end_date = start_date + relativedelta(months=1) - relativedelta(day=1)
    success_count = BlogPost.objects.filter(
        date_posted__range=(start_date, end_date)).count()
    warning_count = PostFailureLog.objects.filter(
        error_code=ScraperErrorCode.UNABLE_TO_FIND_ARTICLE.value, date_attempted__range=(start_date, end_date)).count()
    failure_count = PostFailureLog.objects.filter(
        date_attempted__range=(start_date, end_date)).exclude(error_code=ScraperErrorCode.UNABLE_TO_FIND_ARTICLE.value).count()

    month_label = start_date.strftime("%B")
    return MonthData(month_label, success_count, warning_count, failure_count)


def get_chart_data(current_month: int, current_year: int):
    current_month_start = datetime(
        year=current_year, month=current_month, day=1)

    month_start_dates = [current_month_start]
    months_to_add = 4

    for i in range(0, months_to_add):
        new_month = current_month_start - relativedelta(months=(i + 1))
        month_start_dates.insert(0, new_month)

    month_data = list(map(lambda start_date: get_attempt_data_for_month(
        start_date), month_start_dates))

    chart_data = {
        "month_labels": [],
        "success_count": [],
        "warning_count": [],
        "failure_count": []
    }


def format_status_info(error_code: ScraperErrorCode):
    if error_code == ScraperErrorCode.LOGIN_FAILED.value:
        return "Website login failed"
    if error_code == ScraperErrorCode.ARTICLE_POST_FAILED.value:
        return "An article was found, but was unable to be posted to the website."
    if error_code == ScraperErrorCode.UNABLE_TO_FIND_ARTICLE.value:
        return "Unable to find new article"
    return "An unknown error occured"


def get_blog_post_attempts(current_month: int, current_year: int):
    start_date = datetime(year=current_year, month=current_month, day=1)
    end_date = start_date + relativedelta(months=1) - relativedelta(day=1)

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
            "status_info": successful_post.post_title
        })

    for failure_post in failure_posts:
        attempt_table_data.append({
            "date_attempted": failure_post.date_attempted,
            "status": "Warning" if failure_post.error_code == ScraperErrorCode.UNABLE_TO_FIND_ARTICLE.value else "Failure",
            "status_info": format_status_info(failure_post.error_code)
        })

    attempt_table_data.sort(
        key=lambda row: row["date_attempted"], reverse=True)

    return attempt_table_data


def dashboard_get(request: HttpRequest) -> HttpResponse:
    current_date = datetime.now()
    current_month = current_date.month
    current_year = current_date.year

    post_attempt_rows = get_blog_post_attempts(current_month, current_year)
    get_chart_data(current_month, current_year)
    return render(request, "scraper_manager/dashboard.html", {"attempt_rows": post_attempt_rows})
