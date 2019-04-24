var express = require("express");
var app = express();
var ejsLayouts = require("express-ejs-layouts");
app.use(ejsLayouts);
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/static"));
var db = require("./models");
var Hashids = require('hashids');
var hashids = new Hashids();
var nextId;  //next available id in hash table
var validator = require("validator");

app.get("/",function(req,res) {
    if (!nextId) {
        console.log("NextId not yet inititalized. Initializing...");
        db.links.max("id").then(function(max) {
            if (max) {
                nextId = max + 1;
                console.log("Entries found. NextId: " + nextId);
            } else {
                nextId = 1;
                console.log("No entries. NextId: " + nextId);
            }
        });
    }
    res.render("index.ejs",{message:""});
});

app.post("/links",function(req,res) {
    var hash = hashids.encode(nextId++);
    console.log("Form data:");
    console.log(req.body.longURL);
    console.log("Hash:");
    console.log(hash);
    if (validator.isURL(req.body.longURL, {require_protocol: true})) {
        db.links.create({url:req.body.longURL, hash:hash})
            .then(function(link){
                console.log("Added URL to Database");
                res.redirect("/links/" + link.id);
            });
    } else {
        console.log("Error: Not a valid URL");
        res.render("index.ejs",{message:"Oops. You need to enter a valid URL with protocol. E.g. http://www.example.com"});
    }
    
});

app.get("/links/:id",function(req,res) {
    db.links.findOne({where: {id:req.params.id}}).then(function(link) {
        if (link) {
            console.log("Entry found: ");
            console.log(link.url);
            console.log(link.hash);
            res.render("show.ejs",{longURL:link.url,shortURL:"/" + link.hash});
        } else {    //entry not found
            res.render("show.ejs",{longURL:"entry not found",shortURL:"entry not found"});
        }
    });
});

app.get("/:hash", function(req,res) {
    db.links.findOne({where: {hash:req.params.hash}}).then(function(link) {
        if (link) {
            console.log("Entry found. Directing to:");
            console.log(link.url);
            res.redirect(link.url);
        } else {
            res.send("Sorry link not found");
        }
    });
});

app.listen(3000);