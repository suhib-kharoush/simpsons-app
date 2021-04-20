'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');

// Environment variables
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));


// Specify a directory for static resources
app.use(express.static('./public'));

// define our method-override reference
app.use(methodOverride('_method'));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');

// Use app cors
app.use(cors);

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --
app.get('/', homePage);
app.post('/getQoute', handleQoute);
app.post('/favorite-quotes', addToFavorite);
app.get('/favorite-quotes', handleFavorite);
app.post('/favorite-quotes/:quote_id', handleDetails)
app.get('/favorite-quotes/:quote_id', Details)
app.delete('/favorite-quotes/:quote_id', deleteHandler)
app.put('/favorite-quotes/:quote_id', updateCharacter)



// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --


function updateCharacter(req, res) {
    let SQL = `UPDATE simpson SET WHERE id=${req.body.quote_id}`
    client.query(SQL)
        .then(result => {
            res.render('pages/showDetails', { DATA: result.rows[0] })
        })
}




function deleteHandler(req, res) {
    let SQL = `DELETE FROM simpson WHERE id=${req.params.quote_id}`
    client.query(SQL)
        .then(() => {
            res.redirect('/favorite-quotes')
        })
}

function Details(req, res) {
    let SQL = `SELECT * FROM simpson WHERE id=${req.params.quote_id}`
    client.query(SQL)
        .then(result => {
            res.render('pages/showDetails', { DATA: result.rows[0] })
        })
}

function handleDetails(req, res) {
    res.redirect(`/favorite-quotes/${req.params.quote_id}`)
}





function handleFavorite(req, res) {
    let SQL = `SELECT * FROM simpson;`
    client.query(SQL)
        .then(result => {
            res.render('pages/myFav', { DATA: result.rows });
        })
}





function addToFavorite(req, res) {
    let SQL = `INSERT INTO simpson(quote, character, image, characterDirection) VALUES($1, $2, $3, $4)`
    let { quote, character, image, characterDirection } = req.body;
    let safevalues = [quote, character, image, characterDirection];
    client.query(SQL, safevalues)
        .then(() => {
            res.redirect('/favorite-quotes')
        })




}


function handleQoute(req, res) {
    let form = rq.body.search;
    let url = `https://thesimpsonsquoteapi.glitch.me/${form}`
    superagent.get(url)
        .then(result => {
            res.render('pages/getQoute', { DATA: result.body })
        })
}


function homePage(req, res) {
    let url = `https://thesimpsonsquoteapi.glitch.me/quotes?count=10`
    superagent.get(url)
        .then(result => {
            let simpArr = result.body.map(val => {
                return new Simpson(val)
            })
            res.render('pages/home', { DATA: simpArr })
        })
}


function Simpson(data) {
    this.quote = data.quote;
    this.character = data.character;
    this.image = data.image;
    this.characterDirection = data.characterDirection
}



// helper functions

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);