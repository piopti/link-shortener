var express = require("express");
var app = express();
var ejsLayouts = require("express-ejs-layouts");
app.use(ejsLayouts);
app.set("view engine","ejs");
app.use(express.static(__dirname + "/static"));

app.get("/",function(req,res) {
    res.render("index.ejs");
});

app.post("/links",function(req,res) {
    var id = -1;
    res.redirect("/links/" + id);
});

app.get("/links/:id",function(req,res) {
    res.render("show.ejs");
});

app.get("/:hash", function(req,res) {
    res.redirect("/index.ejs");
});

app.listen(3000);