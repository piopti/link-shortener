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
var curId = 1;

app.get("/",function(req,res) {
    res.render("index.ejs");
});

app.post("/links",function(req,res) {
    var hash = hashids.encode(curId++);
    console.log("Form data:");
    console.log(req.body.longURL);
    console.log("Hash:");
    console.log(hash);
    db.links.create({url:req.body.longURL, hash:hash})
        .then(function(link){
            console.log("Added URL to Database");
            res.redirect("/links/" + link.id);
        });
    
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