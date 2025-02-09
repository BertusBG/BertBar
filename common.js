// Import Supabase library
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://agjfltsqnqnyfcepgpmh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnamZsdHNxbnFueWZjZXBncG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzA4NDQsImV4cCI6MjA1MDIwNjg0NH0.52LC3seAiNCWGw7YxzK0LNMvR0LKQsMlN39aDVQ8Kb0';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export supabaseClient so you can import it in other files
export { supabaseClient };

// Sign in with GitHub
async function signInWithGitHub() {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'github',
    });

    if (error) {
        console.error("Sign-in error:", error);
    }
}

// Sign out
async function signOut() {
    await supabaseClient.auth.signOut();
    updateUI(null);
}

// Check user session and update UI
async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    updateUI(user);
}

// Update the UI based on the auth state
function updateUI(user) {
    const userInfo = document.getElementById('user-info');
    const signInBtn = document.getElementById('sign-in');
    const signOutBtn = document.getElementById('sign-out');

    if (user) {
        userInfo.innerHTML = `Signed in as: ${user.email}`;
        signInBtn.style.display = 'none';
        signOutBtn.style.display = 'block';
    } else {
        userInfo.innerHTML = 'Not signed in';
        signInBtn.style.display = 'block';
        signOutBtn.style.display = 'none';
    }
}

// Expose the functions to the global window object
window.signInWithGitHub = signInWithGitHub;
window.signOut = signOut;

// Check user on page load
checkUser();

// Existing functions (e.g., fetching data)...
// Fetch Cocktails, Ingredients, etc.
export async function fetchCocktails() {
    const { data: cocktails, error } = await supabaseClient
        .from('cocktails')
        .select('*');

    if (error) {
        console.error('Error fetching cocktails:', error);
        return [];
    }

    return cocktails;
}

export async function fetchCocktailsWithIngredients() {
    const cocktails = await fetchCocktails();

    const cocktailsWithIngredients = await Promise.all(
        cocktails.map(async (cocktail) => {
            const { data: ingredientLinks } = await supabaseClient
                .from('cocktail_ingredients')
                .select('ingredient_id')
                .eq('cocktail_id', cocktail.id);

            const ingredientIds = ingredientLinks.map(link => link.ingredient_id);

            const { data: ingredients } = await supabaseClient
                .from('ingredients')
                .select('*')
                .in('id', ingredientIds);

            return { ...cocktail, ingredients };
        })
    );

    return cocktailsWithIngredients;
}

export async function fetchIngredients() {
    const { data: ingredients, error } = await supabaseClient
        .from('ingredients')
        .select('*');

    if (error) {
        console.error('Error fetching ingredients:', error);
        return [];
    }

    return ingredients;
}
