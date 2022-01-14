const router=require('express').Router()

const auth=require('../middlewares/auth')
const authAdmin=require('../middlewares/authAdmin')
const productctrl=require('../controllers/Productctrl')
router.route('/products')
    .get(productctrl.getProduct)
    .post(productctrl.createProduct)

router.route('/products/:id')
    .delete(productctrl.deleteProduct)
    .put(productctrl.updateProduct)


module.exports=router