const jwt = require ("jsonwebtoken");
require ("dotenv").config();
const key = process.env.jwt_secret;

//se crea el token, recibe el payload (user) y una medida de tiempo (time) para generar un token con tiempo de expiracion variable, dependiendo de nuestra necesidad
const tokenSign = async( user) => {
     return jwt.sign(user, key, {expiresIn: '15m'})
}
//verificar que el token este firmado por el backend y tambien que no haya expirado
const tokenVerify = async (token) => {
    try {
         return jwt.verify(token,key)
    }catch (error){
        return error;
}};

module.exports = {tokenSign, tokenVerify};
