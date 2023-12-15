from flask import Flask, render_template
import psycopg2

app = Flask(__name__)


# Replace these placeholders with your actual CleverCloud PostgreSQL connection details
db_params = {
    'host': 'bcek7024xjmbfdmkdatx-postgresql.services.clever-cloud.com',
    'port': '50013',
    'database': 'bcek7024xjmbfdmkdatx',
    'user': 'uesgqlgplgrroioppty0',
    'password': 'nH37JyLzlbZvN2vigYYBDwEBAOYCOe'
}

def get_db_connection():
    return psycopg2.connect(**db_params)

@app.route('/')
def index():
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute('SELECT * FROM SELECT * FROM ingredients ORDER BY name;')
    users = cursor.fetchall()

    cursor.close()
    connection.close()

    return render_template('index.html', users=users)

if __name__ == '__main__':
    app.run(debug=True)
