import express from "express";
import fs from "fs/promises";

const recipeRouter = express.Router();
const filePath = "./data/recipes.json";

// Hent alle oppskrifter
recipeRouter.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Kunne ikke hente oppskrifter' });
    }
});

// Legg til en ny oppskrift
recipeRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedRecipe = req.body;
    let data = JSON.parse(await fs.readFile(filePath, "utf-8"));
   
    const index = data.recipes.findIndex(r => r.id == id);
    if (index === -1) return res.status(404).json({ error: "Recipe not found" });

    data.recipes[index] = { ...data.recipes[index], ...updatedRecipe, id: data.recipes[index].id };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    res.json(data.recipes[index]);
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

    data = data.filter(r => r.id !== id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    res.status(204).end();
});



export default recipeRouter;
