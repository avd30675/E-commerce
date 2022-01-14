const Router=require('express').Router();
const categoryctrl=require('../controllers/catogoryctrl')

const auth=require('../middlewares/auth');
const authAdmin=require('../middlewares/authAdmin')

Router.route('/category')
  .get(categoryctrl.getcategory) 
  .post(auth.auth,authAdmin.authAdmin, categoryctrl.putcategory)

Router.route('/category/:id')
       .delete(auth.auth,authAdmin.authAdmin,categoryctrl.deletecategory)
       .put(auth.auth,authAdmin.authAdmin,categoryctrl.updatecategory)

module.exports=Router