const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/user.service');
const db = require('./db');
const User = db.User;

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/',
            '/users/login',
            '/users/register',
            '/users/update/xyz',
            '/uploaded/testimonial.jpg'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await User.findById(payload.sub).select('-hash');

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};