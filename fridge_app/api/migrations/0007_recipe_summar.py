# Generated by Django 4.1.4 on 2022-12-27 02:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_recipe_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='summar',
            field=models.TextField(blank=True, default=True),
        ),
    ]