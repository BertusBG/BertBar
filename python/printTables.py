import sys
import CocktailDbHandler

db = CocktailDbHandler.CocktailDbHandler()

# Print all ingredients in DB
ingredients = db.ReadIngredients()
print('---------------')
print('INGREDIENTS: %d' % len(ingredients))
print('---------------')
for (ingr,avail) in ingredients:
    print('%-20s | %s' % ( ingr, avail ))

# Print all cocktails in DB
print('')
cocktailNames = db.ReadCocktailNames()
print('-------------')
print('COCKTAILS: %d' % len(cocktailNames))
print('-------------')
for name in cocktailNames:
    print(name)


# Print all recipes in DB
cocktailIngredients = db.ReadCocktailIngredientsByName()

cocktailSet = set([cocktail for (cocktail, ingredient) in cocktailIngredients])
print('')
print('-------------')
print('RECIPES: %d' % len(cocktailSet))
sys.stdout.write('-------------')

currentCocktail = ''
for (cocktail, ingredient) in cocktailIngredients:
    if not cocktail == currentCocktail:
        currentCocktail = cocktail
        sys.stdout.write('\n%s\n\t' % cocktail)
    else:
        sys.stdout.write(', ')
    sys.stdout.write(ingredient)
sys.stdout.write('\n')

db.Disconnect()
