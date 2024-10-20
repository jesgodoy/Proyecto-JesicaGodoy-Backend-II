import { Router } from "express";
import productController from "../controllers/product.controller.js";
import CartManager from "../dao/db/carts-manager-db.js";

const router = Router();

const cartManager = new CartManager();



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


router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);

        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }

        const processedCart = {
            _id: cart._id.toString(),
            cart: cart.cart.map(item => ({
                productId: item.product._id.toString(),
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                _id: item._id.toString()
            })),
            totalItems: cart.totalItems // Asegúrate de incluir esto
        };

        res.render('cart', { cart: processedCart });

    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).render('error', { message: 'Error al obtener el carrito' });
    }
});


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