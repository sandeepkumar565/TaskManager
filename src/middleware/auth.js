const jwt = require('jsonwebtoken');
const User = require('../models/users')

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'newtiken')

        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })
        if (!user) {
            throw new Error()
        }
        req.user = user;
        req.token = token;
        next()
    } catch (err) {
        res.status(401).send();
    }
}

module.exports = auth;