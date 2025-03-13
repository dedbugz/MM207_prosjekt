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
    recipeList.innerHTML = "";

    if (recipes.length === 0) {
        recipeList.innerHTML = "<li>Ingen oppskrifter funnet.</li>";
        return;
    }

    recipes.forEach(recipe => {
        const div = document.createElement("div");
        div.classList.add("recipe-card");

        const ingredientsList = recipe.ingredients ? recipe.ingredients.join(", ") : "Ingen ingredienser oppgitt";

        div.innerHTML = `
        <h3>${recipe.name}</h3>
            <p><em>Ingredienser:</em> ${ingredientsList}</p>
            <p><em>Instruksjoner:</em> ${recipe.instructions}</p>
            <button class="edit-btn" data-id="${recipe.id}">✏ Rediger</button>
            <button class="delete-btn" data-id="${recipe.id}">🗑 Slett</button>
        `;

        recipeList.appendChild(div);
    });

    //event listeners for Redigering
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const recipeId = event.target.getAttribute("data-id");
            openEditForm(recipeId);
        });
    });

    //event listeners for Redigering
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", async (event) => {
            const recipeId = event.target.dataset.id;
            if (confirm("Er du sikker på at du vil slette oppskriften?")) {
                await deleteRecipe(recipeId);
            }
        });
    });
}

// Funksjon for å åpne redigeringsskjemaet
function openEditForm(recipeId) {
    console.log(`Redigerer oppskrift med ID: ${recipeId}`);

    if (!recipeId) {
        console.error("Feil: Recipe ID er undefined!");
        return;
    }

    const editForm = document.getElementById("editRecipeForm");
    document.getElementById("editRecipeId").value = recipeId;
    editForm.style.display = "block";
}

//Funksjon for redigering
async function loadRecipeForEditing(event) {
    const recipeId = event.target.getAttribute("data-id");

    if (!recipeId) {
        console.error("❌ Feil: Kunne ikke hente ID for redigering.");
        return;
    }

    try {
        const response = await fetch(`/api/recipes/${recipeId}`);
        if (!response.ok) throw new Error("Kunne ikke hente oppskrift.");

        const recipe = await response.json();

        console.log(`✏️ Redigerer oppskrift med ID: ${recipeId}`);

        // Fyll skjemaet med oppskriftsdata
        document.getElementById("editRecipeId").value = recipeId;
        document.getElementById("editRecipeName").value = recipe.name;
        document.getElementById("editRecipeIngredients").value = recipe.ingredients.join(", ");
        document.getElementById("editRecipeInstructions").value = recipe.instructions;

        // Vis redigeringsskjemaet
        document.getElementById("editRecipeForm").style.display = "block";

        // 🔄 Oppdater listen etter redigering
        fetchRecipes();
        
    } catch (error) {
        console.error("❌ Feil ved lasting av oppskrift for redigering:", error);
    }
}


//Funksjon for å slette en oppskrift
async function deleteRecipe(recipeId) {
    try {
        const response = await fetch(`/api/recipes/${recipeId}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Kunne ikke slette oppskriften.");

        console.log("Oppskrift slettet!");
        alert("Oppskrift slettet!");
        document.getElementById("fetchRecipes").click(); // Hent oppdatert liste
    } catch (error) {
        console.error("Feil ved sletting av oppskrift:", error);
        alert("Feil ved sletting av oppskrift.");
    }
}

// Legg til oppskrift
document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggleRecipeForm");
    const formContainer = document.getElementById("recipeFormContainer");
    toggleButton.addEventListener("click", () => {
        formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
    });
    const recipeForm = document.getElementById("recipeForm");

    recipeForm.addEventListener("submit", async (event) => {
        event.preventDefault();

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
            recipeForm.reset();
            document.getElementById("fetchRecipes").click(); 
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
                alert("Feil: Ingen oppskrift valgt for oppdatering!");
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
                document.getElementById("fetchRecipes").click(); // Hent oppdatert liste


            } catch (error) {
                console.error("Feil ved oppdatering av oppskrift:", error);
                alert("Feil: Kunne ikke lagre endringer.");
            }
        });
    } else {
        console.error("Feil: Kunne ikke finne 'saveChanges'-knappen.");
    }
});

