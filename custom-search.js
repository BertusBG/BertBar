import { fetchCocktailsWithIngredients } from './common.js';

async function searchCocktails(query) {
    const cocktailsWithIngredients = await fetchCocktailsWithIngredients();

    const filteredCocktails = cocktailsWithIngredients.filter(cocktail =>
        cocktail.name.toLowerCase().includes(query.toLowerCase())
    );

    const cocktailListContainer = document.getElementById('cocktailList');
    cocktailListContainer.innerHTML = '';

    filteredCocktails.forEach(cocktail => {
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

document.getElementById('customSearchBtn').addEventListener('click', () => {
    const query = document.getElementById('customSearch').value;
    searchCocktails(query);
});
