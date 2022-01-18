import express from 'express'
import {registerController, userController} from '../controllers'
import {loginController} from '../controllers'
import refreshController from '../controllers/auth/refreshController'
import productController from '../controllers/productControler'
import admin from '../middlewares/admin'
import auth from '../middlewares/auth'

const router = express.Router()


router.post('/register',registerController.register)

router.post('/login',loginController.login)

router.get('/me',auth,userController.me)

router.post('/refresh',refreshController.refresh)

router.post('/products',productController.store)

// router.post('/products',[auth,admin],productController.store)

router.put('/products/:id',productController.update)

router.delete('/products/:id',productController.delete)

router.get('/products',productController.index)

router.get('/products/:id',productController.show)



export default router