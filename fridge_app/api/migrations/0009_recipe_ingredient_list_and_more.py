# Generated by Django 4.1.5 on 2023-01-13 01:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_alter_recipe_recipeid'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='ingredient_list',
            field=models.CharField(default=None, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='recipe',
            name='missing_ingredient_list',
            field=models.CharField(default=None, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='recipe',
            name='serving',
            field=models.IntegerField(default=None, null=True),
        ),
        migrations.AddField(
            model_name='recipe',
            name='time',
            field=models.IntegerField(default=None, null=True),
        ),
    ]
