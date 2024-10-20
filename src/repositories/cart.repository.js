import cartDAO from '../dao/cart.dao.js';
import { CartDTO } from '../dto/cart.dto.js';

class CartRepository {
    // Crear un nuevo carrito y devolverlo como CartDTO
    async createCart() {
        const newCart = await cartDAO.create();
        return new CartDTO(newCart);
    }

    // Obtener un carrito por ID y devolverlo como CartDTO
    async getCartById(id) {
        const cart = await cartDAO.findById(id);
        return cart ? new CartDTO(cart) : null;
    }

    // Obtener todos los carritos y devolverlos como una lista de CartDTO
    async getAllCarts() {
        const carts = await cartDAO.findAll();
        return carts.map(cart => new CartDTO(cart));
    }

    async deleteCartById(cartId) {
        const cart = await cartDAO.findById(cartId);
        if (!cart) {
            
            return null; // Si no existe, retorna null
        }
        await cartDAO.deleteById(cartId);
        return cart; // Retorna el carrito eliminado
    }

    async addProductToCart(cartId, productId, quantity) {
        const updatedCart = await cartDAO.addProductToCart(cartId, productId, quantity);
        return new CartDTO(updatedCart);
    }

    async removeProductFromCart(cartId, productId) {
        const updatedCart = await cartDAO.removeProductFromCart(cartId, productId);
        return new CartDTO(updatedCart);
    }

    async clearCart(cartId) {
        const cart = await cartDAO.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        cart.cart = [];  // Vaciar el carrito
        await cart.save();
        return cart;  // Retorna el carrito vacío
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const updatedCart = await cartDAO.updateProductQuantity(cartId, productId, quantity);
        return new CartDTO(updatedCart);
    }
}



export default new CartRepository();