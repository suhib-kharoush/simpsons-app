// 'use strict'
// // Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// // Environment variables
require('dotenv').config();
// const DATABASE_URL = process.env.DATABASE_URL;

// // Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// // Express middleware
// // Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));


// // Specify a directory for static resources
app.use(express.static('./public'));

// // define our method-override reference
app.use(methodOverride('_method'));

// // Set the view engine for server-side templating
app.set('view engine', 'ejs');

// // Use app cors
app.use(cors());

// // Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// // app routes here
// // -- WRITE YOUR ROUTES HERE --
app.get('/', homePage);
app.post('/favorite-quotes', addToDatabase);
app.get('/favorite-quotes', renderFromDatabase);
app.get('/favorite-quotes/:quote_id', viewDetails);
app.put('/favorite-quotes/:quote_id', updateSimpson);
app.delete('/favorite-quotes/:quote_id', deleteSimpson);


function deleteSimpson(req, res) {
    const id = req.params.quote_id;
    const sql = `DELETE FROM simpson WHERE id=$1;`;
    const safeValues = [id];

    client.query(sql, safeValues).then(() => {
        res.redirect(`/favorite-quotes`)
    })
}





function updateSimpson(req, res) {
    const id = req.params.quote_id;
    const { quote, character, image, characterDirection } = req.body;
    const safeValues = [quote, character, image, characterDirection, id];
    const sql = `UPDATE simpson SET quote=$1, character=$2, image=$3, characterDirection=$4 WHERE id=$5`

    client.query(sql, safeValues).then(() => {
        res.redirect(`/favorite-quotes/${id}`)
    })

}



function viewDetails(req, res) {
    const id = req.params.quote_id;
    const sql = `SELECT * FROM simpson WHERE id=$1;`;
    const safeValues = [id];

    client.query(sql, safeValues).then(results => {
        res.render('pages/details', { simp: results.rows })
    })
}







function renderFromDatabase(req, res) {
    const sql = `SELECT * FROM simpson;`;

    client.query(sql).then(results => {
        res.render('pages/favorites', { simp: results.rows })
    })
}


function addToDatabase(req, res) {
    const sql = `INSERT INTO simpson(quote, character, image, characterDirection) VALUES($1, $2, $3, $4)`;
    const { quote, character, image, characterDirection } = req.body;
    const safeValues = [quote, character, image, characterDirection];

    client.query(sql, safeValues).then(() => {
        res.redirect('/favorite-quotes')
    })
}










function homePage(req, res) {
    const url = `https://thesimpsonsquoteapi.glitch.me/quotes?count=10`;
    superagent.get(url).set('User-Agent', '1.0').then(results => {
        const simpsons = results.body.map(data => {
            return new Simpson(data);
        })
        res.render('pages/home', { simp: simpsons })
    })

}

function Simpson(info) {
    this.quote = info.quote;
    this.character = info.character;
    this.image = info.image;
    this.characterDirection = info.characterDirection;

}

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);