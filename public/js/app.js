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
            console.log("API-respons:", data);

            displayRecipes(data.recipes);

        } catch (error) {
            console.error("Kunne ikke hente oppskrifter:", error);
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

        const ingredientsList = recipe.ingredients ? recipe.ingredients.join(", ") : "Ingen ingredienser oppgitt";

        li.innerHTML = `
            <strong>${recipe.name}</strong><br>
            <em>Ingredienser:</em> ${ingredientsList}<br>
            <em>Instruksjoner:</em> ${recipe.instructions}<br>
            <button class="editRecipeButton" data-id="${recipe.id}" data-name="${recipe.name}"
                data-ingredients="${recipe.ingredients}" data-instructions="${recipe.instructions}">
                ✏ Rediger
            </button>
            <button class="deleteRecipeButton" data-id="${recipe.id}">🗑 Slett</button>
            <br><br>
        `;

        recipeList.appendChild(li);
    });

    // Legg til event listeners for alle "Rediger"-knapper
    document.querySelectorAll(".editRecipeButton").forEach(button => {
        button.addEventListener("click", (event) => {
            const recipeId = event.target.getAttribute("data-id");
            const name = event.target.getAttribute("data-name");
            const ingredients = event.target.getAttribute("data-ingredients");
            const instructions = event.target.getAttribute("data-instructions");

            // Sett verdiene i redigeringsskjemaet
            document.getElementById("editRecipeId").value = recipeId;
            document.getElementById("editRecipeName").value = name;
            document.getElementById("editRecipeIngredients").value = ingredients;
            document.getElementById("editRecipeInstructions").value = instructions;

            // Vis skjemaet
            document.getElementById("editRecipeForm").style.display = "block";
        });
    });

    // Legg til event listeners for "Slett"-knapper
    document.querySelectorAll(".deleteRecipeButton").forEach(button => {
        button.addEventListener("click", async (event) => {
            const recipeId = event.target.getAttribute("data-id");
            if (!recipeId) {
                alert("Feil: Ingen oppskrift valgt for sletting!");
                return;
            }

            if (!confirm("Er du sikker på at du vil slette denne oppskriften?")) {
                return;
            }

            try {
                const response = await fetch(`/api/recipes/${recipeId}`, {
                    method: "DELETE"
                });

                if (!response.ok) {
                    throw new Error("Kunne ikke slette oppskrift");
                }

                console.log("Oppskrift slettet!");
                alert("Oppskrift slettet!");

                // Oppdater listen med oppskrifter
                document.getElementById("fetchRecipes").click();
            } catch (error) {
                console.error("Feil ved sletting av oppskrift:", error);
                alert("Feil: Kunne ikke slette oppskrift.");
            }
        });
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

// Søkefunksjon for ingredienser
async function searchRecipes() {
    const ingredient = document.getElementById("searchIngredient").value.trim();
    if (!ingredient) {
        alert("Skriv inn en ingrediens for å søke.");
        return;
    }

    try {
        const response = await fetch(`/api/recipes/search?ingredient=${ingredient}`);
        const data = await response.json();

        console.log("API-respons for søk:", data);
        displayRecipes(data.recipes);
    } catch (error) {
        console.error("Feil ved henting av oppskrifter:", error);
    }
}


//test av frontend redigering
document.addEventListener("DOMContentLoaded", () => {
    const editButton = document.getElementById("fetchEditForm");
    const editForm = document.getElementById("editRecipeForm");

    if (editButton && editForm) { 
        editButton.addEventListener("click", () => {
            console.log("Rediger oppskrift-knapp klikket!");
            editForm.style.display = editForm.style.display === "none" ? "block" : "none";
        });
    } else {
        console.error("Feil: Kunne ikke finne 'fetchEditForm' eller 'editRecipeForm'.");
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.getElementById("saveChanges");
    
    if (saveButton) {
        saveButton.addEventListener("click", async () => {
            const recipeId = document.getElementById("editRecipeId").value;
            const name = document.getElementById("editRecipeName").value;
            const ingredients = document.getElementById("editRecipeIngredients").value.split(",").map(i => i.trim());
            const instructions = document.getElementById("editRecipeInstructions").value;

            if (!recipeId) {
                alert("❌ Feil: Ingen oppskrift valgt for oppdatering!");
                return;
            }

            const updatedRecipe = { name, ingredients, instructions };

            try {
                const response = await fetch(`/api/recipes/${recipeId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedRecipe)
                });

                if (!response.ok) {
                    throw new Error("Kunne ikke oppdatere oppskrift");
                }

                console.log("✅ Oppskrift oppdatert!");
                alert("Oppskrift lagret!");
                document.getElementById("editRecipeForm").style.display = "none"; // Skjul skjema etter oppdatering
            } catch (error) {
                console.error("❌ Feil ved oppdatering av oppskrift:", error);
                alert("Feil: Kunne ikke lagre endringer.");
            }
        });
    } else {
        console.error("❌ Feil: Kunne ikke finne 'saveChanges'-knappen.");
    }
});
