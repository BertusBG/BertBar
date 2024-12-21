//import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const SUPABASE_URL = 'https://agjfltsqnqnyfcepgpmh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnamZsdHNxbnFueWZjZXBncG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MzA4NDQsImV4cCI6MjA1MDIwNjg0NH0.52LC3seAiNCWGw7YxzK0LNMvR0LKQsMlN39aDVQ8Kb0';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fetch the cocktail with id 1
async function fetchCocktail() {
    try {
        const { data, error } = await supabaseClient
            .from('cocktails') // Replace 'cocktails' with your table name
            .select('name')
            .eq('id', 1)
            .single();

        const cocktailNameElement = document.getElementById('cocktail-name');

        if (error) {
            console.error('Error fetching cocktail:', error);
            cocktailNameElement.textContent = 'Error fetching data';
            cocktailNameElement.classList.remove('loading');
            cocktailNameElement.classList.add('error');
            return;
        }

        // Update the DOM with the cocktail name
        cocktailNameElement.textContent = data ? data.name : 'No cocktail found';
        cocktailNameElement.classList.remove('loading');
    } catch (err) {
        console.error('Unexpected error:', err);
        const cocktailNameElement = document.getElementById('cocktail-name');
        cocktailNameElement.textContent = 'Unexpected error occurred';
        cocktailNameElement.classList.remove('loading');
        cocktailNameElement.classList.add('error');
    }
}

// Call the function to fetch the cocktail
fetchCocktail();
