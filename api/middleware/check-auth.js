const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    if ( req.headers.authorization ) {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            jwt.verify(token, process.env.jwt_key);
            console.log(jwt.verify(token, process.env.jwt_key)); //It returns an id and email of the user
            console.log('Gate Given Access');
            next();
        } else {
            return res.status(401).json({
                message: 'Auth Failed'
            })
        }
    } else {
        res.status(401).json({
            message: 'Auth Required'
        });
        return;
    }
};