import csv
import os
import CocktailDbHandler

# TODO Input password
db = CocktailDbHandler.CocktailDbHandler("", debug=True)

# Add Espresso - Done
#db.AddIngredients([('Espresso','True')])

# Add Saline - Done
#db.AddIngredients([('Saline','True')])

# TODO Delete Curacao
#name = 'Cura├ºao'
#condition = "starts_with(name, 'Cura')"
#crcId = db.GetIngredientIdWhere(condition)
#print(crcId)
#db.DeleteIngredientWhere(condition)

# Test adding cocktails and ingredients
#db.AddCocktail('Whiskey Sour', ['Whisky', 'Lemon Juice'])
#print('-------------------------------------------------------')
#db.AddCocktail('Amangocano', ['Mango juice', 'Campari', 'Soda Water'])
#print('-------------------------------------------------------')
#db.AddCocktail('Negroni', ['Gin', 'Campari', 'Red Vermouth'])

# Add Raspberry Liqueur
db.AddIngredients([('Raspberry Liqueur','False')])

db.Disconnect()
