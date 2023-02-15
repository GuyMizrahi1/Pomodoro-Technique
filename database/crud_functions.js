const { request } = require('express');
const sql = require('./db.js');
const path = require('path');
const csv = require('csvtojson');
const { Console } = require('console');
var user_email;
var acd_input;
var GPA;
var work;
var short_break;
var long_break;
var avg_work1;
var avg_short_break1;
var avg_long_break1;

// pomodoro_clients_db
// AcademicFields

const CreateAcademicFieldsTables = (req,res)=> {
    var Q1 = "CREATE TABLE IF NOT EXISTS AcademicFields(academic_field_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, academic_field varchar (50) NOT NULL);";
    sql.query(Q1,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating academic fields table"});
            return;
        }
        console.log('academic fields table created');
        res.send("academic fields table created");
        return;
    })      
}

const InsertDataIntoAcademicFields = (req,res)=>{
    var Q2 = "INSERT INTO AcademicFields SET ?";
    const csvFilePath= path.join(__dirname, "./academic_fields.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "academic_field_id": element.academic_field_id,
            "academic_field": element.academic_field
        }
        sql.query(Q2, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data", err);
            }
            // console.log("created row sucssefuly ");
        });
    });
    })
    res.send("academic_fields has been read");
};


const CreatePomodoroClientsTable = (req,res)=> {
    var Q3 = "CREATE TABLE IF NOT EXISTS PomodoroClients(email varchar(50) NOT NULL PRIMARY KEY, password varchar (50) NOT NULL, academic_field_id INT NOT NULL, GPA INT NOT NULL, work INT, short_break INT, long_break INT,  INDEX (academic_field_id), FOREIGN KEY (academic_field_id) REFERENCES AcademicFields (academic_field_id));";
    sql.query(Q3,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating PomodoroClients table"});
            return;
        }
        console.log('PomodoroClients table created');
        res.send("PomodoroClients table created");
        return;
    })      
}


const InsertDataIntoPomodoroClients = (req,res)=>{
    var Q4 = "INSERT INTO PomodoroClients SET ?";
    const csvFilePath= path.join(__dirname, "./pomodoro_clients_db.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    console.log(jsonObj);
    jsonObj.forEach(element => {
        var NewEntry = {
            "email": element.email,
            "password": element.password,
            "academic_field_id": element.academic_field_id,
            "GPA": element.GPA,
            "work": element.work,
            "short_break": element.short_break,
            "long_break": element.long_break
        }
        sql.query(Q4, NewEntry, (err,mysqlres)=>{
            if (err) {
                console.log("error in inserting data Into Pomodoro Clients", err);
            }
            // console.log("created row sucssefuly ");
        });
    });
    })
    res.send("PomodoroClients data read");
};



const ShowLookupTable = (req,res)=>{
    var Q5 = "SELECT * FROM AcademicFields";
    sql.query(Q5, (err, mysqlres)=>{
        if (err) {
            console.log("error in showing table AcademicFields ", err);
            res.send("error in showing table AcademicFields ");
            return;
        }
        console.log("showing AcademicFields table");
        res.send(mysqlres);
        return;
    })};



const ShowClientsTable = (req,res)=>{
    var Q6 = "SELECT * FROM PomodoroClients";
    sql.query(Q6, (err, mysqlres)=>{
        if (err) {
            console.log("error in showing table PomodoroClients", err);
            res.send("error in showing table PomodoroClients");
            return;
        }
        console.log("showing PomodoroClients table");
        res.send(mysqlres);
        return;
    })};

const DropLookupTable = (req, res)=>{
    var Q7 = "DROP TABLE AcademicFields";
    sql.query(Q7, (err, mysqlres)=>{
        if (err) {
            console.log("error in droping AcademicFields table ", err);
            res.status(400).send({message: "error om dropping AcademicFields table" + err});
            return;
        }
        console.log("table AcademicFields droped");
        res.send("table AcademicFields droped");
        return;
    })
}

const DropClientsTable = (req, res)=>{
    var Q8 = "DROP TABLE PomodoroClients";
    sql.query(Q8, (err, mysqlres)=>{
        if (err) {
            console.log("error in droping PomodoroClients table ", err);
            res.status(400).send({message: "error om dropping PomodoroClients table" + err});
            return;
        }
        console.log("table PomodoroClients droped");
        res.send("table PomodoroClients droped");
        return;
    })
}




// create a new customer
const createNewCustomer = function (req,res){
    console.log("Created customer: first", {email:req.body.su_email, password:req.body.su_psw, academic_field_id: req.body.acd, GPA:req.body.GPA});
    // validate request
    if (!req.body){
        console.log("couldn't create customer: ", {email:req.body.su_email, password:req.body.su_psw, academic_field_id: req.body.acd, GPA:req.body.GPA});
        res.status(400).send({message: "content can not be empty!"});
        return;
    }
    // query of create customer
    user_email = req.body.su_email;
    // acd_name = req.body.acd;
    GPA = req.body.GPA;
    sql.query("SELECT academic_field_id FROM AcademicFields WHERE academic_field = '" + req.body.acd +"'", (err, mysqlres) =>{
        acd_input =  mysqlres[0].academic_field_id;
        sql.query("INSERT INTO PomodoroClients (email,password,academic_field_id,GPA) Values (?,?,?,?)",[req.body.su_email, req.body.su_psw, acd_input, req.body.GPA], (err, mysqlres) =>{
            if(acd_input == 0){
                console.log("Error: ", err);
                res.status(400).send({message: "Error by creating customer, check academic field form " + err});
                return;
            }
            console.log("customer has created successfully: ", {email:req.body.su_email, password:req.body.su_psw, academic_field_id: acd_input, GPA:req.body.GPA});
            // res.sendFile(path.join(__dirname, './views/HomeScreen_StartNow.pug'));
            res.render('HomeScreen_StartNow');
            return;
        });
    });
};



const updateTimeForCustomer = (req, res) => {
    work = req.body.work;
    short_break = req.body.short_b;
    long_break = req.body.long_b;
    // validate request
    if (!req.body){
        console.log("couldn't create customer: ", {email: user_email, work: work, short_b: short_break, long_b: long_break});
        res.status(400).send({message: "content can not be empty!"});
        return;
    }
    sql.query("UPDATE PomodoroClients SET work=? , short_break=?, long_break=? WHERE email = '" + user_email +"'",[work, short_break, long_break], (err, mysqlres) =>{
        if(work == 0 || short_break == 0 || long_break == 0){
            console.log("Error: ", err);
            res.status(400).send({message: "Error by setting the timer, check work form " + err});
            return;
        }
        sql.query("SELECT round(avg(work)) as avg_work, round(avg(short_break)) as avg_short_break, round(avg(long_break)) as avg_long_break  FROM PomodoroClients  WHERE academic_field_id = '" + acd_input +"' AND GPA >= 90 GROUP BY academic_field_id", (err, mysqlres) =>{
            if (err){
                console.log("error in get AVG ", err);
                res.send("error in showing table ");
                return;
            }
            if (GPA < 90 ){
                console.log(mysqlres[0]);
                if(mysqlres[0] != null){
                    avg_work1 = mysqlres[0].avg_work;
                    avg_short_break1 = mysqlres[0].avg_short_break;
                    avg_long_break1 = mysqlres[0].avg_long_break;
                    console.log(GPA + "MY GPA");
                    console.log(" work: " + mysqlres[0].avg_work);
                    console.log(" short_break: " + mysqlres[0].avg_short_break);
                    console.log(" long_break: " + mysqlres[0].avg_long_break);
                    console.log("work_time is: " + work +
                     ", short_break_time is:"+ short_break +
                     ", long_break_time is:" + long_break);

                    if(avg_work1 > increment(work) || avg_work1 < decrement(work) || 
                        avg_short_break1 > increment(short_break) || avg_short_break1 < decrement(short_break) ||
                        avg_long_break1 > increment(long_break) || avg_long_break1 < decrement(long_break) ){
                        
                        sql.query("SELECT academic_field FROM AcademicFields WHERE academic_field_id = '" + acd_input +"'", (err, mysqlres) =>{
                            res.render('HomeScreen_AreYouSure', {avg_work: avg_work1, avg_short_break: avg_short_break1, avg_long_break: avg_long_break1, 
                                work: work, short_break: short_break, long_break: long_break, acd_input: mysqlres[0].academic_field});
                            });
                    }else{
                        res.render('Pomodoro_Timer', {work: work, short_break: short_break, long_break: long_break});
                    }
                }else{
                    res.render('Pomodoro_Timer', {work: work, short_break: short_break, long_break: long_break});
                }
            }else{
                res.render('Pomodoro_Timer', {work: work, short_break: short_break, long_break: long_break});
            }
            return;
        })
        return;
    });
}

function increment (num){
    return Number(num) + 1;
}

function decrement (num){
    return Number(num) - 1;
}



const signInToPomodoro = (req, res) => {
    console.log("trying to sign in for customer: ", {email:req.body.si_email, password:req.body.si_psw});
    // validate request
    if (!req.body){
        console.log("couldn't find customer: ", {email:req.body.si_email, password:req.body.si_psw});
        res.status(400).send({message: "content can not be empty!"});
        return;
    }
    // query of signIn customer
    user_email = req.body.si_email;
    user_psw = req.body.si_psw;
    console.log(user_email +'-----------');
    sql.query("SELECT * FROM PomodoroClients  WHERE email = '" + user_email +"' AND password = '"+ user_psw +"'",[req.body.si_email, req.body.si_psw], (err, mysqlres) =>{
        if(mysqlres[0] == null){
            console.log("Error: ", err);
            res.status(400).send({message: "Error by signIn customer, check mail and password"});
            return;
        }
        if(mysqlres[0].work == null){
            res.render('HomeScreen_StartNow');
            return;
        }
        GPA = mysqlres[0].GPA;
        acd_input = mysqlres[0].academic_field_id;
        console.log(mysqlres[0]);
        console.log("customer found successfully: ", {email:req.body.si_email, password:req.body.si_psw, work: mysqlres[0].work, short_break: mysqlres[0].short_break, long_break: mysqlres[0].long_break});
        res.render('Pomodoro_Timer', {work: mysqlres[0].work, short_break: mysqlres[0].short_break, long_break: mysqlres[0].long_break});
        return;
    });
}



// update the elements from are you sure
const UpdateWhenSure = (req, res) => {
    let pressed_button =  req.body.choice_button;
    console.log("pressed_button is -> " + pressed_button);
    if (pressed_button == "change"){
        sql.query("UPDATE PomodoroClients SET work=? , short_break=?, long_break=? WHERE email = '" + user_email +"'",[avg_work1, avg_short_break1, avg_long_break1], (err, mysqlres) =>{
            console.log("111111111update 1 to -> " + avg_work1 + ", " + avg_short_break1 + ", " + avg_long_break1);
            res.render('Pomodoro_Timer', {work: avg_work1, short_break: avg_short_break1, long_break: avg_long_break1});
            return;
        });
    }else{
        sql.query("UPDATE PomodoroClients SET work=? , short_break=?, long_break=? WHERE email = '" + user_email +"'",[work, short_break, long_break], (err, mysqlres) =>{
            console.log("update 2 to -> " + work + ", " + short_break + ", " + long_break);
            res.render('Pomodoro_Timer', {work: work, short_break: short_break, long_break: long_break});
            return;
        });
    }
};

module.exports = {CreateAcademicFieldsTables, InsertDataIntoAcademicFields, CreatePomodoroClientsTable, InsertDataIntoPomodoroClients, ShowLookupTable, ShowClientsTable, DropLookupTable, DropClientsTable,createNewCustomer, updateTimeForCustomer, signInToPomodoro, UpdateWhenSure};
