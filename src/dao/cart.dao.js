import CartModel from "./models/cart.model.js";
import ProductModel from './models/product.model.js';


class CartDAO {

    async create() {
        const newCart = new CartModel();
        return await newCart.save();
    }


    async findById(id) {
     
        const cart = await CartModel.findById(id).populate('cart.product');
       
        return cart;
    }

    async findAll() {
        return await CartModel.find().populate('cart.product');
    }


    async deleteById(id) {
       
        return await CartModel.findByIdAndDelete(id);
       
    }

    async addProductToCart(cartId, productId, quantity) {

            if (!cartId || !productId) {
                throw new Error("Cart ID y Product ID son requeridos");
            }
    
            const cart = await this.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
    
            
            const existingProduct = cart.cart.find(item => item.product._id.toString() === product._id.toString());
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.cart.push({ product: productId, quantity });
            }
    
            return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        if (!cartId || !productId) {
            throw new Error("Cart ID y Product ID son requeridos");
        }
    
        const cart = await this.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
    
        const product = await ProductModel.findById(productId);
        if (!product) {
            throw new Error("Producto no encontrado");
        }
    
      
        
     
        const existingProduct = cart.cart.find(item => item.product._id.toString() === product._id.toString());
        
        if (existingProduct) {
       
            cart.cart = cart.cart.filter(item => item._id.toString() !== existingProduct._id.toString());
            
        
            const updatedCart = await cart.save();
            
            return updatedCart;
        } else {
            console.log("El producto no se encontró en el carrito.");
            return cart; 
        }
    }

    async clearCart(cartId) {
        const cart = await this.findById(cartId);
        cart.cart = [];
        return await cart.save();
    }

    async updateProductQuantity(cartId, productId, quantity) {
        if (!cartId || !productId) {
            throw new Error("Cart ID y Product ID son requeridos");
        }

        const cart = await this.findById(cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
            const product = await ProductModel.findById(productId);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

           
        const existingProduct = cart.cart.find(item => item.product._id.toString() === product._id.toString());

        if (!existingProduct) {
            throw new Error("Producto no encontrado en el carrito");
        }else {
            existingProduct.quantity = quantity;
        }

        if (quantity <= 0) {
            await this.removeProductFromCart(cartId, productId);
        } else {
            existingProduct.quantity = quantity;
        }

        return await cart.save();
    }

}

export default new CartDAO();