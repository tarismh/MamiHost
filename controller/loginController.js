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
            usernameOrEmail,
            password,
        } = req.body;
        if(!req.body.username)
        {
            const userCheck = await User.findOne({
                where: {email: req.body.email}
            });
            if(!userCheck){
                throw new ClientError("Email Tidak Terdaftar");
            }
            else{
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
        }
        else if(!req.body.email)
        {
            {
                const userCheck = await User.findOne({
                    where: {username: req.body.username}
                });
                if(!userCheck){
                    throw new ClientError("Username Tidak Terdaftar");
                }
                else{
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
            }
        }
        else
        {
            throw new ClientError("Gunakan Username atau Email saja (salah satu)");
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