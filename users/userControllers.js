const databaseConnection=require('../../config/database');
const express = require('express');
const { json } = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const {hashPassword, checkPassword  } = require('../utils/handlePassword');
const { promise } = require('../../config/database');
const { validatorCreateUser, validatorLoginUser,validatorResetPassword } = require('../validators/userValidators');
const fileUpload = require("../utils/handleStorage");
const {tokenSign, tokenVerify} = require('../utils/handleJWT');
const {matchedData} = require('express-validator');
const url = process.env.public_url;
const nodemailer = require('nodemailer');

//arreglar que suba la imagen solo si se crea el usuario antes
const createUser=async (req,res, next)=>{
      const {Username, Email, Password} =req.body;
      const File = url + req.file.filename
        req.body.Password = await hashPassword(req.body.Password)
        databaseConnection.query('INSERT INTO users (Username, Email, Password,File)VALUES(?,?,?,?)',
        [Username, Email, req.body.Password,File],
        (error)=>{
            if(error){
                res.status(400)
                res.send(error)
                console.log(error)
                console.log("Surgio un error en la query createUser")
            }else{
                console.log("Se ha suscripto "+ Username+ " como nuevo usuario")
                res.send("Se ha suscripto "+ Username +" como nuevo usuario")
                next();
}})};

const getAllUsers=(req,res)=>{
    databaseConnection.query(`SELECT * from (users) `,
    (error,data)=>{
        if(error){
            return console.log(error)
        }else{
            res.send(data)
            res.status(200)
            console.log(data)
}})};

const getUserByID = async (req, res,next) => {
    const findID=req.body.ID;
        if (isNaN(Number(findID))) {
            res.status(400)
            console.log("GetUserByID")
            return console.log("ID must be a positive integer")
        }
        databaseConnection.query(`SELECT * FROM users WHERE ID = (?)`,[findID],
        (error,data)=>{
        if(error){
            console.log(error),
            console.log("salio un error"),
            res.status(404)
        }else{
            res.status(200)
            res.send(data)
            console.log(data)
            console.log("GetUserByID")
            next();
}})};

const deleteUserByID = (req, res, next) => {
    const getID=req.body.ID;
    if (isNaN(Number(getID))) {
        res.status(400).json({ message: "ID must be a positive integer" })
        console.log("getUsernameByID")
        return console.log("ID must be a positive integer")
    }
    databaseConnection.query(`DELETE FROM users WHERE ID = (?)`,[getID],
    (error,data)=>{
        if (data==false){
            console.log("No hay usuarios con ese ID")
            res.status("No hay usuarios con ese ID")
            res.status(404)
        }else if(error){
            console.log(error),
            console.log("no se elimino ningun usuario")
            res.status(404)
        }else{
            res.status(200)
            res.send("User "+ [getID]+ " deleted")
            console.log(typeof(data))
            console.log("se elimino un usuario")
            console.log("deleteUserByID")
            next();
}})};

const updateUserByID = async (req,res,next) => {
    const {Username,Email,Password,constID}=req.body;
    const hashedPassword = await hashPassword(Password)
    if (isNaN(Number(constID))) {
        res.status(400).json({ message: "ID must be a positive integer" })
        console.log("updateUserByID")
        return console.log("ID must be a positive integer")
    }
    databaseConnection.query(`UPDATE users SET Username = (?),Email = (?),Password = (?) WHERE ID = (?)`,
    [Username,Email, hashedPassword,constID],(error,data)=>{
        if(error){
            console.log(error)
            console.log("no se actualizo ningun usuario")
            res.status(404)
        }else{
            res.status(200)
            res.send("User "+ [constID]+ " updated")
            console.log((data))
            console.log("se actualizo un usuario")
            console.log("updateUserByID")
            next();
}})};

const loginUser=async (req,res, next)=>{
    const Email = req.body.Email
    const Password = req.body.Password
    console.log("data en crudo", req.body)
    const cleanBody = matchedData(req)
    console.log("data filtrada", cleanBody)
    {databaseConnection.query('SELECT * FROM users WHERE Email = (?)  ', [Email,Password],
    async (error,data) => {
    if(error){
        res.status(500)
        res.send("Hay un error en la query")
        console.log("Hay un error en la query")
        return next();
    } if(!data.length){
        res.status(400)
        res.send("Los datos ingresados no coinciden")
        console.log("Los datos ingresados no coinciden")
        return next();
    }else{
        console.log(data[0].Password)
        {const passMatch = await checkPassword(Password, data[0].Password) 
            if(passMatch!==true ) {
                res.send("las contraseñas no coinciden" )
                console.log("las contraseñas no coinciden")
                next();
            }else{ 
                console.log("Las Passwords coinciden")
                const user={
                    id: data[0].ID,
                    name: data[0].Username,
                    email: req.body.Email,
                    image: data[0].File
                }
                const tokenData ={
                    token: await tokenSign(user, '2h'),
                    user
                };
                res.status(200)
                res.send(`Bienvenido ${user.name}`)
                console.log({Token_info: tokenData })    
}}}})}};

const forgotPassword = async (req, res,next) => {
    const Email = req.body.Email
    console.log("entre al forgotPassword")
    {const dbResponse = databaseConnection.query('SELECT * FROM users WHERE Email = (?)  ', [Email], async (error,data) => {
        if(error){console.log("Sali por el error del forgotPassword", error)}
        if(!data.length){
            console.log("Los datos no corresponden")
            res.status(404)
            res.send("Los datos no corresponden")
            return next();
        }else{
            console.log("esta es la data del forgorPassword", data)
            const user= {
                id:  data[0].ID,
                name:  data[0].Username,
                email: data[0].Email,
            }
const token = await tokenSign(user,"15m")
const link = `${url}reset/${token}`
console.log(link)
const mailDetails = {
    from: "CommonClothes-support@mydomain.com",
    to: user.email,
    subject: "Password recovery from CommonClothes",
    html: `<h2> Password Recovery Service </h2> 
        <p>To reset your password please click on the link and follow the instructions </p>
        <a href= "${link}"> Click to recover your password </a>`
}
transport.sendMail(mailDetails, (error, data) => {
    if(error){
        return next(error);
    }else {
        res.status(200).json({message: `Hi ${user.name}, we've sent an email to ${user.email} you've got 15 minutes to reset your password. Hurry up!`})
}})}})}};

//Reset Password (GET) Mostramos el formulario de recuperacion de contraseña
const reset =async (req, res,next) => {
const token = req.params.token
const tokenStatus = await tokenVerify(req.params.token)
if (tokenStatus instanceof Error){
    res.status(403).json("Invalid or Expired token")
}else{
    res.render("reset.hbs", {token, tokenStatus}) //se le pasa el token como objeto a la pagina de vista para que lo compruebe desde ahi
}};

//Reset Password (POST) Recibe la nueva contraseña desde el formulario de recuperacion de contraseña
const saveNewPass = async (req, res,next) => {
    console.log("Esta OK para guardar la nueva contraseña")
    const {token}= req.params
    const tokenStatus = await tokenVerify(token)
    if(tokenStatus instanceof Error) return next(tokenStatus);
    const newPassword = await hashPassword(req.body.password_1)
    const tokenID = await tokenStatus.id
    {const dbResponse = await databaseConnection.query(`UPDATE users SET Password = (?) WHERE ID = (?)`,
    [newPassword,tokenID],async (error,data)=>{
        if(error){
            console.log(error)
            console.log("no se guardo la nueva password")
            console.log("saveNewPassword")
            res.status(404)
        } else{
            res.status(200)
            res.send(`Usuario ${tokenStatus.name}, a cambiado la contraseña`)
            console.log("se guardo la nueva password")
            console.log("saveNewPassword")
            next();
}})}};

// configurar nodemailer
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.mailtrap_user,
      pass: process.env.mailtrap_pass
}});


module.exports = {
    createUser,
    getAllUsers,
    getUserByID,
    deleteUserByID,
    updateUserByID,
    loginUser,
    forgotPassword,
    reset,
    saveNewPass
}