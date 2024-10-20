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
    
    // Obtener todos los carritos
    async getAllCarts() {
        return await cartRepository.getAllCarts();
    }

    async deleteCart(cartId) {
      const deletedCart = await cartRepository.deleteCartById(cartId);
      if (!deletedCart) throw new Error("Carrito no encontrado");
      return deletedCart;
  }

  async addProductToCart(cartId, productId, quantity) {
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


/*import cartRepository from '../repositories/cart.repository.js';
import { validateQuantity } from '../utils/cartsValidations.js';

class CartService {
  async addCart() {
    try {
      return await cartRepository.createCart();
    } catch (error) {
      throw new Error("Error al crear un carrito de compras: " + error.message);
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartRepository.getCartById(id);
      if (!cart) throw new Error("Carrito no encontrado");
      return cart;
    } catch (error) {
      throw new Error("Error al obtener el carrito por id: " + error.message);
    }
  }

  async addProductToCart(id, productId, quantity = 1) {
    try {
      validateQuantity(quantity);
      const cart = await this.getCartById(id);
      const existingProduct = cart.cart.find(prod => prod.product.id === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.cart.push({ product: productId, quantity });
      }

      cart.totalItems = cart.cart.reduce((sum, item) => sum + item.quantity, 0);
      return await cartRepository.updateCart(id, cart);
    } catch (error) {
      throw new Error("Error al agregar un producto al carrito: " + error.message);
    }
  }

  async getAllCarts() {
    try {
      return await cartRepository.getAllCarts();
    } catch (error) {
      throw new Error("Error al obtener todos los carritos: " + error.message);
    }
  }

  async deleteCartById(id) {
    try {
      return await cartRepository.deleteCart(id);
    } catch (error) {
      throw new Error("Error al eliminar el carrito por id: " + error.message);
    }
  }

  async updateCart(cartId, updatedCart) {
    try {
      const cart = await this.getCartById(cartId);
      cart.cart = updatedCart.cart || cart.cart;
      cart.totalItems = updatedCart.totalItems || cart.totalItems;
      return await cartRepository.updateCart(cartId, cart);
    } catch (error) {
      throw new Error("Error al actualizar el carrito: " + error.message);
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await this.getCartById(cartId);
      cart.cart = [];
      cart.totalItems = 0;
      return await cartRepository.updateCart(cartId, cart);
    } catch (error) {
      throw new Error("Error al limpiar el carrito: " + error.message);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      const productIndex = cart.cart.findIndex(item => item.product.id === productId);
      if (productIndex === -1) {
        throw new Error("Producto no encontrado en el carrito");
      }
      cart.cart.splice(productIndex, 1);
      cart.totalItems -= 1;
      return await cartRepository.updateCart(cartId, cart);
    } catch (error) {
      throw new Error("Error al remover producto del carrito: " + error.message);
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      validateQuantity(quantity);
      const cart = await this.getCartById(cartId);
      const existingProduct = cart.cart.find(prod => prod.product.id === productId);
      if (!existingProduct) {
        throw new Error("Producto no encontrado en el carrito");
      }
      existingProduct.quantity = quantity;
      cart.totalItems = cart.cart.reduce((sum, item) => sum + item.quantity, 0);
      return await cartRepository.updateCart(cartId, cart);
    } catch (error) {
      throw new Error("Error al actualizar la cantidad del producto: " + error.message);
    }
  }
}

export default new CartService();*/