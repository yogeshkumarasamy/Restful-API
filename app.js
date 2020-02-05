const express = require( 'express' );
const morgan = require( 'morgan' );
const bodyParser = require( 'body-parser' );
const cors = require( 'cors' );
const mongoose = require( 'mongoose' );

mongoose.connect( 'mongodb+srv://rest-api:' + process.env.mongo_pw  +'@cluster0-xzlcx.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true} );

const app = express();

app.use( '/products', express.static('products') ); //To make the products folder static to get the images

const productRoutes = require( './api/routes/products' );
const orderRoutes = require( './api/routes/orders' );
const userRoutes = require( './api/routes/users');

app.use( morgan( 'dev' ) ); // To logging Method of the request, resource path, http code, time took to deliver
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );

//Avoiding CORS ISSUE

// app.use(( req, res, next ) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     if( req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status( 200 ).json({});
//     }
//     next();
// });
app.use( cors() );


// app.use(function timeLog (req, res, next) {
//     console.log('Time: ', Date.now())
//     next()
// }) //Logging the incoming request time BTW
app.use( '/products', productRoutes );
app.use( '/orders', orderRoutes );
app.use( '/users', userRoutes );

app.use( (req, res, next) => {
    const error = new Error( 'Not Found' );       
    error.status = 404;
    next( error );
} );
app.use( ( error, req, res, next ) => {
    res.status( error.status || 500 );
    res.json({
        error: {
            message: error.message
        }        
    })
});

// app.use((req, res, next) => {
//  res.status(200).json({
//      message: 'it works'
//  })
// }); //Middleware
module.exports = app; //To Export this file