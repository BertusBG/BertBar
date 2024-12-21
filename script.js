// Initialize Supabase client
const SUPABASE_URL = 'https://agjfltsqnqnyfcepgpmh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnamZsdHNxbnFueWZjZXBncG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzA4NDQsImV4cCI6MjA1MDIwNjg0NH0.52LC3seAiNCWGw7YxzK0LNMvR0LKQsMlN39aDVQ8Kb0';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to fetch cocktails and their ingredients
async function loadCocktails() {
    // Query to get all cocktails
    const { data: cocktails, error: cocktailsError } = await supabaseClient
        .from('cocktails')
        .select('id, name');
    console.log('Fetched cocktails');

    if (cocktailsError) {
        console.error('Error fetching cocktails:', cocktailsError);
        alert('Error fetching cocktails');
        return;
    }

    // For each cocktail, get its ingredients
    const cocktailWithIngredients = await Promise.all(cocktails.map(async (cocktail) => {
        // Get the ingredient IDs for the current cocktail
        console.log('Fetching ingredients for cocktail', cocktail.id, cocktail.name)
        const { data: cocktailIngredients, error: cocktailIngredientsError } = await supabaseClient
            .from('cocktail_ingredients')
            .select('ingredient_id')
            .eq('cocktail_id', cocktail.id);
        console.log('Number of ingredients fetched:', cocktailIngredients.length);

        if (cocktailIngredientsError) {
            console.error('Error fetching cocktail ingredients:', cocktailIngredientsError);
            return { ...cocktail, ingredients: [] };
        }

        if (cocktailIngredients.length === 0) {
            console.log(`No ingredients found for cocktail_id: ${cocktail.id}`);
        }

        // Get the names of the ingredients based on the ingredient IDs
        const ingredientIds = cocktailIngredients.map(ci => ci.ingredient_id);
        console.log('IngredientIds.length =', ingredientIds.length)
        const { data: ingredients, error: ingredientsError } = await supabaseClient
            .from('ingredients')
            .select('name')
            .in('id', ingredientIds);

        if (ingredientsError) {
            console.error('Error fetching ingredients:', ingredientsError);
            return { ...cocktail, ingredients: [] };
        }

        // Return the cocktail with its ingredients
        return { ...cocktail, ingredients: ingredients.map(ing => ing.name) };
    }));

    // Now render the data into the HTML
    renderCocktails(cocktailWithIngredients);
}

// Function to render the cocktails and ingredients into the DOM
function renderCocktails(cocktailWithIngredients) {
    const cocktailListContainer = document.getElementById('cocktailList');
    cocktailListContainer.innerHTML = ''; // Clear previous data if any

    cocktailWithIngredients.forEach(cocktail => {
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
document.addEventListener('DOMContentLoaded', loadCocktails);
