// Initialize Supabase client
const SUPABASE_URL = 'https://agjfltsqnqnyfcepgpmh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnamZsdHNxbnFueWZjZXBncG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzA4NDQsImV4cCI6MjA1MDIwNjg0NH0.52LC3seAiNCWGw7YxzK0LNMvR0LKQsMlN39aDVQ8Kb0';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetching and Rendering Logic
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

async function fetchCocktails() {
    return fetchTableData('cocktails');
}

async function fetchCocktailsWithIngredients() {
    const cocktails = await fetchCocktails();

    const cocktailsWithIngredients = await Promise.all(
        cocktails.map(async (cocktail) => {
            const ingredientIds = await fetchIngredientIdsForCocktail(cocktail.id);
            const ingredients = await fetchIngredients(ingredientIds);
            return { ...cocktail, ingredients };
        })
    );

    return cocktailsWithIngredients;
}

async function fetchIngredientIdsForCocktail(cocktailId) {
    const { data, error } = await supabaseClient
        .from('cocktail_ingredients')
        .select('ingredient_id')
        .eq('cocktail_id', cocktailId);

    if (error) {
        console.error('Error fetching ingredient IDs for cocktail:', error);
        return [];
    }

    return data.map(item => item.ingredient_id);
}

async function fetchIngredients(ingredientIds) {
    const { data, error } = await supabaseClient
        .from('ingredients')
        .select('id, name, available')
        .in('id', ingredientIds);

    if (error) {
        console.error('Error fetching ingredients:', error);
        return [];
    }

    return data;
}

// Render Functions
async function renderCocktails(cocktailsWithIngredients) {
    const cocktailListContainer = document.getElementById('cocktailList');
    cocktailListContainer.innerHTML = '';

    cocktailsWithIngredients.forEach(cocktail => {
        const cocktailDiv = document.createElement('div');
        cocktailDiv.classList.add('cocktail');

        const cocktailName = document.createElement('h2');
        cocktailName.textContent = cocktail.name;
        cocktailDiv.appendChild(cocktailName);

        if (cocktail.ingredients.length > 0) {
            const ingredientsList = document.createElement('ul');
            cocktail.ingredients.forEach(ingredient => {
                const ingredientItem = document.createElement('li');
                ingredientItem.textContent = ingredient.name;
                ingredientsList.appendChild(ingredientItem);
            });
            cocktailDiv.appendChild(ingredientsList);
        } else {
            const noIngredients = document.createElement('p');
            noIngredients.textContent = 'No ingredients available';
            cocktailDiv.appendChild(noIngredients);
        }

        cocktailListContainer.appendChild(cocktailDiv);
    });
}

async function renderIngredients() {
    const ingredients = await fetchTableData('ingredients');
    const cocktailListContainer = document.getElementById('cocktailList');
    cocktailListContainer.innerHTML = '';

    const ingredientsDiv = document.createElement('div');
    ingredientsDiv.classList.add('ingredients');

    ingredients.forEach(ingredient => {
        const ingredientRow = document.createElement('div');
        ingredientRow.classList.add('ingredient-row');

        const ingredientName = document.createElement('span');
        ingredientName.textContent = ingredient.name;
        ingredientName.style.color = ingredient.available ? 'green' : 'red';
        ingredientRow.appendChild(ingredientName);

        const availability = document.createElement('span');
        availability.textContent = ingredient.available ? ' (Available)' : ' (Unavailable)';
        ingredientRow.appendChild(availability);

        ingredientsDiv.appendChild(ingredientRow);
    });

    cocktailListContainer.appendChild(ingredientsDiv);
}

// Show All Cocktails
async function showAllCocktails() {
    const cocktailsWithIngredients = await fetchCocktailsWithIngredients();
    renderCocktails(cocktailsWithIngredients);
}

// Show Cocktails with Available Ingredients
async function showCocktailsWithAvailableIngredients() {
    const availableIngredients = await fetchTableData('ingredients', { available: true });
    const availableIngredientIds = availableIngredients.map(ingredient => ingredient.id);

    const cocktailsWithIngredients = await fetchCocktailsWithIngredients();
    const cocktailsThatCanBeMade = cocktailsWithIngredients.filter(cocktail =>
        cocktail.ingredients.every(ingredient => availableIngredientIds.includes(ingredient.id))
    );

    renderCocktails(cocktailsThatCanBeMade);
}

// Custom Search
async function searchCocktails(query) {
    const allCocktails = await fetchCocktailsWithIngredients();
    const filteredCocktails = allCocktails.filter(cocktail =>
        cocktail.name.toLowerCase().includes(query.toLowerCase())
    );
    renderCocktails(filteredCocktails);
}

// Event Listeners
document.getElementById('showAllBtn').addEventListener('click', showAllCocktails);
document.getElementById('showAvailableBtn').addEventListener('click', showCocktailsWithAvailableIngredients);
document.getElementById('customSearchBtn').addEventListener('click', () => {
    const query = document.getElementById('customSearch').value;
    searchCocktails(query);
});
document.getElementById('showIngredientsBtn').addEventListener('click', renderIngredients);

// Default Action on Load
document.addEventListener('DOMContentLoaded', showAllCocktails);
