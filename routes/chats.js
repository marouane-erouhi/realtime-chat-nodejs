const { Router } = require('express')
// const Controllers = require('../controllers/publicControllers')
const { requireMiddleware } = require('../middleware/Auth')

const router = Router();

router.get('/chat', requireMiddleware, (req, res)=>{
    res.render('chat_page', {
        title: 'Chat'
    })
})


module.exports = router;