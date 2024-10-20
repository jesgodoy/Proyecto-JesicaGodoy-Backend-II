import { Router } from "express";
import productController from "../controllers/product.controller.js";
import cartController from "../controllers/cart.controllers.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
    
        res.render("login");

    } catch (error) {
        console.error("Error al obtener los productos para la vista de inicio:", error);
        res.status(500).render('error', { message: 'Error al cargar la vista de inicio.' });
    }
});

router.get("/products", productController.renderProducts);

router.get('/products/:pid', productController.renderDetailProduct);


router.get('/carts/:cid', cartController.renderCart);


router.get("/realtimeproducts", async (req, res) => {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.error("Error al renderizar realtimeproducts:", error);
        res.status(500).render('error', { message: 'Error al cargar la vista de productos en tiempo real.' });
    }
});

router.get("/register", (req, res) => {
    try {
        res.render("register");
    } catch (error) {
        console.error("Error al renderizar register:", error);
        res.status(500).render('error', { message: 'Error al cargar la vista de registro.' });
    }
});

router.get("/login", (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.error("Error al renderizar login:", error);
        res.status(500).render('error', { message: 'Error al cargar la vista de inicio de sesión.' });
    }
    
});



export default router;