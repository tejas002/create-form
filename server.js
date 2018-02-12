const express = require('express')
const hbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const path = require('path');

const morgan = require('morgan');
const app = express()

app.use(express.static(__dirname + '/views'))
app.use('/assets', express.static('views'))

app.engine('handlebars', hbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// middleware configs
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(morgan('dev'))

const routes = require('./routes')(app);

// define port
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('The application is up and running on port ', port)
})