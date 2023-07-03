const {Router} = require('express')
const Controllers = require('../controllers/authControllers')

const router = Router();

router.get('/signup', Controllers.signup_get)
router.post('/signup', Controllers.signup_post)

router.get('/signin', Controllers.signin_get)
router.post('/signin', Controllers.signin_post)

module.exports = router;