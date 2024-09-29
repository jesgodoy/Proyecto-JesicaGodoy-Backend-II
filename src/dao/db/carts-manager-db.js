import CartModel from "../models/cart.model.js";

class CartManager {
    
    validateQuantity(quantity) {
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error("La cantidad debe ser un número entero mayor a 0");
        }
    }

    async addCart() {
        try {
            const newCart = new CartModel();
            await newCart.save();
            return newCart;
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
            const totalItems = cart.cart.reduce((sum, item) => sum + item.quantity, 0);
            cart.totalItems = totalItems;
            
            return cart || null;
        } catch (error) {
            console.error("Error al obtener el carrito por id:", error);
            throw error;
        }
    }

    async addProductToCart(id, productId, quantity = 1) {
        this.validateQuantity(quantity);  
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
           
            cart.totalItems = cart.cart.reduce((sum, item) => sum + item.quantity, 0);
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

    async updateCart(cartId, updatedCart) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
            s
            cart.cart = updatedCart.cart || cart.cart;
            cart.totalItems = updatedCart.totalItems || cart.totalItems;
    
            await cart.save();
            return cart; 
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    }

    async clearCart(cartId) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        cart.cart = []; 
        cart.totalItems = 0; 
        await this.updateCart(cartId, cart);
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const productIndex = cart.cart.findIndex(item => item.product._id.toString() === productId);
        if (productIndex === -1) {
            throw new Error("Producto no encontrado en el carrito");
        }

        cart.cart.splice(productIndex, 1); 
        cart.totalItems -= 1; 
        await this.updateCart(cartId, cart);
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        this.validateQuantity(quantity);  
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