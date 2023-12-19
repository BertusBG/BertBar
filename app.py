from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    # TODO Import OS if I want to run it like this
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
