# Generated by Django 2.1.7 on 2019-02-21 16:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('modelchimp', '0046_experimentasset'),
    ]

    operations = [
        migrations.AlterField(
            model_name='experimentasset',
            name='ml_model',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='asset_experiment', to='modelchimp.MachineLearningModel'),
        ),
        migrations.AlterField(
            model_name='experimentasset',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='asset_project', to='modelchimp.Project'),
        ),
    ]