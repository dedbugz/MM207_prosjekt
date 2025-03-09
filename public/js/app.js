// Registrer Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/js/service-worker.js")
    .then((reg) => {console.log("Service Worker registrert!", reg);})
    .catch((err) => {console.log("Service Worker-feil:", err);});
}

// Hente oppskrifter og vise dem i UI
document.addEventListener("DOMContentLoaded", () => {
    const recipeList = document.getElementById("recipe-list");
    const fetchButton = document.getElementById("fetchRecipes");

    fetchButton.addEventListener("click", async () => {
    
        try {
            const response = await fetch("/api/recipes");
    
            const data = await response.json();
    
            recipeList.innerHTML = "";
            data.recipes.forEach(recipe => {
                const li = document.createElement("li");
                li.textContent = `${recipe.name}: ${recipe.instructions}`;
                recipeList.appendChild(li);
            });
    
        } catch (error) {
            console.error(" Kunne ikke hente oppskrifter:", error);
        }
    });
});