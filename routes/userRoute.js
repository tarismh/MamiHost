const router = require("express").Router();

const {
    getAllUsers,
    register
} = require('../controller/userController')

router.get('/getAllUser', getAllUsers);
router.post('/register', register);

module.exports = router;