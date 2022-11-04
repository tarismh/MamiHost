const ClientError = require('../exception/clientError');
const {
    resSuccessHandler,
    resErrorHandler
} = require('../exception/resHandler');
const { HostedService, User } = require('../models');
const bcrypt = require("bcrypt");
require('dotenv').config();

const createService = async (req, res) => {
    try{
        const {
            user_email,
            duration,
            service_username,
            service_password,
            service_type,
            service_image,
            db_dialect,
        } = req.body;
        const validateUser = await User.findOne({
            where: {
                email: req.body.user_email
            }
        });
        if(!validateUser){
            throw new ClientError("Daftarkan Email Terlebih Dahulu Email Anda Pada Aplikasi Kami");
        }

        else{
            /***
            * Block Code For Kubernetes Automation
            */
            let date = new Date();
            let selesai = new Date();
            selesai.setDate(date.getDate() + req.body.duration);
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.service_password, saltRounds);
            const usernames = req.body.sercice_username;
            // console.log(usernames);
            const insertService = await HostedService.create({
                user_email: req.body.user_email,
                duration: req.body.duration,
                service_username: req.body.service_username,
                service_password: hashedPassword,
                service_type: req.body.service_type,
                service_ip: '0.0.0.0',
                service_port: '5000',
                service_started: date,
                service_ended: selesai,
                service_OS: "Ubuntu Version 20",
                service_image: req.body.service_image,
                db_dialect: req.body.db_dialect,
            });

            resSuccessHandler(res, insertService, "success");
        }
    }
    catch(err){
        resErrorHandler(res, err);
    }
}

const clientDashboard = async(req,res) => {
    try{
        const userEmail = req.params.email;
        if(!userEmail){
            throw new ClientError("Insert User Email");
        }
        const getClientService = await HostedService.findAll({
            where: {
                user_email: userEmail
            },
            order: [
                ['service_type', 'ASC']
            ]
        });
        
        if(getClientService.length === 0)
        {
            throw new ClientError("Anda Belum Pernah Melakukan Hosting Menggunakan Layanan Kami.");
            
        }
        else
        {
            return resSuccessHandler(res, getClientService, "success");
        }

    }
    catch(err){
        return resErrorHandler(res, err);
    }
}


module.exports = {createService, clientDashboard};