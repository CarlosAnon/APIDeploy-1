const express = require('express');

/*hacer el ruteo, decir el recorrido que tiene que hacer al recibir una peticion*/
const routes=express.Router();

const {
    renderHome,
    renderSobreNosotros,
    renderNovedades,
    renderPagProdBuzos,
    renderPagProdPantalones,
    renderPagProdRemeras,
    renderPagProdZapatillas,
    getAllBuzos,
    getAllRemeras,
    getAllPantalones,
    getAllZapatillas,
    getForm,
    addnewSuscrip

} =require('../controllers/controllers')

//userControllers
const {
     createUser,
     getAllUsers,
     getUserByID,
     deleteUserByID,
     updateUserByID,
     loginUser,
     forgotPassword,
     reset,
     saveNewPass
} =require('../users/userControllers')

const { 
    validatorCreateUser,
    validatorLoginUser,
    validatorResetPassword
 } = require('../validators/userValidators');

const fileUpload = require("../utils/handleStorage");

routes.get("/pages/Index2",renderHome);
routes.get("/",(req,res)=>{
    res.render("pages/Index2")});
     
routes.get("pages/SobreNosotros",renderSobreNosotros);
routes.get("/SobreNosotros",(req,res)=>{
    res.render("pages/SobreNosotros")});

routes.get("/pages/Novedades",renderNovedades);
routes.get('/Novedades', function(req, res) {
    res.render('pages/Novedades');
});
routes.get("/Novedades",getForm);
routes.post("/Novedades", addnewSuscrip);

routes.get("pages/PagProdBuzos",renderPagProdBuzos);
routes.get("/PagProdBuzos",getAllBuzos);

routes.get("pages/PagProdPantalones",renderPagProdPantalones);
routes.get("/PagProdPantalones",getAllPantalones);

 routes.get("pages/PagProdRemeras",renderPagProdRemeras);
 routes.get("/PagProdRemeras",getAllRemeras);

routes.get("pages/PagProdZapatillas",renderPagProdZapatillas);
routes.get("/PagProdZapatillas",getAllZapatillas);

//Users routes
routes.post("/users",fileUpload.single("File"),validatorCreateUser, createUser);
routes.get("/users", getAllUsers);
routes.get("/:ID", getUserByID);
routes.delete("/:ID", deleteUserByID);
routes.patch("/:constID", updateUserByID);
routes.post("/login",validatorLoginUser, loginUser);
routes.post("/forgotPassword", forgotPassword);
routes.get("/reset/:token", reset);
routes.post("/reset/:token",validatorResetPassword,  saveNewPass);//recibimos la nueva contraseña desde el formulario

module.exports=routes;