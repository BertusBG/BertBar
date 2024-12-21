// Initialize Supabase client
const SUPABASE_URL = 'https://agjfltsqnqnyfcepgpmh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnamZsdHNxbnFueWZjZXBncG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzA4NDQsImV4cCI6MjA1MDIwNjg0NH0.52LC3seAiNCWGw7YxzK0LNMvR0LKQsMlN39aDVQ8Kb0';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetches all rows from a given table with optional filters.
 * @param {string} tableName - The name of the table to query.
 * @param {object} [filters] - Filters to apply to the query.
 * @returns {Promise<Array>} - The fetched data or an empty array if an error occurs.
 */
async function fetchTableData(tableName, filters = {}) {
    const query = supabaseClient.from(tableName).select();
    Object.entries(filters).forEach(([key, value]) => {
        query.eq(key, value);
    });

    const { data, error } = await query;
    if (error) {
        console.error(`Error fetching data from ${tableName}:`, error);
        return [];
    }
    return data;
}

/**
 * Fetches all cocktails.
 * @returns {Promise<Array>} - A list of cocktails.
 */
async function fetchCocktails() {
    return fetchTableData('cocktails');
}

/**
 * Fetches ingredient IDs for a given cocktail ID.
 * @param {number} cocktailId - The ID of the cocktail.
 * @returns {Promise<Array<number>>} - A list of ingredient IDs.
 */
async function fetchIngredientIdsForCocktail(cocktailId) {
    const cocktailIngredients = await fetchTableData('cocktail_ingredients', { cocktail_id: cocktailId });
    return cocktailIngredients.map(ci => ci.ingredient_id);
}

/**
 * Fetches ingredient names for a list of ingredient IDs.
 * @param {Array<number>} ingredientIds - The IDs of the ingredients.
 * @returns {Promise<Array<string>>} - A list of ingredient names.
 */
async function fetchIngredientNames(ingredientIds) {
    const { data, error } = await supabaseClient
        .from('ingredients')
        .select('name')
        .in('id', ingredientIds);

    if (error) {
        console.error('Error fetching ingredients:', error);
        return [];
    }

    return data.map(ingredient => ingredient.name);
}

/**
 * Fetches all cocktails along with their ingredients.
 * @returns {Promise<Array<object>>} - A list of cocktails with their ingredients.
 */
async function fetchCocktailsWithIngredients() {
    const cocktails = await fetchCocktails();

    const cocktailsWithIngredients = await Promise.all(
        cocktails.map(async (cocktail) => {
            const ingredientIds = await fetchIngredientIdsForCocktail(cocktail.id);
            const ingredients = await fetchIngredientNames(ingredientIds);
            return { ...cocktail, ingredients };
        })
    );

    return cocktailsWithIngredients;
}

// Function to render the cocktails and ingredients into the DOM
async function renderCocktails() {
    const cocktailListContainer = document.getElementById('cocktailList');
    cocktailListContainer.innerHTML = ''; // Clear previous data if any

    const cocktailsWithIngredients = await fetchCocktailsWithIngredients();

    cocktailsWithIngredients.forEach(cocktail => {
        // Create a container for each cocktail
        const cocktailDiv = document.createElement('div');
        cocktailDiv.classList.add('cocktail');

        // Add cocktail name
        const cocktailName = document.createElement('h2');
        cocktailName.textContent = cocktail.name;
        cocktailDiv.appendChild(cocktailName);

        // Add ingredients list
        if (cocktail.ingredients.length > 0) {
            const ingredientsList = document.createElement('ul');
            cocktail.ingredients.forEach(ingredient => {
                const ingredientItem = document.createElement('li');
                ingredientItem.textContent = ingredient;
                ingredientsList.appendChild(ingredientItem);
            });
            cocktailDiv.appendChild(ingredientsList);
        } else {
            const noIngredients = document.createElement('p');
            noIngredients.textContent = 'No ingredients available';
            cocktailDiv.appendChild(noIngredients);
        }

        // Append the cocktail container to the main list
        cocktailListContainer.appendChild(cocktailDiv);
    });
}

// Load cocktails when the page is loaded
document.addEventListener('DOMContentLoaded', renderCocktails);
