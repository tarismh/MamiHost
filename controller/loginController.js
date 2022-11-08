const jwt = require('jsonwebtoken');
const {
    resSuccessHandler,
    resErrorHandler
} = require('../exception/resHandler');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const ClientError = require('../exception/clientError');
const { or } = require('sequelize');
require('dotenv').config();

const userLogin = async(req, res) => {
    try{
        const {
            username,
            password,
        } = req.body;
        const userCheck = await User.findOne({
            where: {
                username: req.body.username
            }
        });
        if(!userCheck)
        {
            const hashedCompare = await bcrypt.compare(req.body.password, userCheck.password)
            if(hashedCompare)
            {
                const accessToken = generateAccessToken(userCheck.username);
                res.json({status: "success", accessToken: accessToken, user: userCheck});
            }
            else
            {
                throw new ClientError("Password yang anda masukkan salah");
            }
        }
        else
        {
            throw new ClientError("Email atau Username Tidak Terdaftar");
        }
    }
    catch(err){
        return resErrorHandler(res, err);
    }
};

function generateAccessToken (user) {
    const generatedToken =  jwt.sign({user}, process.env.ACCESS_TOKEN_KEY);
    // console.log(generateAccessToken);
    return generatedToken;
}

module.exports = {userLogin};