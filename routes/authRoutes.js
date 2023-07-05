const {Router} = require('express')
const Controllers = require('../controllers/authControllers')

const router = Router();

router.get('/signup', Controllers.signup_get)
router.post('/signup', Controllers.signup_post)

router.get('/login', Controllers.login_get)
router.post('/login', Controllers.login_post)

module.exports = router;