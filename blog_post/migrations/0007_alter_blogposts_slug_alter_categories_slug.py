# Generated by Django 4.0.4 on 2022-05-18 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog_post', '0006_alter_blogposts_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blogposts',
            name='slug',
            field=models.SlugField(blank=True, editable=False, max_length=350, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='categories',
            name='slug',
            field=models.SlugField(blank=True, editable=False, null=True, unique=True),
        ),
    ]