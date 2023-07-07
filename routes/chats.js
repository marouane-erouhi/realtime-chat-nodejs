const { Router } = require('express')
// const Controllers = require('../controllers/publicControllers')

const router = Router();

router.get('/chat', (req, res)=>{
    res.render('chat_page')
})


module.exports = router;