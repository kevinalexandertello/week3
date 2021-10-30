const product = require('../models/product');
const {validationResult} = require('express-validator');


exports.getAddProduct = (req,res,next)=>{
    console.log('Adding Videogame');
    res.render("admin/edit-product",{
        docTitle: "Add Videogame" ,
        path : "/admin/add-product",
        errorMessage: null,
        oldInput:{ title: '',
            price:'',
            description : '',
            imageUrl: '',
        },
        editing: false ,  
        isLoggedIn: req.session.isLoggedIn,
    });
}

exports.postAddProduct =(req,res,next)=>{
    const title = req.body.title;
    const price = parseInt(req.body.price);
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return  res.render("admin/edit-product",{
            docTitle: "Add Videogame" ,
            path : "/admin/add-product",
            errorMessage: errors.array()[0].msg,
            oldInput:{ title:title,
                price:price,
                description : description,
                imageUrl:imageUrl,
            },
            editing: false ,  
        });
        }
    const product = new Product({
        title:title,
        price:price,
        description : description,
        imageUrl:imageUrl,
        userId: req.user
    });
    console.log('Videogame added')
    pizza
    .save().then(r=>{
        console.log('Videogame created')
        res.redirect('/admin/product');
        
    }).catch(e=>{
        {
            const error = new Error(e);
            error.httpStatus = '500'
            next(error)
    }

    })
}


exports.getProducts =(req,res,next)=>{
    Pizza.find({userId: req.user._id})
    .then(products=>{
        res.render('admin/products',
        {
            prods: pizzas ,
            docTitle: 'Admin Videogames' ,
            path:"/admin/products",  
            isLoggedIn: req.session.isLoggedIn,
        });

    }).catch(e=> res.redirect('/500'))

}
exports.getEditProduct = (req,res,next)=>{
    const productId = req.params.id
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/')
    }
    Product.findById(productId)
    .then((product)=>{
        if(!product){
            return res.redirect('/');
        }

        res.render("admin/edit-product",{
            docTitle: "Edit  Videogame" ,
            path : "/admin/edit-product",
            editing: editMode,
            product: product,
            errorMessage: null,
            oldInput:{ title: '',
                price:'',
                description : '',
                imageUrl: '',
            },

            isLoggedIn: req.session.isLoggedIn,
        });
    }).catch(e=>{
            const error = new Error(e);
            error.httpStatus = '500'
            next(error)
    })
}
exports.postEditProduct = (req,res,next)=>{
    const productId = req.body.id;
    const updatedTitle = req.body.title;
    let updatedPrice = parseInt(req.body.price);
    const updatedDescription = req.body.description;
    const updatedImageUrl = req.body.imageUrl;
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return  res.render("admin/edit-product",{
            docTitle: "Add Videogame" ,
            path : "/admin/edit-product",
            errorMessage: errors.array()[0].msg,
            oldInput:{ title:updatedTitle,
                price:updatedPrice,
                description : updatedDescription,
                imageUrl:updatedImageUrl,
            },
            editing: false ,  
        });
        }
    
    
    Pizza.findById(productId)
    .then(product =>{
        if (product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl
        return product.save().then(result =>{
            res.redirect('/admin/product')
            
        })
        
    })
    .catch(e=>{
            const error = new Error(e);
            error.httpStatus = '500'
            next(error)
    })
    
    
}

exports.postDeleteProduct =(req,res,next)=>{
    const productId = req.body.id;
    console.log(productId);
    Pizza.deleteOne({_id: productId, userId: req.user._id})
    .then(()=>{
        console.log('It was deleted');
        res.redirect('/admin/products')
    })
    .catch((e)=>
        {
            const error = new Error(e);
            error.httpStatus = '500'
            next(error)
    }
        )

    

}
