const router = require("express").Router();
const verifyToken = require('../middleware/JWTverify');
const {
    createService,
    clientDashboard,
    serviceDetail
} = require('../controller/serviceController')

router.post('/createService', verifyToken, createService);
router.get('/hostedService/:email', verifyToken, clientDashboard);
router.get('/hostedPods/:pods', verifyToken, serviceDetail)

module.exports = router;