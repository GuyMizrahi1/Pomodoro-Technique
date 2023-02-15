// import + declaration
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const port = 8080;
const sql = require('./database/db');
const CRUD = require('./database/crud_functions');
const route = express.Router();
const stringify = require('csv-stringify').stringify;
const { parse } = require("csv-parse");
const CSVToJSON = require('csvtojson');

// init the app
const app = express();
// parse requests of content type: application/json
app.use(bodyParser.json());
//parse requests of content type: application/x www form urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// set view engine to pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//enable access to css
app.use(express.static(path.join('static'))); 
app.use(express.static('static/fonts'));
app.use(express.static('static/images'));
app.use(express.static('static/ringtone'));
// app.use(express.static('database'));

// home route
app.get('/', (req, res) => {
    res.render('HomeScreen');
});

// ------------------routs for create db-------------------------
// please enter those 4 routs by their order for be able to create
// there is importance for the order cause of the dependencies
app.get('/CreateAcademicFieldsTables',CRUD.CreateAcademicFieldsTables);

app.get("/InsertDataIntoAcademicFields", CRUD.InsertDataIntoAcademicFields);

app.get('/CreatePomodoroClientsTable', CRUD.CreatePomodoroClientsTable);

app.get('/InsertDataIntoPomodoroClients', CRUD.InsertDataIntoPomodoroClients);
// --------------end of creation & insertion -------------------------------

// 2 routs to see the tables
app.get('/ShowLookupTable',CRUD.ShowLookupTable);

app.get("/ShowClientsTable", CRUD.ShowClientsTable);

// 2 routs for dropping the tables by order
// there is importance for dropping cause of the dependencies
app.get('/DropClientsTable', CRUD.DropClientsTable);

app.get('/DropLookupTable', CRUD.DropLookupTable);


// route for create customer
app.post('/custom-your-timer', CRUD.createNewCustomer);

// route for update customer and show the avg if necessery
app.post('/pomodoro-timer', CRUD.updateTimeForCustomer);

// route for signIn
app.post('/my-pomodoro-timer', CRUD.signInToPomodoro);

// rout for who is sure
app.post('/custom-pomodoro-timer', CRUD.UpdateWhenSure)

// set port, listen for requests
app.listen(port, () => {
    console.log('server is runing on port: ' + port);
});