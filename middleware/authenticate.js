const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const User = require('../models/User');
const config = require('../config/config');
const jwtOptions = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
};
const jwtVerifyCallback = async (jwtPayload, done) => {
    try {
        const user = await User.findOne({ where: { id: jwtPayload.id } });
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        return done(err, false);
    }
};

const strategy = new JWTStrategy(jwtOptions, jwtVerifyCallback);

passport.use(strategy);

const authenticate = passport.authenticate('jwt', { session: false });

const isAdmin = (req, res, next) => {
    if (req.user.role_id === 1) {
        return next();
    } else {
        return res.status(401).json({ message: 'Unauthorized access.' });
    }
};

module.exports = {
    authenticate,
    isAdmin
};
