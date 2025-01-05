import csv
import os
import SupabaseDbHandler

def Main(db):
    # Read the cocktail names and abbreviated ingredient lists from the CSV
    abbrevRecipes = ReadCsv('cocktails_2025-01-05.csv', True)
    glossary = ReadCsv('glossary.csv', False)

    # Read the list of cocktails from the DB
    dbCocktails = db.ReadCocktailNames()
    lastId = dbCocktails[-1]['id']
    print('last ID =', lastId)
    dbCocktailNames = [c['name'] for c in dbCocktails]
    for c in dbCocktailNames:
        print(c)
    print('')

    # Make sure all the DB cocktails are in the CSV
    #ConfirmDbCocktailsInCsv(dbCocktailNames, abbrevRecipes)

    expandedStrings = []

    n = lastId
    # For each cocktail
    for row in abbrevRecipes:
        cocktailName = row[0]
        abbrevIngrString = row[1]

        # If it's already in the DB, skip it
        if cocktailName in dbCocktailNames:
            continue
        n += 1

        #print('Looking up', abbrevIngrString)
        # Expand the list of abbreviations
        ingredients = GetExpandedIngredients(glossary, abbrevIngrString)

        # Get the ingredient IDs
        # TODO Handle missing ingredients and Peychaud's
        ids = []# TODO [db.GetIngredientId(ingr) for ingr in ingredients]
        idString = " ".join([str(id) for id in ids])

        ingrString = ", ".join(ingredients)
        print(f'{n}. {cocktailName} [{abbrevIngrString}]: {ingrString} ({idString})')
        print(ingredients)
        db.add_cocktail_with_ingredients(cocktailName, n, ingredients)
        print(f'Added {cocktailName} to DB')


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
    #print(f'Looking up {abbrev} in glossary')
    matches = [row[1] for row in glossary if row[0] == abbrev]
    if matches:
        return matches[0]
    else:
        print('ERROR:', abbrev, 'not found in glossary')
        return []

################################################################################

def GetExpandedIngredients(glossary, abbrevIngrString):
    abbrevIngrs = abbrevIngrString.split()
    #print('Abbreviated ingredients:', abbrevIngrs)
    ingrs = [LookupInGlossary(glossary, abbrev) for abbrev in abbrevIngrs]

    emptyIngrs = [ingr for ingr in ingrs if not ingr]
    # TODO assert(not emptyIngrs)

    return ingrs

################################################################################

if __name__ == '__main__':
    os.system('cls')

    supabase_url = 'https://agjfltsqnqnyfcepgpmh.supabase.co'
    public_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnamZsdHNxbnFueWZjZXBncG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzA4NDQsImV4cCI6MjA1MDIwNjg0NH0.52LC3seAiNCWGw7YxzK0LNMvR0LKQsMlN39aDVQ8Kb0'
    secret_key = ''
    supabase_key = secret_key
    supabase_db = 'BertBar'
    db = SupabaseDbHandler.SupabaseDbHandler(supabase_url, supabase_key)
    Main(db)
    #db.Disconnect()
