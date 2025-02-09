// Import necessary functions from common.js
import { fetchIngredients, supabaseClient } from './common.js';

// Render Ingredients Function
export async function renderIngredients() {
    const ingredientListContainer = document.getElementById('ingredientList');
    ingredientListContainer.innerHTML = 'Loading ingredients...';

    const ingredients = await fetchIngredients();  // Get all ingredients from the database
    ingredients.sort((a, b) => a.name.localeCompare(b.name));
    ingredientListContainer.innerHTML = '';  // Clear any previous content

    const ingredientsDiv = document.createElement('div');
    ingredientsDiv.classList.add('ingredients');  // Add a class for styling

    ingredients.forEach(ingredient => {
        const ingredientRow = document.createElement('div');
        ingredientRow.classList.add('ingredient-row');  // Create a container for each ingredient

        const ingredientName = document.createElement('span');
        ingredientName.textContent = ingredient.name;  // Display ingredient name
        ingredientName.style.color = ingredient.available ? 'green' : 'red';  // Color based on availability
        ingredientRow.appendChild(ingredientName);

        const availability = document.createElement('span');
        availability.textContent = ingredient.available ? ' (Available)' : ' (Unavailable)';  // Show availability
        ingredientRow.appendChild(availability);

        // Add a click event to toggle availability
        ingredientRow.addEventListener('click', () => handleAvailabilityClick(ingredient));

        ingredientsDiv.appendChild(ingredientRow);  // Add the ingredient row to the container
    });

    ingredientListContainer.appendChild(ingredientsDiv);  // Add the ingredients list to the page
}

// Handle the click to toggle availability
async function handleAvailabilityClick(ingredient) {
    // Toggle the availability
    const newAvailability = !ingredient.available;

    // Update the ingredient in the database
    const { data, error } = await supabaseClient
        .from('ingredients')
        .update({ available: newAvailability })  // Set the new availability
        .eq('id', ingredient.id);  // Find the ingredient by its ID

    if (error) {
        console.error('Error updating ingredient availability:', error);
        return;
    }

    // If successful, update the availability in the local ingredient object
    ingredient.available = newAvailability;

    // Re-render the ingredients to reflect the updated availability
    renderIngredients();
}

// Call the renderIngredients function when the page is loaded
document.addEventListener('DOMContentLoaded', renderIngredients);
