import UserService from '../services/user.service.js';
import { generateToken } from '../utils/jsonwebtoken.js';


import { UserDTO } from "../dto/user.dto.js";
import ProductManager from '../dao/db/products-manager-db.js';
import CartManager from '../dao/db/carts-manager-db.js';

const productManager = new ProductManager(); 

const cartManager = new CartManager();


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

    async logout (req, res) {
        try {
            req.session.destroy();
            res.clearCookie("BeautyCookieToken");
            res.redirect("/login");
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            res.status(500).render('error', { message: 'Error al cerrar sesión.' });
        }
    };
    
    async current (req, res) {
        try {
            const cart = await cartManager.getCartById(req.user.cart);
            const userData = new UserDTO(req.user);
    
            const user = {
                ...userData,
                cartItemCount: cart ? cart.totalItems : 0,
            };
    
            const products = await productManager.getProducts();
            const nuevoArray = products.docs.map(product => product.toObject());
    
            res.render("home", { user, productos: nuevoArray });
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            res.status(500).render('error', { message: 'Error al obtener los datos del usuario.', error: error.message });
        }
    };

}

export default new UserController();
