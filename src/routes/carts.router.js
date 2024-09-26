import express from "express";
import CartManager from "../dao/db/carts-manager-db.js";

const router = express.Router();
const cartManager = new CartManager();

router.get("/", async (request, response) => {
    const limit = parseInt(request.query.limit);
    try {
        const carts = await cartManager.getAllCarts();
        response.status(200).json(isNaN(limit) ? carts : carts.slice(0, limit));
    } catch (error) {
        console.error("Error al obtener los carritos:", error);
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/", async (request, response) => {
    try {
        const newCart = await cartManager.addCart();
        response.status(201).json({
            message: "Carrito agregado correctamente",
            cart: newCart
        });
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/:cid", async (request, response) => {
    const id = request.params.cid;
    try {
        const searchCart = await cartManager.getCartById(id);
        response.status(searchCart ? 200 : 404).json(searchCart || { error: "¡Carrito no encontrado!" });
    } catch (error) {
        console.error("Error al obtener el carrito por ID:", error);
        response.status(500).json({ error: "Error interno del servidor" });
    }
});

router.delete("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cartUpdated = await cartManager.removeProductFromCart(cartId, productId);
        res.status(200).json(cartUpdated);
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        res.status(500).json({ error: "Error al eliminar el producto del carrito" });
    }
});


router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid; 
    const quantity = req.body.quantity || 1; 
    try {
       
        cartManager.validateQuantity(quantity);
        const cartUpdated = await cartManager.addProductToCart(cartId, productId, quantity);
        res.status(200).json(cartUpdated); 
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(400).json({ error: error.message }); 
    }
});

router.delete("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const deletedCart = await cartManager.deleteCartById(cartId);
        if (!deletedCart) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        res.status(200).json({ message: "Carrito eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el carrito:", error.message);
        res.status(500).json({ error: "Error al eliminar el carrito" });
    }
});

router.put("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
    
        cartManager.validateQuantity(quantity); 
        const cartUpdated = await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.status(200).json(cartUpdated);
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto:", error);
        res.status(error.message === "Producto no encontrado en el carrito" ? 404 : 400).json({ error: error.message });
    }
});

export default router;
