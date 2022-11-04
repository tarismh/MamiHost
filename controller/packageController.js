const ClientError = require('../exception/clientError');
const {
    resSuccessHandler,
    resErrorHandler
} = require('../exception/resHandler')
const { Package, Features } = require('../models');
const features = require('../models/features');
require('dotenv').config();

const getAllPackage = async (req, res) => {
    try {
        const getPackage = await Package.findAll({
            include: [
                {
                    model: Features,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
        });
        const result = getPackage.map((e) => {
            const {
                package_id,
                package_name,
                package_description,
                package_price,
                duration,
                Feature: features,
                createdAt,
                updatedAt,
            } = e;

            return {
                package_id,
                package_name,
                package_description,
                package_price,
                duration,
                features,
                createdAt,
                updatedAt,
            };
        });
        return resSuccessHandler(res, result, "success");
    }
    catch(err){
        return resErrorHandler(res, err);
    }
};

const getPackageByID = async (req, res) => {
    try{
        const package_id = req.params.id;
        if (!package_id) {
            throw new ClientError("Insert Package ID");
        }

        const packageID = await Package.findOne({
            where: {
                package_id,
            },
            include: [
                {
                    model: Features,
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
        });

        // const feature_id = packageID.features_id;

        const result = {
            package_id: packageID.package_id,
            package_name: packageID.package_name,
            package_description: packageID.package_description,
            package_price: packageID.package_price,
            duration: packageID.duration,
            feature: packageID.Feature,
            createdAt: packageID.createdAt,
            updatedAt: packageID.updatedAt,
        };
        return resSuccessHandler(res, result, "success");
    }
    catch (err) {
        return resErrorHandler(res, err);
    }
};

module.exports = {getAllPackage, getPackageByID};