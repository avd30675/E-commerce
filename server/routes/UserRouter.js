const router=require('express').Router()
const Userctrl=require('../controllers/Userctrl')
const auth=require('../middlewares/auth')


router.post('/register',Userctrl.register);

router.post('/login',Userctrl.login);

router.get('/logout',Userctrl.logout);

router.get ('/refresh',Userctrl.refreshToken);

router.get('/infer',auth.auth,Userctrl.getUser);


module.exports=router 