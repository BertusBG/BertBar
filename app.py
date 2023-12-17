from flask import Flask
import CocktailDbHandler

app = Flask(__name__)

@app.route("/")
def home():
    # TODO Input password
    db = CocktailDbHandler.CocktailDbHandler()

    print('Huh?')

    output = ""

    ingredients = db.ReadIngredients()
    output += '---------------<br>\n'
    output += 'INGREDIENTS: %d<br>\n' % len(ingredients)
    output += '---------------<br>\n'
    for (ingr,avail) in ingredients:
        output += '%-20s | %s<br>\n' % ( ingr, avail )

    db.Disconnect()

    return output
