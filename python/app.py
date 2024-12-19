from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if False:
        import flaskPasswordDemo
        return flaskPasswordDemo.index()
    if False:
        import outputIngredients
        return outputIngredients.home()
    if True:
        import flaskHelloWorld
        return flaskHelloWorld.home()
    return "Nothing to see here"
