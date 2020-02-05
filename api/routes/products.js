

const express = require('express');
const routes = express.Router();


const multer = require( 'multer' ); //To Accept multipart form data

// Importing check auth middleware to validate the protected route
const gate = require( '../middleware/check-auth' );

// Import product controller
const productController = require('../controllers/product');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './products/')
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname )
      }
})

const fileFilter = ( req, file, cb ) => {
    if( file.mimetype === 'image/jpeg') {
        // To Proceed
        cb( null, true );
    } else {
        // To Reject and dont save
        cb( null, false );
        cb(new Error('Wrong Format'));
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: {
    fileSize: 1024 * 1024 * 1
} });


const Product = require('../models/product');

// To get a products list
routes.get('/', productController.get_all_products);

// To create a new product
routes.post('/', gate, upload.single('productImage'), productController.create_new_product );

// To get a single product with id
routes.get('/:productId', productController.get_product)

// To update part of the resource
routes.patch('/:productId', gate, productController.update_product)

// To delete the resource
routes.delete('/:productId', gate, productController.delete_product)

module.exports = routes; 
