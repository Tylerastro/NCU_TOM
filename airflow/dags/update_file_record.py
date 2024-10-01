import os
from datetime import datetime
from pathlib import Path

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.providers.postgres.operators.postgres import PostgresOperator

# Constants
DAG_ID = "csv_processing_dag"
POSTGRES_CONN_ID = "postgres_default"
# Update this to your CSS folder path
CSS_FOLDER_PATH = "./"


def process_css_files():
    css_files = [f for f in os.listdir(CSS_FOLDER_PATH) if f.endswith('.csv')]
    postgres_hook = PostgresHook(postgres_conn_id=POSTGRES_CONN_ID)

    for css_file in css_files:
        file_path = os.path.join(CSS_FOLDER_PATH, css_file)
        with open(file_path, 'r') as file:
            content = file.read()

        # Insert the CSS file content into the database
        postgres_hook.run(
            "INSERT INTO css_files (filename, content, created_at) VALUES (%s, %s, %s)",
            parameters=(css_file, content, datetime.now())
        )

    return f"Processed {len(css_files)} CSS files"


with DAG(
    dag_id=DAG_ID,
    start_date=datetime(2020, 2, 2),
    schedule_interval="@daily",
    catchup=False,
) as dag:

    create_css_files_table = PostgresOperator(
        task_id="create_css_files_table",
        postgres_conn_id=POSTGRES_CONN_ID,
        sql="""
            CREATE TABLE IF NOT EXISTS css_files (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL
            );
        """
    )

    process_css = PythonOperator(
        task_id="process_css_files",
        python_callable=process_css_files
    )

    create_css_files_table >> process_css
