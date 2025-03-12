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
            console.log(data);
            
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
// Legg til oppskrift
document.addEventListener("DOMContentLoaded", () => {
    const recipeForm = document.getElementById("recipeForm");

    recipeForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Forhindrer siden fra å laste inn på nytt

        // Hent verdier fra inputfeltene
        const name = document.getElementById("recipeName").value;
        const ingredients = document.getElementById("recipeIngredients").value.split(",").map(i => i.trim());
        const instructions = document.getElementById("recipeInstructions").value;

        // Lag JSON-objekt for forespørselen
        const newRecipe = {
            name,
            ingredients,
            instructions
        };

        try {
            const response = await fetch("/api/recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRecipe)
            });

            if (!response.ok) {
                throw new Error("Kunne ikke lagre oppskrift");
            }

            console.log("Oppskrift lagt til!");
            recipeForm.reset(); // Tøm skjemaet etter suksess
        } catch (error) {
            console.error("Feil ved lagring av oppskrift:", error);
        }
    });
});
