// Registrer Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/js/service-worker.js")
    .then((reg) => {console.log("Service Worker registrert!", reg);})
    .catch((err) => {console.log("Service Worker-feil:", err);});
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    console.log("Install prompt available");

    // Vis en installasjonsknapp
    const installButton = document.createElement("button");
    installButton.textContent = "Installer appen";
    installButton.style.display = "block";
    document.body.appendChild(installButton);

    installButton.addEventListener("click", () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                console.log("Bruker installerte appen!");
            } else {
                console.log("Bruker avviste installasjonen.");
            }
            deferredPrompt = null;
        });
    });
});

// Hente oppskrifter og vise dem i UI
document.addEventListener("DOMContentLoaded", () => {
    const recipeList = document.getElementById("recipe-list");
    const fetchButton = document.getElementById("fetchRecipes");

    fetchButton.addEventListener("click", async () => {
        try {
            const response = await fetch("/api/recipes");
            const data = await response.json();
            console.log("🔍 API-respons:", data);

            displayRecipes(data.recipes);

        } catch (error) {
            console.error("❌ Kunne ikke hente oppskrifter:", error);
        }
    });
});

// Funksjon for å vise oppskrifter
function displayRecipes(recipes) {
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = ""; // Tøm eksisterende liste

    if (recipes.length === 0) {
        recipeList.innerHTML = "<li>Ingen oppskrifter funnet.</li>";
        return;
    }

    recipes.forEach(recipe => {
        const li = document.createElement("li");

        // 🎯 Formater ingrediensene riktig
        const ingredientsList = recipe.ingredients ? recipe.ingredients.join(", ") : "Ingen ingredienser oppgitt";

        li.innerHTML = `
            <strong>${recipe.name}</strong><br>
            <em>Ingredienser:</em> ${ingredientsList}<br>
            <em>Instruksjoner:</em> ${recipe.instructions}<br><br>
        `;

        recipeList.appendChild(li);
    });
}

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
