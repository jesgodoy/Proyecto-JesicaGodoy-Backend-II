import cartService from '../services/cart.service.js';

class CartController {

    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }


    async getCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
            res.json(cart);
        } catch (error) {

            res.status(404).json({ error: error.message });
        }
    }



    async getAllCarts(req, res) {
        try {
            const carts = await cartService.getAllCarts();
            res.json(carts);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteCart(req, res) {
        try {
            const { cid } = req.params;
            const deletedCart = await cartService.deleteCart(cid);
            res.status(200).send(`carrito eliminado correctamente`);
        } catch (error) {
            console.error(`Error al eliminar carrito: ${error.message}`);
            res.status(404).json({ error: error.message });
        }
    }
    async addProduct(req, res) {

        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
            res.json(updatedCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }

    }

    async removeProduct(req, res) {
        try {
            const { cid, pid } = req.params;
            const updatedCart = await cartService.removeProductFromCart(cid, pid);
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async clearCart(req, res) {
        try {
            const { cid } = req.params;
            const updatedCart = await cartService.clearCart(cid);
            res.status(200).json(updatedCart);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
            const updatedCart = await cartService.updateProductQuantity(cid, pid, quantity);
            res.json(updatedCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async renderCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCartById(cid);
            res.render('cart', { cart });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

export default new CartController();