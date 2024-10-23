import cartRepository from '../repositories/cart.repository.js';
import { validateQuantity } from '../utils/cartsValidations.js';

class CartService {
  // Crear un nuevo carrito
  async createCart() {
    return await cartRepository.createCart();
  }

  // Obtener un carrito por ID
  async getCartById(cartId) {

    const cart = await cartRepository.getCartById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");
    return cart;
  }


  async getAllCarts() {
    return await cartRepository.getAllCarts();
  }

  async deleteCart(cartId) {
    const deletedCart = await cartRepository.deleteCartById(cartId);
    if (!deletedCart) throw new Error("Carrito no encontrado");
    return deletedCart;
  }

  async addProductToCart(cartId, productId, quantity) {
    validateQuantity(quantity);
    return await cartRepository.addProductToCart(cartId, productId, quantity);
  }

  async removeProductFromCart(cartId, productId) {
    return await cartRepository.removeProductFromCart(cartId, productId);
  }

  async clearCart(cartId) {
    const updatedCart = await cartRepository.clearCart(cartId);
    return updatedCart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await cartRepository.updateProductQuantity(cartId, productId, quantity);
  }
}

export default new CartService();
