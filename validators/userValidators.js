const { check, validationResult } = require('express-validator');

const validatorCreateUser=[
    check("Username")
        .exists().withMessage("Username field is required")
        .trim()
        .isAlphanumeric('es-ES',{ignore:(' ')})
        .isLength({min:2, max:90}).withMessage("Character count is min 2 - max 90"),
    check("Email")
        .exists().withMessage("Email field is required")
        .isEmail().withMessage("Must be a valid Email address")
        .normalizeEmail(),
    check("Password")
        .exists().withMessage("Password field is required")
        .trim()
        .isLength({min:8}).withMessage("Password must be 8 character long"),
    check("File"),
    (req,res,next) => {
        //averiguamos si hay errores en la request y los envolvemos en un objeto que tiene varias funciones utiles en
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errores:errors.array()})
    }else{
        next()
}}];  
    
const validatorLoginUser=[
    check("Email")
        .exists().withMessage("Email field is required")
        .isEmail().withMessage("Must be a valid Email address")
        .normalizeEmail(),
    check("Password")
        .exists().withMessage("Password field is required")
        .trim()
        .isLength({min:8}).withMessage("Password must be 8 character long"),
    (req,res,next) => {
        //averiguamos si hay errores en la request y los envolvemos en un objeto que tiene varias funciones utiles en
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errores:errors.array()})
    }else{
        next()
}}];  

const validatorResetPassword=[
    check("password_1")
        .exists().withMessage("Password 1 field is required")
        .trim()
        .isLength({min:8}).withMessage("Password 1 must be 8 character long"),
    check("password_2")
        .exists().withMessage("Password 2 field is required")
        .trim()
        .isLength({min:8}).withMessage("Password 2 must be 8 character long")
        .custom(async(password_2, {req}) =>{
            if(req.body.password_1 !== password_2){
                throw new Error("Both passwords must be identical")
            }}),
        (req,res,next) =>{
            const {token} = req.params
            const errors = validationResult(req)
                if(!errors.isEmpty()){
                    const errorWarnings = errors .array()
                    res.render("reset.hbs", {errorWarnings, token})
                    console.log("Salio un error y renderice denuevo")
                    console.log("este es el errorWarnings", errorWarnings)
                }else{
                    console.log("Sali por el else esta todo ok")
                    return next();
}}];  

module.exports = {validatorCreateUser, validatorLoginUser,validatorResetPassword};