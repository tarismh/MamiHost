const router = require("express").Router();

const {
    userLogin
} = require('../controller/loginController')

router.post('/userLogin', userLogin);

module.exports = router;