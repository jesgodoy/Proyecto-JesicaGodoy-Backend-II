import CartModel from "../models/cart.model.js";

class CartManager {
    // Helper function to validate quantity
    validateQuantity(quantity) {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("La cantidad debe ser un número entero mayor a 0");
        }
    }

    async addCart() {
        try {
            const newCarrito = new CartModel({ cart: [] });
            await newCarrito.save();
            return newCarrito;
        } catch (error) {
            console.error("Error al crear un carrito de compras:", error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await CartModel.findById(id)
                .populate({
                    path: 'cart.product',
                    select: 'id title price quantity'
                });
            return cart || null;
        } catch (error) {
            console.error("Error al obtener el carrito por id:", error);
            throw error;
        }
    }

    async addProductToCart(id, productId, quantity = 1) {
        this.validateQuantity(quantity);  // Validate quantity
        try {
            const cart = await this.getCartById(id);
            if (!cart) throw new Error("Carrito no encontrado");

            const existingProduct = cart.cart.find(prod => prod.product._id.toString() === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.cart.push({ product: productId, quantity });
            }

            cart.markModified("cart");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al agregar un producto al carrito:", error);
            throw error;
        }
    }

    async getAllCarts() {
        try {
            return await CartModel.find()
                .populate({
                    path: 'cart.product',
                    select: 'id title price code'
                });
        } catch (error) {
            console.error("Error al obtener todos los carritos:", error);
            throw error;
        }
    }

    async deleteCartById(id) {
        try {
            const result = await CartModel.findByIdAndDelete(id);
            return result;
        } catch (error) {
            console.error("Error al eliminar el carrito por id:", error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            const indexProducto = cart.cart.findIndex(prod => prod.product._id.toString() === productId);
            if (indexProducto === -1) {
                throw new Error("Producto no encontrado en el carrito");
            }

            cart.cart.splice(indexProducto, 1);

            cart.markModified("cart");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        this.validateQuantity(quantity);  // Validate quantity
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");

            const existingProduct = cart.cart.find(prod => prod.product._id.toString() === productId);
            if (!existingProduct) {
                throw new Error("Producto no encontrado en el carrito");
            }

            existingProduct.quantity = quantity;
            cart.markModified("cart");
            await cart.save();
            return cart;
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto:", error);
            throw error;
        }
    }
}

export default CartManager;