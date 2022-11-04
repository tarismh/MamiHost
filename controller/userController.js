const {
    resSuccessHandler,
    resErrorHandler
} = require('../exception/resHandler')
const { User } = require('../models')
const bcrypt = require("bcrypt");
const ClientError = require('../exception/clientError');
require('dotenv').config();

const getAllUsers = async (req, res) => {
    try{
        const getAll = await User.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
        });

        resSuccessHandler(res, getAll, "success");
    }
    catch(err){
        resErrorHandler(res, err);
    }
}
const register = async (req, res) => {
    try{
        const {
            email,
            username,
            password,

        } = req.body;
        const validateUsername = await User.findOne({
            where: {username: req.body.username}
        });
        const validateEmail = await User.findOne({
            where: {email: req.body.email}
        });
        if(validateEmail != null)
        {
            throw new ClientError("Email Sudah Terdaftar Silahkan daftarkan email lain")
        }
        else
        {
            if(validateUsername != null)
            {
                throw new ClientError("Username Sudah Terdaftar Silahkan Masukkan Username Lain")
            }
            else
            {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
                const insert = await User.create ({
                    email,
                    password: hashedPassword,
                    username
                })
                resSuccessHandler(res, insert, "success");
            }
        }
    }
    catch(err){
        resErrorHandler(res, err);
    }
};

module.exports = {getAllUsers, register};