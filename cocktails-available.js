import { fetchCocktailsWithIngredients, fetchIngredients } from './common.js';

async function renderCocktailsWithAvailableIngredients() {
    const cocktailListContainer = document.getElementById('cocktailList');
    cocktailListContainer.innerHTML = 'Loading cocktails...';

    const availableIngredients = await fetchIngredients();
    const availableIngredientIds = availableIngredients
        .filter(ingredient => ingredient.available)
        .map(ingredient => ingredient.id);

    const cocktailsWithIngredients = await fetchCocktailsWithIngredients();
    const cocktailsThatCanBeMade = cocktailsWithIngredients.filter(cocktail =>
        cocktail.ingredients.every(ingredient =>
            availableIngredientIds.includes(ingredient.id)
        )
    );

    cocktailListContainer.innerHTML = '';

    cocktailsThatCanBeMade.forEach(cocktail => {
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

document.addEventListener('DOMContentLoaded', renderCocktailsWithAvailableIngredients);
