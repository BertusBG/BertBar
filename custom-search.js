import { fetchCocktailsWithIngredients, fetchIngredients } from './common.js';

let allIngredients = [];
let selectedInclude = [];
let selectedExclude = [];
let selectedOptional = [];

// Populate the dropdowns with ingredients
async function populateDropdowns() {
    allIngredients = await fetchIngredients();

    const includeDropdown = document.getElementById('includeDropdown');
    const excludeDropdown = document.getElementById('excludeDropdown');
    const optionalDropdown = document.getElementById('optionalDropdown');

    // Clear all dropdowns
    includeDropdown.innerHTML = '<option value="">Select an ingredient</option>';
    excludeDropdown.innerHTML = '<option value="">Select an ingredient</option>';
    optionalDropdown.innerHTML = '<option value="">Select an ingredient</option>';

    // Populate the "include" dropdown with all ingredients
    allIngredients.forEach(ingredient => {
        const includeOption = document.createElement('option');
        includeOption.value = ingredient.id;
        includeOption.textContent = ingredient.name;
        includeDropdown.appendChild(includeOption);
    });

    // Populate the "exclude" dropdown with available ingredients
    const availableIngredients = allIngredients.filter(ingredient => ingredient.available);
    availableIngredients.forEach(ingredient => {
        const excludeOption = document.createElement('option');
        excludeOption.value = ingredient.id;
        excludeOption.textContent = ingredient.name;
        excludeDropdown.appendChild(excludeOption);
    });

    // Populate the "optional" dropdown with unavailable ingredients
    const unavailableIngredients = allIngredients.filter(ingredient => !ingredient.available);
    unavailableIngredients.forEach(ingredient => {
        const optionalOption = document.createElement('option');
        optionalOption.value = ingredient.id;
        optionalOption.textContent = ingredient.name;
        optionalDropdown.appendChild(optionalOption);
    });
}

// Add selected ingredients to the appropriate list
function addIngredient(ingredientId, list, containerId) {
    const ingredient = allIngredients.find(ing => ing.id === parseInt(ingredientId));
    if (!ingredient || list.some(ing => ing.id === ingredient.id)) return;

    list.push(ingredient);
    renderIngredientList(list, containerId);
}

// Remove an ingredient from a list
function removeIngredient(ingredientId, list, containerId) {
    const index = list.findIndex(ing => ing.id === parseInt(ingredientId));
    if (index !== -1) {
        list.splice(index, 1);
        renderIngredientList(list, containerId);
    }
}

// Render the selected ingredients
function renderIngredientList(list, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    list.forEach(ingredient => {
        const ingredientDiv = document.createElement('div');
        ingredientDiv.classList.add('cocktail');

        const nameSpan = document.createElement('span');
        nameSpan.textContent = ingredient.name;
        ingredientDiv.appendChild(nameSpan);

        const removeButton = document.createElement('button');
        removeButton.textContent = '✖';
        removeButton.classList.add('remove-btn');
        removeButton.addEventListener('click', () => removeIngredient(ingredient.id, list, containerId));
        ingredientDiv.appendChild(removeButton);

        container.appendChild(ingredientDiv);
    });
}

// Filter cocktails based on the selected ingredients
async function filterCocktails() {
    const cocktailsWithIngredients = await fetchCocktailsWithIngredients();

    const filteredCocktails = cocktailsWithIngredients.filter(cocktail => {
        const ingredientIds = cocktail.ingredients.map(ing => ing.id);

        // Check if all exclude ingredients are missing
        const excludesMatch = selectedExclude.every(ing => !ingredientIds.includes(ing.id));

        // Check if all include ingredients are present
        const includesMatch = selectedInclude.every(ing => ingredientIds.includes(ing.id));

        // Check if all ingredients are either available, in "include", or in "optional"
        const optionalMatch = cocktail.ingredients.every(
            ing =>
                ing.available ||
                selectedInclude.some(includeIng => includeIng.id === ing.id) ||
                selectedOptional.some(optionalIng => optionalIng.id === ing.id)
        );

        return excludesMatch && includesMatch && optionalMatch;
    });

    renderCocktails(filteredCocktails);
}

// Render cocktails
function renderCocktails(cocktails) {
    const cocktailListContainer = document.getElementById('cocktailList');
    cocktailListContainer.innerHTML = '';

    cocktails.forEach(cocktail => {
        const cocktailDiv = document.createElement('div');
        cocktailDiv.classList.add('cocktail');

        const cocktailName = document.createElement('h2');
        cocktailName.textContent = cocktail.name;
        cocktailDiv.appendChild(cocktailName);

        const ingredientsList = document.createElement('ul');
        cocktail.ingredients.forEach(ingredient => {
            const ingredientItem = document.createElement('li');
            ingredientItem.textContent = ingredient.name;
            ingredientsList.appendChild(ingredientItem);
        });
        cocktailDiv.appendChild(ingredientsList);

        cocktailListContainer.appendChild(cocktailDiv);
    });
}

// Event listeners for dropdowns and filter button
document.getElementById('includeDropdown').addEventListener('change', (e) => {
    addIngredient(e.target.value, selectedInclude, 'selectedInclude');
    e.target.value = '';
});

document.getElementById('excludeDropdown').addEventListener('change', (e) => {
    addIngredient(e.target.value, selectedExclude, 'selectedExclude');
    e.target.value = '';
});

document.getElementById('optionalDropdown').addEventListener('change', (e) => {
    addIngredient(e.target.value, selectedOptional, 'selectedOptional');
    e.target.value = '';
});

document.getElementById('filterBtn').addEventListener('click', filterCocktails);

// Initialize the dropdowns on page load
populateDropdowns();
