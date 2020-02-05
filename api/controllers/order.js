const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/order');

exports.get_all_order = (req, res, next) => {
    Order.find()
        .select('quantity _id product')
        .populate('product', 'name _id')
        .exec()
        .then((result) => {
            res.status(200).json({
                count: result.length,
                ordersList: result.map(data => {
                    return {
                        productDetail: data,
                        request: {
                            type: 'GET',
                            description: 'GET_INDIVIDUAL_ORDER_DETAILS',
                            url: 'http://localhost:3000/orders/' + data._id
                        }
                    }

                })

            })
        })
        .catch((error) => {
            res.status(500).json({
                error: error
            })
        })

};

exports.create_order = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById({ _id: prodId })
        .exec()
        .then((result) => {
            if (!result) {
                return res.status(404).json({
                    message: 'product not found'
                })
            }
            console.log('product exist');
            console.log(result);
            const order = new Order({
                _id: new mongoose.Types.ObjectId,
                product: prodId,
                quantity: req.body.quantity
            })
            return order.save()
        })
        .then((data) => {
            res.status(201).json({
                message: 'Order Placed',
                order: data,
                request: {
                    type: 'GET',
                    description: 'VIEW_ORDER_DETAILS',
                    url: 'http://localhost:3000/orders/' + data._id
                }
            })
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Invalid Product Id or Product Id does not exist',
                error: error
            })
        })

};

exports.get_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById({ _id: id })
        .select(' quantity _id product ')
        .populate('product', 'name _id price')
        .exec()
        .then(data => {
            if (!data) {
                return res.status(404).json({
                    message: 'Order not found'
                })
            }
            res.status(200).json({
                message: `Order retrieved`,
                orderDetails: data,
                request: {
                    type: 'GET',
                    description: 'VIEW_ALL_ORDERS',
                    url: 'http://localhost:3000/orders/'
                }
            })
        })
        .catch(error => {
            res.status(404).json({
                message: 'Product not found',
                error: error
            })
        })

};

exports.delete_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id).remove()
        .exec()
        .then(data => {
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: 'POST',
                    description: 'CREATE_NEW_PRODUCT',
                    url: 'http://localhost:3000/orders/',
                    body: {
                        'productId': 'String',
                        'quantity': 'Number'
                    }

                },
                log: data
            })
        })
        .catch(error => {
            res.status(500).json({
                status: 'Either order not found or something went wrong',
                error: error
            })
        })
};