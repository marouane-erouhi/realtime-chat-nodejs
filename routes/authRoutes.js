const {Router} = require('express')
const Controllers = require('../controllers/authControllers')
const { redirectIfLogedin } = require('../middleware/Auth')

const router = Router();

router.get('/signup', redirectIfLogedin, Controllers.signup_get)
router.post('/signup', Controllers.signup_post)

router.get('/login', redirectIfLogedin, Controllers.login_get)
router.post('/login', Controllers.login_post)

router.get('/logout', Controllers.logout_get)

module.exports = router;