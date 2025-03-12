import express from "express";
import pool from "../utils/db.js";
import HTTP_CODES from "../utils/httpCodes.mjs";

const recipeRouter = express.Router();
//const filePath = "./data/recipes.json";

// Hent alle oppskrifter
recipeRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM recipes");
        res.status(200).json({ recipes: result.rows });
    } catch (error) {
        console.error("Feil ved henting av oppskrifter:", error);
        res.status(400).json({ error: "Kunne ikke hente oppskrifter" });
    }
    console.log(result.rows);
});

// Legg til en ny oppskrift
recipeRouter.post("/", async (req, res) => {
    try {
        const { name, ingredients, instructions } = req.body;
        const result = await pool.query(
            "INSERT INTO recipes (name, ingredients, instructions) VALUES ($1, $2, $3) RETURNING *",
            [name, ingredients, instructions]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Feil ved lagring av oppskrift:", error);
        res.status(400).json({ error: "Kunne ikke lagre oppskrift" });
    }
});



// Oppdater en oppskrift
recipeRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedRecipe = req.body;
    let data = JSON.parse(await fs.readFile(filePath, "utf-8"));

    const index = data.findIndex(r => r.id == id);
    if (index === -1) return res.status(404).json({ error: "Recipe not found" });

    data[index] = { ...data[index], ...updatedRecipe, id: data[index].id };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    res.json(data[index]);
});


// Slett en oppskrift
recipeRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    let data = JSON.parse(await fs.readFile(filePath, "utf-8"));

    if (!Array.isArray(data.recipes)) {
        return res.status(500).json({ error: "Invalid data format" });
    }

    const initialLength = data.recipes.length;
    data.recipes = data.recipes.filter(r => r.id !== id.toString());
    if (data.recipes.length === initialLength) {
        return res.status(404).json({ error: "Recipe not found" });
    }

    await fs.writeFile(filePath, JSON.stringify({ recipes: data.recipes }, null, 2));
    res.status(204).end();
});




export default recipeRouter;
