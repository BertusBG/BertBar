from supabase import create_client, Client


class SupabaseDbHandler:
    def __init__(self, supabase_url: str, supabase_key: str):
        """
        Initialize the CocktailDbHandler with Supabase credentials.
        :param supabase_url: Supabase project URL
        :param supabase_key: Supabase API key
        """
        self.supabase: Client = create_client(supabase_url, supabase_key)

    def ReadCocktailNames(self):
        """
        Fetch all cocktails from the database.
        :return: List of cocktails
        """
        response = self.supabase.table('cocktails').select('*').execute()
        return response.data

    def get_cocktail_by_id(self, cocktail_id: int):
        """
        Fetch a single cocktail by its ID.
        :param cocktail_id: ID of the cocktail
        :return: Cocktail details
        """
        response = self.supabase.table('cocktails').select('*').eq('id', cocktail_id).execute()
        return response.data[0] if response.data else None

    def add_cocktail(self, name: str, description: str):
        """
        Add a new cocktail to the database.
        :param name: Name of the cocktail
        :param description: Description of the cocktail
        :return: Inserted cocktail record
        """
        response = self.supabase.table('cocktails').insert({
            'name': name,
            'description': description
        }).execute()
        return response.data

    def add_cocktail_with_ingredients(self, name: str, id: int, ingredient_names: list):
        """
        Add a new cocktail to the database and link it to its ingredients.
        :param name: Name of the cocktail
        :param ingredient_names: List of ingredient names
        :return: Inserted cocktail record with linked ingredients
        """
        # Add the cocktail to the "cocktails" table
        if True:
            cocktail_response = self.supabase.table('cocktails').insert({'name': name, 'id': id}).execute()

            # Get the ID of the newly inserted cocktail
            cocktail_id = cocktail_response.data[0]['id']
            print(f'Added "{name}" to cocktails with id {id}')
        else:
            cocktail_id = id

        # Fetch IDs of the ingredients by name
        ingredient_ids = []
        for ingredient_name in ingredient_names:
            ingredient_response = self.supabase.table('ingredients').select('id').eq('name', ingredient_name).execute()
            #if ingredient_response.get('error'):
            #    raise Exception(f"Error fetching ingredient '{ingredient_name}': {ingredient_response['error'].get('message')}")

            if ingredient_response.data:
                # If the ingredient exists, get its ID
                ingredient_ids.append(ingredient_response.data[0]['id'])
            else:
                print('Foo')
                # If the ingredient does not exist, create it
                new_ingredient_response = self.supabase.table('ingredients').insert({'name': ingredient_name}).execute()
                #if new_ingredient_response.get('error'):
                #    raise Exception(f"Error adding new ingredient '{ingredient_name}': {new_ingredient_response['error'].get('message')}")

                ingredient_ids.append(new_ingredient_response['data'][0]['id'])
        print(f'Ingredient IDs: {ingredient_ids}')

        # Add entries to the "cocktail_ingredients" table
        cocktail_ingredient_entries = [{'cocktail_id': cocktail_id, 'ingredient_id': ingredient_id} for ingredient_id in ingredient_ids]
        cocktail_ingredients_response = self.supabase.table('cocktail_ingredients').insert(cocktail_ingredient_entries).execute()


    def update_cocktail(self, cocktail_id: int, name: str = None, description: str = None):
        """
        Update an existing cocktail's details.
        :param cocktail_id: ID of the cocktail to update
        :param name: New name of the cocktail (optional)
        :param description: New description of the cocktail (optional)
        :return: Updated cocktail record
        """
        update_data = {}
        if name:
            update_data['name'] = name
        if description:
            update_data['description'] = description

        response = self.supabase.table('cocktails').update(update_data).eq('id', cocktail_id).execute()
        return response.data

    def delete_cocktail(self, cocktail_id: int):
        """
        Delete a cocktail from the database.
        :param cocktail_id: ID of the cocktail to delete
        :return: Deletion result
        """
        response = self.supabase.table('cocktails').delete().eq('id', cocktail_id).execute()
        return response.data

    def get_all_ingredients(self):
        """
        Fetch all ingredients from the database.
        :return: List of ingredients
        """
        response = self.supabase.table('ingredients').select('*').execute()
        return response.data

    def mark_ingredient_available(self, ingredient_id: int, is_available: bool):
        """
        Update the availability of an ingredient.
        :param ingredient_id: ID of the ingredient to update
        :param is_available: Availability status (True or False)
        :return: Updated ingredient record
        """
        response = self.supabase.table('ingredients').update({
            'is_available': is_available
        }).eq('id', ingredient_id).execute()
        return response.data

    def add_ingredient(self, name: str):
        """
        Add a new ingredient to the database.
        :param name: Name of the ingredient
        :return: Inserted ingredient record
        """
        response = self.supabase.table('ingredients').insert({
            'name': name
        }).execute()
        return response.data

if __name__ == '__main__':
    print('Testing supabase DB')

    supabase_url = 'https://agjfltsqnqnyfcepgpmh.supabase.co'
    public_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnamZsdHNxbnFueWZjZXBncG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzA4NDQsImV4cCI6MjA1MDIwNjg0NH0.52LC3seAiNCWGw7YxzK0LNMvR0LKQsMlN39aDVQ8Kb0'
    secret_key = ''
    supabase_key = secret_key
    supabase_db = 'BertBar'
    db = SupabaseDbHandler(supabase_url, supabase_key)

    if False:
        ingredients = db.get_all_ingredients()
        print(ingredients[0])
        cocktails = db.ReadCocktailNames()
        print(cocktails[0])
        cocktail5 = db.get_cocktail_by_id(5)
        print(cocktails[5])

    foo = db.add_cocktail_with_ingredients('Daiquiri', 9, ['White Rum', 'Lime juice'])
    print(foo)
