import { fetchCocktailsWithIngredients } from './common.js';

async function showAllCocktails() {
    const cocktailsWithIngredients = await fetchCocktailsWithIngredients();

    // Sort cocktails by name
    cocktailsWithIngredients.sort((a, b) => a.name.localeCompare(b.name));

    renderCocktails(cocktailsWithIngredients);
}

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

// Show all cocktails on page load
showAllCocktails();
