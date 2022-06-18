const bcrypt = require('bcrypt');
const saltRounds = 10;
const { promise } = require('../../config/database');

const hashPassword = async (Password) => {
    const hashedPassword = await bcrypt.hash (Password, saltRounds)
    return hashedPassword
}

const checkPassword = async (originalPassword, hashedPassword) => {    
    const passwordMatch = await bcrypt.compare(originalPassword, hashedPassword)
    if (passwordMatch==false) {
         return ;
    }else{
    return passwordMatch
}}

module.exports = {
    hashPassword,
    checkPassword
}