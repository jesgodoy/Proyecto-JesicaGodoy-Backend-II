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

   

    passport.use(new GitHubStrategy({
        clientID: "Iv23lipSxx9TPyEArYgR",
        clientSecret: "8c72fafc05c94e4800564b63377791a99ae582f6",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        

        try {
            let user = await UserModel.findOne({ email: profile._json.email });

            if (!user) {
                const newCart = await cartManager.addCart(); 
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 37,
                    email: profile._json.email, 
                    password: "",
                    cart: newCart._id
                };

                let result = await UserModel.create(newUser);
                done(null, result); 
            } else {
                done(null, user); 
            }

        } catch (error) {
            return done(error);
        }
    }));
    passport.serializeUser((user, done) => {
        done(null, user.id); 
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;