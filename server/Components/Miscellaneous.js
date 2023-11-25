const bcrypt = require('bcrypt');
const JwtSecretKey = 'ReaCtNodeAssignmentTask';       //  user define key, It is a secret key.
const Jwt = require('jsonwebtoken');


async function bcryptPassword (password)
{
    const saltRound = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, saltRound);
    return hashPassword;
}


async function bcryptPasswordCompare (password, dbPassword)
{
    const compareStatus = await bcrypt.compare(password, dbPassword);
    return compareStatus;
}

const jsonTokenVerify = async (req, res, next) => {
    const token = req.header('authorization').replace('Bearer ','');
    try {
        req.user = await Jwt.verify(token, JwtSecretKey);
        next();  }
    catch (error) {
        return res.status(401).json({'msg': 'Invalid token'});  }
}









module.exports = {
    bcryptPassword,
    bcryptPasswordCompare,
    jsonTokenVerify,
    JwtSecretKey
}