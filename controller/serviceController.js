const ClientError = require('../exception/clientError');
const {
    resSuccessHandler,
    resErrorHandler
} = require('../exception/resHandler');
const { HostedService, User } = require('../models');
const bcrypt = require("bcrypt");
const http = require('node:http');
const https = require('https');
const axios = require('axios');
require('dotenv').config();

const createService = async (req, res) => {
    try{
        const {
            user_email,
            duration,
            service_type,
            service_image,
            git_repository,
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
            const randomizedName = validateUser.username+'-'+makeName(6);
            let date = new Date();
            let selesai = new Date();
            if(req.body.service_type === "DB")
            {
                const podName = 'db' + '-' + randomizedName;
                const postData = JSON.stringify({
                    "apiVersion": "v1",
                    "kind": "Pod",
                    "metadata": {
                      "name": podName
                    },
                    "spec": {
                      "hostNetwork": false,
                      "containers": [
                        {
                          "command": [
                            "sleep",
                            "infinity"
                          ],
                          "image": req.body.db_dialect,
                          "name": req.body.db_dialect,
                        }
                      ]
                    }
                });
                const axiosConfig = {
                    method: 'post',
                    url: process.env.KUBE_LINK,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.KUBE_TOKEN}`
                    },
                    data: postData
                }
                console.log(axiosConfig);
                const buildImage = await axios(axiosConfig);
                console.log(buildImage);
                if(buildImage.status == 200 || buildImage.statusText == 'Created')
                {
                    selesai.setDate(date.getDate() + req.body.duration);
                    const insertService = await HostedService.create({
                        user_email: req.body.user_email,
                        duration: req.body.duration,
                        service_type: req.body.service_type,
                        service_image: req.body.service_image,
                        git_repository: req.body.git_repository,
                        service_started: date,
                        pod_name: podName,
                        service_ended: selesai,
                        db_dialect: req.body.db_dialect,
                    });
                    resSuccessHandler(res, insertService, "success");
                }
                else
                {
                    throw new ClientError("Proses Pembuatan Container Gagal");
                }
            }
            else if(req.body.service_type === "WB")
            {
                const podName = 'wb' + '-' + randomizedName
                const postData = JSON.stringify({
                    "apiVersion": "v1",
                    "kind": "Pod",
                    "metadata": {
                      "name": podName
                    },
                    "spec": {
                      "hostNetwork": false,
                      "containers": [
                        {
                          "command": [
                            "sleep",
                            "infinity"
                          ],
                          "image": req.body.service_image,
                          "name": req.body.service_image
                        }
                      ]
                    }
                });
    
                const axiosConfig = {
                    method: 'post',
                    url: process.env.KUBE_LINK,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.KUBE_TOKEN}`
                    },
                    data: postData
                }
                console.log(axiosConfig);

                const buildImage = await axios(axiosConfig);
                console.log(buildImage);
                if(buildImage.status == 200 || buildImage.statusText == 'Created')
                {
                    selesai.setDate(date.getDate() + req.body.duration);
                    const insertService = await HostedService.create({
                        user_email: req.body.user_email,
                        duration: req.body.duration,
                        service_type: req.body.service_type,
                        service_image: req.body.service_image,
                        git_repository: req.body.git_repository,
                        pod_name: podName,
                        service_started: date,
                        service_ended: selesai,
                        db_dialect: req.body.db_dialect,
                    });
                    resSuccessHandler(res, insertService,"success");
                }
                else
                {
                    throw new ClientError("Proses Pembuatan Container Gagal");
                }
            }
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
            return resSuccessHandler("Succeess", "Maaf, Anda Belum Pernah Melakukan Hosting Menggunakan Layanan Kami.");
            
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

const serviceDetail = async (req, res) => {
    try{
        const podDetail = req.params.pods;
        const getPodName = await HostedService.findOne({
            where: {pod_name: podDetail}
        });
        if(!getPodName)
        {
            throw new ClientError("Pod Tidak Terdaftar");
        }
        else
        {
            const createdPodConfig = {
                method: 'get',
                url: process.env.KUBE_LINK+'/'+podDetail,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.KUBE_TOKEN}`
                }
            }
            const getCreatedPod = await axios(createdPodConfig);
            let detailedResult = {};
            detailedResult = getCreatedPod.data.status
            console.log(detailedResult);
            const resultDetail = {
                pod_name: req.params.pods,
                pod_ip: detailedResult.podIP,
                machine_status: detailedResult.containerStatuses[0].ready,
                start_date: getPodName.service_started,
                end_date: getPodName.service_ended,
            }
            return resSuccessHandler(res, resultDetail, "success");
        }
    }
    catch(err){
        return resErrorHandler(res, err);
    }   
}

function makeName(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {createService, clientDashboard, serviceDetail};