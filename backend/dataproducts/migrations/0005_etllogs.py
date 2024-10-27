# Generated by Django 4.2.6 on 2024-10-26 12:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dataproducts', '0004_alter_lulindataproduct_file_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='ETLLogs',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('observatory', models.CharField(choices=[(1, 'Lulin')], max_length=50)),
                ('success', models.BooleanField(default=False)),
                ('file_processed', models.IntegerField(default=0)),
                ('row_processed', models.IntegerField(default=0)),
                ('error_message', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'ETLLogs',
            },
        ),
    ]
