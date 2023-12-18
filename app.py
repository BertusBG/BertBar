from flask import Flask, render_template, request

app = Flask(__name__)

"""@app.route("/")
def home():
    import outputIngredients
    return outputIngredients.home()"""

@app.route('/', methods=['GET', 'POST'])
def index():
    import flaskPasswordDemo
    return flaskPasswordDemo.index()
