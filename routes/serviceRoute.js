const router = require("express").Router();
// const verifyToken = require('../middleware/JWTverify');
const {
    createService,
    clientDashboard
} = require('../controller/serviceController')

router.post('/createService', authenticateToken, createService);
router.get('/hostedService/:email', authenticateToken, clientDashboard)

function authenticateToken (req, res, next) {
    const authHeader = req.headers['authorization']
    if(authHeader === null)
    {
        stats=401;
        error='Unauthorized';
        throw err;
    }
    try{
        const token = authHeader.split(' ')[1]
        const tokenUser = jwt.verify(token, process.env.ACCESS_TOKEN_KEY)
        req.user = tokenUser
        next()
    }
    catch(err){
        console.log(err);
        res.status(400).send('Invalid Token');
    }
}

module.exports = router;