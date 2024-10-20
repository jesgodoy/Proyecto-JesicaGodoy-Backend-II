import cartService from '../services/cart.service.js';

class CartController {
    // Crear un nuevo carrito
    async createCart(req, res) {
        try {
            const newCart = await cartService.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    // Obtener un carrito por ID
    async getCart(req, res) {
    try {
        const { cid } = req.params;
        const cart = await cartService.getCartById(cid);
        res.json(cart);
    } catch (error) {
        
        res.status(404).json({ error: error.message });
    }
}

    
    // Obtener todos los carritos
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
            res.status(204).send(); // 204 No Content
        } catch (error) {
            console.error(`Error en deleteCart: ${error.message}`); // Log del error
            res.status(404).json({ error: error.message });
        }
    }
    async addProduct(req, res) {
        
            try {
                const { cid, pid } = req.params;
                const { quantity } = req.body; // Asegúrate de enviar 'quantity' en el cuerpo de la solicitud
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
            res.render('cart', { cart }); // Asegúrate de que 'cart' es el nombre de tu vista Handlebars
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

export default new CartController();