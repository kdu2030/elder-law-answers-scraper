# Generated by Django 4.2.13 on 2024-07-20 00:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('scraper_manager', '0008_userprofilepicture'),
    ]

    operations = [
        migrations.CreateModel(
            name='PostFailureLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_attempted', models.DateField()),
                ('error_code', models.IntegerField()),
                ('exception', models.TextField(blank=True)),
            ],
        ),
    ]
