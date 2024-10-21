import passport from 'passport';

// Middleware para autenticar usuarios
export const authenticateUser = passport.authenticate('current', { session: false });

// Middleware para solo admin
export function soloAdmin(req, res, next) {
    if (req.user && req.user.role === "admin") {
        return next();
    } else {
        return res.status(403).send("Acceso denegado, este lugar es solo para admin");
    }
}

// Middleware para solo usuarios
export function soloUser(req, res, next) {
    if (req.user && req.user.role === "user") {
        return next();
    } else {
        return res.status(403).send("Acceso denegado, este lugar es solo para usuarios");
    }
}