# Generated by Django 5.0 on 2024-01-02 08:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('memo_pads_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='memopads',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='memo_images/'),
        ),
    ]
