import csv
import os
from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook

# Define default_args dictionary to specify the default parameters of the DAG
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2023, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Create the DAG
dag = DAG(
    'update_file_record',
    default_args=default_args,
    description='Read files from server path and write to PostgreSQL',
    schedule_interval=timedelta(days=1),
)


def read_file_and_update_db(**kwargs):
    # Path to the directory containing the files
    file_directory = 'postgres_conn_id'

    # Connect to the PostgreSQL database
    pg_hook = PostgresHook(postgres_conn_id='your_postgres_conn_id')
    conn = pg_hook.get_conn()
    cursor = conn.cursor()

    # Iterate through files in the directory
    for filename in os.listdir(file_directory):
        if filename.endswith('.csv'):  # Assuming CSV files, adjust as needed
            file_path = os.path.join(file_directory, filename)

            with open(file_path, 'r') as file:
                csv_reader = csv.reader(file)
                next(csv_reader)  # Skip header row if present

                for row in csv_reader:
                    # Assuming the CSV structure matches your table structure
                    # Adjust the SQL and values according to your specific needs
                    sql = """
                    INSERT INTO your_table_name (column1, column2, column3)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (id) DO UPDATE
                    SET column2 = EXCLUDED.column2,
                        column3 = EXCLUDED.column3;
                    """
                    cursor.execute(sql, row)

            conn.commit()
            print(f"Processed file: {filename}")

    cursor.close()
    conn.close()


# Define the PythonOperator
update_db_task = PythonOperator(
    task_id='update_db_from_files',
    python_callable=read_file_and_update_db,
    provide_context=True,
    dag=dag,
)

# Set task dependencies if you have multiple tasks
# update_db_task >> next_task
