require ("dotenv").config();
const express = require('express');
const app=express();
const hbs = require("express-handlebars")
const routes=require('./routes/routes')
const databaseConnection= require('../config/database');
const path = require('path');

//bootrstrap files acces via static routers
app.use("/css", express.static(path.join(__dirname,"node_modules/bootstrap/dist/css")))
app.use("/js", express.static(path.join(__dirname,"node_modules/bootstrap/dist/js")))

//handlebars setup
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, 'views')) //"./views"
app.engine("hbs", hbs.engine({extname: "hbs"}));

//conexion con MySQL
databaseConnection.connect();

//vamos a recibir info en formato JSON
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//uso de EJS y de archivos publicos
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static("public"))

//rutas
app.use("/CommonClothes",routes);
app.use("/Novedades",routes);
app.use("/SobreNosotros",routes);
app.use("/PagProdBuzos",routes);
app.use("/PagProdRemeras",routes);
app.use("/PagProdPantalones",routes);
app.use("/PagProdZapatillas",routes);
app.use("/posts", require("../Posts/postsRoute"));


app.listen(3000,()=>{
    console.log("Server corriendo en puerto 3000")
});