import { Router } from "express";
import passport from "passport";
import UserModel from "../dao/models/user.model.js";
import CartManager from "../dao/db/carts-manager-db.js"; 
import { createHash, isValidPassword } from "../utils/util.js";
import ProductManager from "../dao/db/products-manager-db.js"; 
import { generateToken } from "../utils/jsonwebtoken.js";

const productManager = new ProductManager(); 
const router = Router();
const cartManager = new CartManager();


router.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        res.status(500).send("Error interno del servidor.");
    }
});

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send("El usuario ya existe.");
        }

        const newCart = await cartManager.addCart(); 

        const newUser = new UserModel({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id 
        });

        await newUser.save();
        const token = generateToken(newUser); 

        res.cookie("BeautyCookieToken", token, { maxAge: 3600000, httpOnly: true });
        res.redirect("/api/sessions/current");
    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        res.status(500).send("Error interno del servidor.");
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        // Verifica si el usuario existe
        if (!user || !isValidPassword(password, user)) {
            // Mensaje genérico para no dar pistas
            return res.status(401).send("Credenciales Inválidas.");
        }

        req.session.user = user; 
        req.session.login = true; 

        const token = generateToken(user); 
        res.cookie("BeautyCookieToken", token, { maxAge: 3600000, httpOnly: true });
        res.redirect("/api/sessions/current");

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).send("Error interno del servidor.");
    }
});



router.post("/logout", async (req, res) => {
    try {
        req.session.destroy(); //esto permite eliminar la secion  
        res.clearCookie("BeautyCookieToken");
        res.redirect("/login");
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        res.status(500).render('error', { message: 'Error al cerrar sesión.' });
    }
});


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


router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));


router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    const user = req.user;

    const token = generateToken(user); 

    res.cookie("BeautyCookieToken", token, { maxAge: 3600000, httpOnly: true });
    req.session.user = user; 
    req.session.login = true; 
    await renderHome(req, res); 
});


router.get("/current", passport.authenticate("current", { session: false }), renderHome);

export default router;