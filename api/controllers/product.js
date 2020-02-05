const host = 'http://localhost:3000';

const mongoose = require('mongoose');
const Product = require('../models/product');


exports.create_new_product = (req, res, next) => {
    console.log( req.file );
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: host + '/products/' + req.file.filename
    });
    product.save()
        .then(result => {
            res.status(200).json({
                message: 'Product created',
                createdProduct: {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    productImage: product.productImage
                },
                Request: {
                    type: 'GET',
                    description: 'VIEW_ADDED_PRODUCT_FULL_DETAIL',
                    url: 'http://localhost:3000/products/' + result._id
                }
            })
        })
        .catch(error => {
            res.status(500).json({
                message: error
            })
        });

};

exports.get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).select('_id name price productImage')
        .exec()
        .then((result) => {
            if (result) {
                res.status(200).json({
                    product: result,
                    request: {
                        type: 'GET',
                        description: 'VIEW_FULL_PRODUCT_LIST',
                        url: 'http://localhost:3000/products/'
                    }
                })
            } else {
                res.status(404).json({
                    product: 'No Product Found'
                })
            }

        })
        .catch(error => {
            res.status(500).json({
                error: error
            })
        })
};

exports.get_all_products = (req, res, next) => {
    Product.find().select("name price _id productImage")
    .exec()
    .then(( results ) => {
        res.status( 200 ).json( {
            count: results.length,
            products: results.map( result => {
                return {                   
                            ...result._doc,
                            request: {
                                type: 'GET',
                                description: 'GET_THIS_PRODUCT_FULL_DETAIL',
                                url: 'http://localhost:3000/products/' + result._id
                            }
                        }
            })
        } );
    })
    .catch( error => {
        res.send( 500 ).json({
            error: error
        })
    });
};

exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({
        _id: id
    }).exec()
    .then( data => {
        res.status( 200 ).json( {
            status: 'product deleted',
            request: {
                type: 'POST',
                description: 'ADD_NEW_PRODUCT',
                url: 'http://localhost:3000/products/',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            },
            log: data
        } );
    } )
    .catch( error => {
        res.status( 500 ).json({
            error: error
        })
    } )
};

exports.update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for( const ops of req.body ) {
        updateOps[ ops.propName ] = ops.value;
    }
    Product.updateOne({_id: id}, {$set: updateOps }).exec()
    .then( data => {
        res.status( 200 ).json({
            status: 'Product Updated',
            request: {
                type: 'GET',
                description: 'GET_FULL_DATA_OF_THE_UPDATED_PRODUCT',
                url: 'http://localhost:3000/products/' + id
            },
            log: data
            
        })
    } )
    .catch( error => {
        res.status( 500 ).json({
           error: error 
        })
    })
};

