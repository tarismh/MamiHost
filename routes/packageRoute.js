const router = require("express").Router();

const {
    getAllPackage, getPackageByID,
} = require('../controller/packageController')

router.get('/getAllPackage', getAllPackage);
router.get('/getPackageById/:id', getPackageByID)

module.exports = router;