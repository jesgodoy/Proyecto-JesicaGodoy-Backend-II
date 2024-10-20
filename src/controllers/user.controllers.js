// controller/user.controller.js
import UserService from '../services/user.service.js';
import { generateToken } from '../utils/jsonwebtoken.js';

class UserController {
    async register(req, res) {
        try {
            const newUser = await UserService.registerUser(req.body);
            const token = generateToken(newUser);
            res.cookie("BeautyCookieToken", token, { maxAge: 3600000, httpOnly: true });
            res.redirect("/api/sessions/current");
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            res.status(400).send(error.message);
        }
    }

    async login(req, res) {
        try {
            const user = await UserService.loginUser(req.body.email, req.body.password);
            const token = generateToken(user);
            res.cookie("BeautyCookieToken", token, { maxAge: 3600000, httpOnly: true });
            req.session.user = user;
            req.session.login = true;
            res.redirect("/api/sessions/current");
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            res.status(401).send(error.message);
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            res.status(500).send("Error interno del servidor.");
        }
    }

    async logout(req, res) {
        try {
            console.log("Destruyendo sesión...");
            req.session.destroy((err) => {
                if (err) {
                    console.error("Error al destruir la sesión:", err);
                    return res.status(500).render('error', { message: 'Error al cerrar sesión.' });
                }
                console.log("Sesión destruida. Limpiando cookie...");
                res.clearCookie("BeautyCookieToken"); // Limpiar la cookie
                console.log("Redirigiendo a /login...");
                return res.redirect("/login"); // Redirigir al login
            });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            res.status(500).render('error', { message: 'Error al cerrar sesión.' });
        }
    }
}

export default new UserController();
