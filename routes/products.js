var express = require('express');
var router = express.Router();
var conn = require('../lib/db');

router.get('/', function(req,res,next){
    conn.query('SELECT * FROM products ORDER BY id desc', function(err, rows){
        if(err){
            req.flash('error',err);
            res.render('products', {page_title:"Products - Node.js", data:''});
        }else{
            res.render('products', {page_title:'PRoducts - Node.js', data:rows});
        }
    });
});

router.get('/create', function(req, res, next){
    res.render('products/create', {
        title: 'Add New Products',
        name: '',
        email: '',     
    });
});

router.post('/create', function(req,res,next){
    req.assert('name', 'Name is Required').notEmpty()
    req.assert('price', 'Price is Required').notEmpty()
    var errors = req.validationErrors()
    if(!errors){
        var products = {
            name: req.sanitize('name').escape().trim(),
            price: req.sanitize('price').escape().trim(),
        }
        conn.query("INSERT INTO products SET ?", product, function(err,result){
            if (err) {
                req.flash('error', err);
                res.render('products/create',{
                    title: 'Add New Product',
                    name: product.name,
                    price: product.price,
                });
            }else{
                req.flash('success', 'Data Added');
                res.redirect('/products');
            }
        });
    }else{
        var error_msg = '';
        error.forEach(function(error){
            error_msg += error.msg + '<br>'            
        });
        req.flash('error', error_msg);
        res.render('products/create',{
            title: 'Add New Product',
            name: req.body.name,
            price: req.body.price,
        });
    }
});

router.get('/edit/(:id)', function(req,res,next){
    conn.query('SELECT * FROM products WHERE id = ' + req.params.id, function(err,rows,fields){
        if(err) throw err;
        if(rows.length <= 0){
            req.flash('error', 'Product not Found');
            res.redirect('/products');
        }else{
            res.render('products/edit', {
                title: 'Edit Product',
                id: rows[0].id,
                name: rows[0].name,
                price: rows[0].price,
            });
        }
    });
});

router.post('/update/(:id)', function(req,res,next){
    req.assert('name', 'Name is Required').notEmpty()
    req.assert('price', 'Price is Required').notEmpty()
    var errors = req.validationErrors()
    if(!errors){
        var products = {
            name: req.sanitize('name').escape().trim(),
            price: req.sanitize('price').escape().trim(),
        }
        conn.query("UPDATE products SET ? WHERE id =", + req.params.id, product, function(err,result){
            if (err) {
                req.flash('error', err);
                res.render('products/edit',{
                    title: 'Edit Product',
                    id: req.params.id,
                    name: req.params.name,
                    price: req.params.price,
                });
            }else{
                req.flash('success', 'Data Updated');
                res.redirect('/products');
            }
        });
    }else{
        var error_msg = '';
        error.forEach(function(error){
            error_msg += error.msg + '<br>'            
        });
        req.flash('error', error_msg);
        res.render('products/edit',{
            title: 'Edit Product',
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
        });
    }
});

router.get('/delete/(:id)', function(req,res,next){
    var products = {id:req.params.id};
    conn.query('DELETE FROM products WHERE id = ' + req.params.id, products,function(err, result){
        if(err) {
            req.flash('error', err);
            res.redirect('/products');

        }else{
            req.flash('success', 'Data Deleted');
            res.redirect('/products');
        }
    });
});

module.exports = router;