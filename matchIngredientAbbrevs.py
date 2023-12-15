import csv
import os
import re
import Common
import CocktailDatabase

def Main():
    os.system('cls')

    (connection, cursor) = CocktailDatabase.ConnectToDb()

    dbIngredients = CocktailDatabase.ReadIngredientsFromDb(cursor)
    #Common.PrintList('Ingredients from DB', dbIngredients)

    abbrevIngredients = ReadAbbrevIngredientsFromCsv('cocktails.csv')
    #Common.PrintList('Ingredient abbreviations from CSV', abbrevIngredients)

    if False:
        for abbrev in abbrevIngredients:
            print(f'{abbrev}:')
            for (fullname,available) in dbIngredients:
                if IsValidAbbreviation(fullname, abbrev):
                    print(f'\t{fullname}')

    """
    TODO:
        If an abbreviation matches exactly one full name, associate them
        If a full name matches exactly one abbreviation, associate them
        List the remaining unassociated values
    """

    (abbrevIdxForIngreds, ingredIdxForAbbrevs) = AssociateIngredsAndAbbrevs(dbIngredients, abbrevIngredients)

    with open('glossary.csv', 'w') as fOut:
        for n in range(len(abbrevIngredients)):
            iIng = ingredIdxForAbbrevs[n]
            fOut.write(abbrevIngredients[n])
            if iIng >= 0:
                fOut.write(f',{dbIngredients[iIng][0]}')
            fOut.write('\n')
    
    with open('allIngredients.csv', 'w') as fOut:
        fOut.write('\n'.join([name for (name, av) in dbIngredients]))

    CocktailDatabase.DisconnectFromDb(connection, cursor)

################################################################################

def ReadAbbrevIngredientsFromCsv(csvName):
    abbrevs = set()

    with open(csvName, 'r') as file:
        reader = csv.reader(file)

        for row in reader:
            ingredientAbbrevs = row[1].split()
            for abbr in ingredientAbbrevs:
                # Remove non-alphanumeric characters
                abbrevs.add(''.join(char for char in abbr if char.isalnum()))
                #abbrevs.add(re.sub(r'\W+', '', abbr))

    abbrevList = list(abbrevs)
    abbrevList.sort()
    return abbrevList

################################################################################

def IsValidAbbreviation(fullName, abbrev):
    string_index = 0
    subset_index = 0

    while string_index < len(fullName) and subset_index < len(abbrev):
        if fullName[string_index] == abbrev[subset_index]:
            subset_index += 1
        string_index += 1

    return subset_index == len(abbrev)

################################################################################

def AssociateIngredsAndAbbrevs(ingredients, abbrevs):
    ingrNames = [name for (name,available) in ingredients]

    # Initialise both arrays to all unassociated (-1)
    abbrevIdxForIngreds = [-1] * len(ingrNames)
    ingredIdxForAbbrevs = [-1] * len(abbrevs)

    # First pass: associate unique ingredients with abbreviations
    if True:
        for iAbbr in range(len(abbrevs)):
            abbr = abbrevs[iAbbr]
            # List all the ingredients for which this abbreviation is a match
            possibleIngredients = [n for n in range(len(ingrNames)) if IsValidAbbreviation(ingrNames[n],abbr)]
            if len(possibleIngredients) == 1:
                iIngr = possibleIngredients[0]
                ingredIdxForAbbrevs[iAbbr] = iIngr
                abbrevIdxForIngreds[iIngr] = iAbbr
    
    # Second pass: associate unique abbreviations with ingredients
    if True:
        for iIngr in range(len(ingrNames)):
            if abbrevIdxForIngreds[iIngr] >= 0:
                continue
            ingr = ingrNames[iIngr]
            # List all the abbreviations for which this ingredient is a match
            possibleAbbrevs = [iAbbr for iAbbr in range(len(abbrevs)) 
                               if ingredIdxForAbbrevs[iAbbr] < 0 and IsValidAbbreviation(ingr,abbrevs[iAbbr])]
            if len(possibleAbbrevs) == 1:
                iAbbr = possibleAbbrevs[0]
                ingredIdxForAbbrevs[iAbbr] = iIngr
                abbrevIdxForIngreds[iIngr] = iAbbr
    
    return (abbrevIdxForIngreds, ingredIdxForAbbrevs)

################################################################################

if __name__ == '__main__':
    Main()