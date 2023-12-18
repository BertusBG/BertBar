import csv
import os
import CocktailDbHandler

def Main(db):
    # Read the cocktail names and abbreviated ingredient lists from the CSV
    abbrevRecipes = ReadCsv('cocktails.csv', False)
    glossary = ReadCsv('glossary.csv', False)

    # Read the list of cocktails from the DB
    dbCocktailNames = db.ReadCocktailNames()
    #print(dbCocktailNames)

    # Make sure all the DB cocktails are in the CSV
    #ConfirmDbCocktailsInCsv(dbCocktailNames, abbrevRecipes)

    expandedStrings = []

    n = 0
    # For each cocktail
    for row in abbrevRecipes:
        n += 1
        cocktailName = row[0]
        abbrevIngrString = row[1]

        # If it's already in the DB, skip it
        if cocktailName in dbCocktailNames:
            continue

        # Expand the list of abbreviations
        ingredients = GetExpandedIngredients(glossary, abbrevIngrString)

        # Get the ingredient IDs
        # TODO Handle missing ingredients and Peychaud's
        ids = [db.GetIngredientId(ingr) for ingr in ingredients]
        idString = " ".join([str(id) for id in ids])

        ingrString = ", ".join(ingredients)
        print(f'{n}. {cocktailName} [{abbrevIngrString}]: {ingrString} ({idString})')


################################################################################

def ReadCsv(csvName, skipHeader = True):
    data = []
    # Read the CSV file
    with open(csvName, newline='') as csvfile:
        csvreader = csv.reader(csvfile)
        if skipHeader:
            # Skip the header row (if it exists)
            header = next(csvreader, None)

        # Iterate through each row in the CSV file
        for row in csvreader:
            data.append(row)
    return data

################################################################################

def ConfirmDbCocktailsInCsv(dbCocktailNames, abbrevRecipes):
    for dbName in dbCocktailNames:
        searchRes = [row[1] for row in abbrevRecipes if row[0] == dbName]
        if not searchRes:
            print(f'WARNING: {dbName} from DB not found in CSV!')

################################################################################

def LookupInGlossary(glossary, abbrev):
    matches = [row[1] for row in glossary if row[0] == abbrev]
    if matches:
        return matches[0]
    else:
        return []

################################################################################

def GetExpandedIngredients(glossary, abbrevIngrString):
    abbrevIngrs = abbrevIngrString.split()
    ingrs = [LookupInGlossary(glossary, abbrev) for abbrev in abbrevIngrs]

    emptyIngrs = [ingr for ingr in ingrs if not ingr]
    assert(not emptyIngrs)

    return ingrs

################################################################################

if __name__ == '__main__':
    os.system('cls')
    db = CocktailDbHandler.CocktailDbHandler()
    Main(db)
    db.Disconnect()
