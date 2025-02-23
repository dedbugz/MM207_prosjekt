import express from "express";
import fs from "fs/promises";

const recipeRouter = express.Router();
const filePath = "./data/recipes.json";

// Hent alle oppskrifter
recipeRouter.get("/", async (req, res) => {
    const data = await fs.readFile(filePath, "utf-8");
    res.json(JSON.parse(data));
});

// Legg til en ny oppskrift
recipeRouter.post("/", async (req, res) => {
    const newRecipe = req.body;
    const data = JSON.parse(await fs.readFile(filePath, "utf-8"));
    newRecipe.id = (data.length + 1).toString();
    data.push(newRecipe);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    res.status(201).json(newRecipe);
});

// Oppdater en oppskrift
recipeRouter.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedRecipe = req.body;
    let data = JSON.parse(await fs.readFile(filePath, "utf-8"));
    
    const index = data.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ error: "Recipe not found" });

    data[index] = { ...data[index], ...updatedRecipe };
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
