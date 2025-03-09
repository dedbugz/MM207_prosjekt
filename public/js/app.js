alert("app.js ble lastet!");


// Registrer Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/js/service-worker.js")
    .then((reg) => {console.log("Service Worker registrert!", reg);})
    .catch((err) => {console.log("Service Worker-feil:", err);});
}

// Hente oppskrifter og vise dem i UIdocument.addEventListener("DOMContentLoaded", () => {
document.addEventListener("DOMContentLoaded", () => {
    const recipeList = document.getElementById("recipe-list");
    const fetchButton = document.getElementById("fetchRecipes");
    console.log("🚀 Fetch button found:", fetchButton);

    if (!fetchButton) {
        console.error("❌ Fetch button not found!");
        return;
    }

    fetchButton.addEventListener("click", async () => {
        console.log("✅ Knappen ble klikket! Henter oppskrifter...");
    
        try {
            const response = await fetch("/api/recipes");
            console.log("🌐 Fetch response:", response);
    
            if (!response.ok) {
                throw new Error(`❌ Feil ved henting: ${response.status} - ${response.statusText}`);
            }
    
            const data = await response.json();
            console.log("📦 Fikk data:", data);
    
            recipeList.innerHTML = "";
            data.recipes.forEach(recipe => {
                const li = document.createElement("li");
                li.textContent = `${recipe.name}: ${recipe.instructions}`;
                recipeList.appendChild(li);
            });
    
        } catch (error) {
            console.error("❌ Kunne ikke hente oppskrifter:", error);
        }
    });
});