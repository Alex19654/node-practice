const express = require('express');
const path = require('path');
const exhbs = require('express-handlebars');

const app = express(); // Create app object

/* Add routes */
const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const productsRoutes = require('./routes/products');


/* Configure handlebars ob */
const hbs = exhbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
});

app.engine('hbs', hbs.engine); // Registrate 'hbs' in app
app.set('view engine', 'hbs'); // Set hbs
app.set('views', 'views') // Set folder with views
app.use(express.static('public')) // Add public folder with scripts to express

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
    console.log('Server is running!');
})

/* Registrate added routes with prefixes*/
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/products', productsRoutes);


app.get('/add', (req, res) => {
    
})

app.get('/products', (req, res) => {
    
})