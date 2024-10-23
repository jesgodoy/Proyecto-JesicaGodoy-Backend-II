import cartDAO from '../dao/cart.dao.js';
import { CartDTO } from '../dto/cart.dto.js';

class CartRepository {

    async createCart() {
        const newCart = await cartDAO.create();
        return new CartDTO(newCart);
    }


    async getCartById(id) {
        const cart = await cartDAO.findById(id);
        return cart ? new CartDTO(cart) : null;
    }

    async getAllCarts() {
        const carts = await cartDAO.findAll();
        return carts.map(cart => new CartDTO(cart));
    }

    async deleteCartById(cartId) {
        const cart = await cartDAO.findById(cartId);
        if (!cart) {

            return null;
        }
        await cartDAO.deleteById(cartId);
        return cart;
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

        cart.cart = [];
        await cart.save();
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const updatedCart = await cartDAO.updateProductQuantity(cartId, productId, quantity);
        return new CartDTO(updatedCart);
    }
}



export default new CartRepository();