-- Opprettelse av recipes-tabell i PostgreSQL
CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    ingredients TEXT[] NOT NULL,
    instructions TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sett inn noen eksempeldata (kan fjernes senere)
INSERT INTO recipes (name, ingredients, instructions) VALUES
('Super Pannekaker', ARRAY['Egg', 'Mel', 'Melk', 'Vaniljesukker'], 'Bland alt og stek i en panne.'),
('Pizza', ARRAY['Mel', 'Vann', 'Gjær', 'Tomatsaus', 'Ost'], 'Lag deigen, ha på fyll, stek i ovnen.'),
('Lasagne', ARRAY['Pasta', 'Kjøttdeig', 'Tomatsaus', 'Ost'], 'Bygg lagvis og stek i ovnen.');
