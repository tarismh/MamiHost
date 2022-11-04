const router = require("express").Router();

const {
    createService,
    clientDashboard
} = require('../controller/serviceController')

router.post('/createService', createService);
router.get('/hostedService/:email', clientDashboard)

module.exports = router;