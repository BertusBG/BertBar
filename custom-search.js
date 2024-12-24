import { fetchCocktailsWithIngredients, fetchIngredients } from './common.js';

// Elements
const includeDropdown = document.getElementById('includeDropdown');
const excludeDropdown = document.getElementById('excludeDropdown');
const optionalDropdown = document.getElementById('optionalDropdown');
const selectedIncludeContainer = document.getElementById('selectedInclude');
const selectedExcludeContainer = document.getElementById('selectedExclude');
const selectedOptionalContainer = document.getElementById('selectedOptional');
const cocktailList = document.getElementById('cocktailList');

// State
let includeIngredients = [];
let excludeIngredients = [];
let optionalIngredients = [];

// Utility Functions
function createIngredientCard(ingredient, container, stateArray) {
    const card = document.createElement('div');
    card.classList.add('ingredient-card');

    const name = document.createElement('h3');
    name.textContent = ingredient.name;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✖';
    removeBtn.classList.add('remove-btn');
    removeBtn.addEventListener('click', () => {
        const index = stateArray.findIndex((item) => item.id === ingredient.id);
        if (index !== -1) {
            stateArray.splice(index, 1);
        }
        renderSelectedIngredients(); // Re-render
    });

    card.appendChild(name);
    card.appendChild(removeBtn);
    container.appendChild(card);
}

function renderSelectedIngredients() {
    selectedIncludeContainer.innerHTML = '';
    includeIngredients.forEach((ingredient) =>
        createIngredientCard(ingredient, selectedIncludeContainer, includeIngredients)
    );

    selectedExcludeContainer.innerHTML = '';
    excludeIngredients.forEach((ingredient) =>
        createIngredientCard(ingredient, selectedExcludeContainer, excludeIngredients)
    );

    selectedOptionalContainer.innerHTML = '';
    optionalIngredients.forEach((ingredient) =>
        createIngredientCard(ingredient, selectedOptionalContainer, optionalIngredients)
    );
}

// Dropdown Event Listeners
function setupDropdown(dropdown, stateArray) {
    dropdown.addEventListener('change', async (event) => {
        const ingredientId = parseInt(event.target.value);
        const ingredient = (await fetchIngredients()).find((ing) => ing.id === ingredientId);

        if (ingredient && !stateArray.some((item) => item.id === ingredient.id)) {
            stateArray.push(ingredient);
        }

        renderSelectedIngredients();
        dropdown.value = ''; // Reset the dropdown
    });
}

setupDropdown(includeDropdown, includeIngredients);
setupDropdown(excludeDropdown, excludeIngredients);
setupDropdown(optionalDropdown, optionalIngredients);

// Fetch and Populate Dropdowns
async function populateDropdowns() {
    const ingredients = await fetchIngredients();

    [includeDropdown, excludeDropdown, optionalDropdown].forEach((dropdown) => {
        dropdown.innerHTML = '<option value="">Select an ingredient</option>';
        ingredients.forEach((ingredient) => {
            const option = document.createElement('option');
            option.value = ingredient.id;
            option.textContent = ingredient.name;
            dropdown.appendChild(option);
        });
    });
}

// Filter and Render Cocktails
async function filterCocktails() {
    const cocktails = await fetchCocktailsWithIngredients();

    const filteredCocktails = cocktails.filter((cocktail) => {
        const ingredientIds = cocktail.ingredients.map((ing) => ing.id);

        const includesAll = includeIngredients.every((ing) => ingredientIds.includes(ing.id));
        const excludesAll = excludeIngredients.every((ing) => !ingredientIds.includes(ing.id));
        const includesAnyOptional =
            optionalIngredients.length === 0 ||
            optionalIngredients.some((ing) => ingredientIds.includes(ing.id));

        return includesAll && excludesAll && includesAnyOptional;
    });

    renderCocktails(filteredCocktails);
}

function renderCocktails(cocktails) {
    cocktailList.innerHTML = '';

    cocktails.forEach((cocktail) => {
        const cocktailDiv = document.createElement('div');
        cocktailDiv.classList.add('cocktail');

        const cocktailName = document.createElement('h2');
        cocktailName.textContent = cocktail.name;
        cocktailDiv.appendChild(cocktailName);

        if (cocktail.ingredients.length > 0) {
            const ingredientsList = document.createElement('ul');
            cocktail.ingredients.forEach((ingredient) => {
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

        cocktailList.appendChild(cocktailDiv);
    });
}

// Event Listeners
document.getElementById('filterBtn').addEventListener('click', filterCocktails);

// Initialize
populateDropdowns();
