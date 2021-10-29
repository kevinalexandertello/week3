const path = require('path');

const express = require('express');


const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');
const {check , body} = require('express-validator');


const router = express.Router();




router.get('/add-product', isAuth,adminController.getAddProduct)
router.post('/add-product' ,
[
    body('title',
    'The Title need to have at least 6 characters')
    .isString()
    .isLength({min:6})
    .trim()
    ,
    body('price',
    'Please insert a number')
    .isFloat()
    .trim()
    ,
    body('imageUrl',
    'Please insert a valid URL')
    .isURL()
    .trim()
    ,
    body('description',
    'The description need to have at least 10 characters')
    .isString()
    .isLength({min:10})
    .trim(),
], isAuth ,adminController.postAddProduct)
router.get('/products' , isAuth ,adminController.getProducts)
router.get('/edit-product/:id' , isAuth ,adminController.getEditProduct)
router.post('/edit-product' ,[
    body('title',
    'The Title need to have at least 6 characters')
    .isString()
    .isLength({min:6})
    .trim()
    ,
    body('price',
    'Please insert a number')
    .isFloat()
    .trim()
    ,
    body('imageUrl',
    'Please insert a valid URL')
    .isURL()
    .trim()
    ,
    body('description',
    'The description need to have at least 10 characters')
    .isString()
    .isLength({min:10})
    .trim(),
], isAuth , adminController.postEditProduct)
router.post('/delete-product' , isAuth , adminController.postDeleteProduct)

exports.routes= router;;