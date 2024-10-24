import { Router } from "express";
import passport from "passport";
import UserModel from "../dao/models/user.model.js";
import CartManager from "../dao/db/carts-manager-db.js"; 
import { createHash, isValidPassword } from "../utils/util.js";
import ProductManager from "../dao/db/products-manager-db.js"; 
import { generateToken } from "../utils/jsonwebtoken.js";
import UserController from '../controllers/user.controllers.js'



const productManager = new ProductManager(); 
const router = Router();
const cartManager = new CartManager();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/", UserController.getAllUsers);
router.post("/logout", UserController.logout);


const renderHome = async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.user.cart);
        const user = {
            _id: req.user._id,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            cart: req.user.cart,
            cartItemCount: cart ? cart.totalItems : 0,
            role: req.user.role
        };

        const products = await productManager.getProducts();
        const nuevoArray = products.docs.map(product => product.toObject());

        res.render("home", { user, productos: nuevoArray });

    } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        res.status(500).render('error', { message: 'Error al obtener los datos del usuario.', error: error.message });
    }
};



router.get("/current", passport.authenticate("current", { session: false }), renderHome);

export default router;
