def home():
    import CocktailDbHandler
    db = CocktailDbHandler.CocktailDbHandler()

    output = ""

    ingredients = db.ReadIngredients()
    output += '---------------<br>\n'
    output += 'INGREDIENTS: %d<br>\n' % len(ingredients)
    output += '---------------<br>\n'
    for (ingr,avail) in ingredients:
        output += '%-20s | %s<br>\n' % ( ingr, avail )

    db.Disconnect()

    return output
