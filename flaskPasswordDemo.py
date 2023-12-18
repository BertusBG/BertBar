from flask import Flask, render_template, request
from CocktailDbHandler import CocktailDbHandler

def index():
    if request.method == 'POST':
        password = request.form['password']
        db_handler = CocktailDbHandler(password)
        ingredients = db_handler.ReadIngredients()
        return render_template('index.html', ingredients=ingredients)
    return render_template('index.html', ingredients=None)
