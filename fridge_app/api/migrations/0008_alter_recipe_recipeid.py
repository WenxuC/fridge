# Generated by Django 4.1.5 on 2023-01-07 22:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_recipe_recipeid_alter_recipe_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='recipeID',
            field=models.CharField(max_length=50),
        ),
    ]
