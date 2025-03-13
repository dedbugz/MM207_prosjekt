import express from "express";
import pool from "../utils/db.mjs";
import HTTP_CODES from "../utils/httpCodes.mjs";

const recipeRouter = express.Router();

// Hent alle oppskrifter
recipeRouter.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM recipes");
        console.log(result.rows);
        res.status(200).json({ recipes: result.rows });
    } catch (error) {
        console.error("Feil ved henting av oppskrifter:", error);
        res.status(400).json({ error: "Kunne ikke hente oppskrifter" });
    }
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
    try {
        const { id } = req.params;
        const { name, ingredients, instructions } = req.body;

        const result = await pool.query(
            "UPDATE recipes SET name = $1, ingredients = $2, instructions = $3 WHERE id = $4 RETURNING *",
            [name, ingredients, instructions, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Feil ved oppdatering av oppskrift:", error);
        res.status(400).json({ error: "Kunne ikke oppdatere oppskrift" });
    }
});


// Slett en oppskrift
recipeRouter.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query("DELETE FROM recipes WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Recipe not found" });
        }

        res.status(204).end();
    } catch (error) {
        console.error("Feil ved sletting av oppskrift:", error);
        res.status(400).json({ error: "Kunne ikke slette oppskrift" });
    }
});

// Søk etter oppskrifter basert på ingrediens
recipeRouter.get("/search", async (req, res) => {
    try {
        const { ingredient } = req.query;
        if (!ingredient) {
            return res.status(400).json({ error: "Mangler ingrediens for søk" });
        }

        const query = `
            SELECT * FROM recipes 
            WHERE EXISTS (
                SELECT 1 FROM unnest(ingredients) AS ing WHERE LOWER(ing) LIKE LOWER($1)
            )
        `;
        const result = await pool.query(query, [ingredient]);

        res.status(200).json({ recipes: result.rows });
    } catch (error) {
        console.error("Feil ved søk etter oppskrifter:", error);
        res.status(500).json({ error: "Noe gikk galt ved søk" });
    }
});


export default recipeRouter;
