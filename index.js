const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');

const app = express(); // Create app object

/* Configure handlebars ob */
const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine); // Registrate 'hbs' in app
app.set('view engine', 'hbs'); // Set hbs
app.set('views', 'views') // Set folder with views

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log('Server is running!');
})

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/about', (req, res) => {
    res.render('about');
})