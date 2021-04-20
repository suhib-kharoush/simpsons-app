CREATE TABLE IF NOT EXISTS simpson(
    quote_id SERIAL PRIMARY KEY,
    quote VARCHAR(255),
    character VARCHAR(255),
    image  varchar(55) NOT NULL,
    characterDirection VARCHAR(255)
)