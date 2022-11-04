const router = require("express").Router();
const verifyToken = require('../middleware/JWTverify');
const {
    createService,
    clientDashboard
} = require('../controller/serviceController')

router.post('/createService', verifyToken, createService);
router.get('/hostedService/:email', verifyToken, clientDashboard)

module.exports = router;