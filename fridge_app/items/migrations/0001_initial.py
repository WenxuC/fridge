# Generated by Django 4.1.4 on 2022-12-14 23:39

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Items',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.CharField(max_length=50)),
                ('name', models.CharField(max_length=100)),
                ('expiration', models.DateField()),
            ],
        ),
    ]