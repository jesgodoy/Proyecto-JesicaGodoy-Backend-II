import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import UserModel from "../dao/models/user.model.js";
import GitHubStrategy from "passport-github2";
import CartManager from "../dao/db/carts-manager-db.js";

const cartManager = new CartManager();

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["BeautyCookieToken"];
    }
    return token;
};

const initializePassport = () => {
    passport.use("current", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "Beauty"
    }, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findById(jwt_payload.id);
            return done(null, user || false);
        } catch (error) {
            return done(error, false);
        }
    }));

};

export default initializePassport;