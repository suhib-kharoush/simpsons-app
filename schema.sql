CREATE TABLE IF NOT EXISTS simpson(
    id SERIAL PRIMARY KEY,
    quote TEXT,
    character VARCHAR(255),
    image  TEXT,
    characterDirection VARCHAR(255)
);