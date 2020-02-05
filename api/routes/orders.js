const express = require('express');
const routes = express.Router();

// Import authentication middleware
const gate = require('../middleware/check-auth');

//Import Order Controller
const orderController = require('../controllers/order');

//To get orders list
routes.get('/', gate, orderController.get_all_order);

//To create a new order
routes.post('/', gate, orderController.create_order);

// To get a single order
routes.get('/:orderId', gate, orderController.get_order);


// To delete an order
routes.delete('/:orderId', gate, orderController.delete_order);

module.exports = routes;

