const express = require("express");
const mysql = require("mysql");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static("public"));


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'db_final'
});

con.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Database connected");
    }
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) =>{
    const id = req.body.id;
    const name = req.body.name;
    const rollNo = req.body.rollNo;
    const marks = req.body.marks;

    con.query('INSERT INTO tbl_final VALUES (?, ?, ?, ?)', [id, name, rollNo, marks], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send("POSTED");
        }
    });
});

app.get('/show', (req, res) => {
    con.query('SELECT * FROM tbl_final', (err, result, field) => {
        if (err) {
            console.log(err);
        }
        else {
            const final_result = JSON.stringify(result);
            console.log(result)
            console.log(final_result)
            fs.writeFile(__dirname + "/filename.json", final_result, (err) => {
                if(err) {
                    console.log(err);
                }
                else{
                    res.send(result);
                    console.log(result);
                }
            });
        }
    });
});


app.get("/showTable", (req, res) => {
    var htmlText = "";

    con.query('SELECT * FROM tbl_final', (err, result, field) => {
        var tableHtml = "<h1> Table Content </h1>";

        tableHtml += "<table style=\"width: 50vh; text-align:center; border: 1px solid black; border-collapse: collapse;\">"

        tableHtml += "<thead style=\"background-color: burlywood\">";
        tableHtml += "<tr><th>Id</th><th>Name</th><th>Roll No</th><th>Marks</th></tr>";
        tableHtml += "</thead>";
        tableHtml += "<tbody style=\"border: 1px solid black; border-collapse: collapse; background-color: lightgrey\">";

        for (var i = 0; i < result.length; i++) {
            tableHtml += "<tr>";
            tableHtml += "<td>" + result[i].id + "</td>";
            tableHtml += "<td>" + result[i].name + "</td>";
            tableHtml += "<td>" + result[i].rollNo + "</td>";
            tableHtml += "<td>" + result[i].marks + "</td>";
            tableHtml += "</tr>";
        }
        tableHtml += "</tbody>";
        tableHtml += "</table>";
        res.header("Content-type", "text/html");
        res.send(tableHtml);
    })
})

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Server running on port 3000");
    }
})