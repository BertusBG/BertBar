import psycopg2
import encodePassword

class CocktailDbHandler:

    def __init__(self, userPassword = '', debug = False):
        self._debug = debug
        self.Connect(userPassword)

    ################################################################################

    def _runQuery(self, query, values = []):
        if not values:
            if self._debug:
                print(query)
            self.cursor.execute(query)
        else:
            if self._debug:
                print(query % values)
            self.cursor.execute(query, values)

    ################################################################################

    def Connect(self, userPassword):

        storedKey = '008a6e66942e354ef5c0537a6e50409def3bf050977b2f8b5a48d9ede5775576'
        dbPassword = encodePassword.GetDatabasePassword(storedKey, userPassword)

        self.connection = psycopg2.connect(
            dbname = 'bcek7024xjmbfdmkdatx',
            user = 'uesgqlgplgrroioppty0',
            password = dbPassword,
            host = 'bcek7024xjmbfdmkdatx-postgresql.services.clever-cloud.com',
            port = '50013'
        )

        # Create a cursor object to interact with the database
        self.cursor = self.connection.cursor()

    ################################################################################

    def Disconnect(self):
        self.connection.commit()
        self.cursor.close()
        self.connection.close()

    ################################################################################

    def Reconnect(self):
        print('Reconnecting...')
        self.Disconnect()
        self.Connect()

    ################################################################################

    def ReadIngredients(self):
        self._runQuery("SELECT * FROM ingredients ORDER BY name")
        dbIngredients = self.cursor.fetchall()
        return [ingredient [1:3] for ingredient in dbIngredients]

    ################################################################################

    def AddIngredients(self, ingredients):
        print('Adding ingredients to DB')
        query = "INSERT INTO ingredients (name, available) VALUES (%s, %s);"
        for (name, available) in ingredients:
            values = (name, available)
            self._runQuery(query, values)
        print('Done')

    ################################################################################

    def ReadCocktailNames(self):
        self._runQuery("SELECT name FROM cocktails ORDER BY name")
        cocktails = self.cursor.fetchall()
        return [cocktail[0] for cocktail in cocktails]

    ################################################################################

    def GetIngredientId(self, name):
        try:
            sqlName = str(name).replace("'", "''")
            self._runQuery(f"SELECT id FROM ingredients where name = '{sqlName}'")
            return self.cursor.fetchall()[0][0]
        except:
            print('Failed to get ID for', name)
            self.Reconnect()
            return -1

    ################################################################################

    def ReadCocktailIngredientsByName(self):
        self._runQuery("SELECT * FROM cocktail_ingredients_view ORDER BY cocktail_name")
        entries = self.cursor.fetchall()
        return entries

    ################################################################################

    def RenameIngredient(self, oldName, newName):
        query = f"Update ingredients SET name = '{newName}' WHERE name = '{oldName}'"
        self._runQuery(query)

    ################################################################################

    def GetIngredientIdWhere(self, condition):
        try:
            self._runQuery(f"SELECT id FROM ingredients WHERE {condition}")
            return self.cursor.fetchall()[0][0]
        except:
            print('Failed to get ID where', condition)
            self.Reconnect()
            return -1

    ################################################################################

    def DeleteIngredientWhere(self, condition):
        query = f"DELETE FROM ingredients WHERE {condition}"
        self._runQuery(query)

    ################################################################################

    def AddCocktail(self, cocktailName, ingredientList):
        # Get the cocktail ID
        cocktailId = self.__getId('cocktails', cocktailName)

        # If the cocktail doesn't exist
        if cocktailId < 0: # TODO
            # Insert the cocktail and get its ID
            cocktailQuery = "INSERT INTO cocktails (name) VALUES ('%s')" % cocktailName
            self._runQuery(cocktailQuery)
            cocktailId = self.__getId('cocktails', cocktailName)

        print(cocktailName, cocktailId)

        ingredientList.reverse()

        # For each ingredient
        for ingr in ingredientList:
            # Get the ingredient ID
            ingrId = self.__getId('ingredients', ingr)
            print('')
            print(ingr, ingrId)

            # TODO Select everything that matches the condition
            checkExistsQuery = F'SELECT * FROM cocktail_ingredients WHERE (cocktail_id = {cocktailId} AND ingredient_id = {ingrId})'
            self._runQuery(checkExistsQuery)
            existingEntries = self.cursor.fetchall()

            if not existingEntries:
                # Insert the ingredient entry TODO if its not thre yet
                ingrQuery = f"INSERT INTO cocktail_ingredients (cocktail_id, ingredient_id) VALUES ({cocktailId}, {ingrId})"
                try:
                    self._runQuery(ingrQuery)
                    self.connection.commit()
                except:
                    print(f'Failed to insert {ingr} into recipe for {cocktailName}')
                    self.Reconnect()

    ################################################################################

    def __getIdWhere(self, table, condition):
        try:
            self._runQuery(f"SELECT id FROM {table} where {condition}")
            return self.cursor.fetchall()[0][0]
        except:
            print(f'Failed to find id in {table} where {condition}')
            self.Reconnect()
            return -1

    ################################################################################

    def __getId(self, table, name):
        try:
            sqlName = str(name).replace("'", "''")
            self._runQuery(f"SELECT id FROM {table} where lower(name) = lower('{sqlName}')")
            return self.cursor.fetchall()[0][0]
        except:
            print(f'Failed to get ID from {table} for', name)
            self.Reconnect()
            return -1
