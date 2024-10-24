import express from 'express';
import cartController from '../controllers/cart.controllers.js';
import CartModel from '../dao/models/cart.model.js';
import ProductModel from '../dao/models/product.model.js'
import userModel from '../dao/models/user.model.js'
import TicketModel from '../dao/models/ticket.model.js';
const router = express.Router();


router.post('/', cartController.createCart);


router.get('/', cartController.getAllCarts);


router.get('/:cid', cartController.getCart);


router.delete('/:cid', cartController.deleteCart);


router.post('/:cid/product/:pid', cartController.addProduct);


router.delete('/:cid/product/:pid', cartController.removeProduct);


router.delete('/:cid/clear', cartController.clearCart); 


router.put('/:cid/product/:pid', cartController.updateQuantity);


router.get("/:cid/purchase", async (req, res) => {
    const cartId = req.params.cid;
    try {
      
        const cart = await CartModel.findById(cartId).populate('cart.product');
        if (!cart) {
            return res.status(404).json({ error: "carrito no encontrado" });
        }

        const arrayProducts = cart.cart; 
        const productsNotAvailable = [];
        const productsPurchased = [];

        await Promise.all(arrayProducts.map(async (item) => {
            const productId = item.product._id; 
            const product = await ProductModel.findById(productId);

            if (product) {
                if (product.stock >= item.quantity) {
                    productsPurchased.push(item);
                } else {
                    productsNotAvailable.push({
                        productId: item.product,
                        title: product.title,
                        quantityRequested: item.quantity,
                        availableStock: product.stock
                    });
                }
            } else {
                productsNotAvailable.push({
                    productId: item.product,
                    title: "Producto no encontrado",
                    quantityRequested: item.quantity,
                    availableStock: 0
                });
            }
        }));

        if (productsNotAvailable.length > 0) {
            return res.status(400).json({
                message: "No se puede completar la compra. Productos sin stock suficiente:",
                productsNotAvailable,
            });
        }

        if (productsPurchased.length === 0) {
            return res.status(400).json({
                message: "No hay productos disponibles para comprar.",
            });
        }

        await Promise.all(productsPurchased.map(async (item) => {
            const productId = item.product._id;
            const product = await ProductModel.findById(productId);
            product.stock -= item.quantity; 
            await product.save();
        }));

        const usuarioDelcart = await userModel.findOne({ cart: cartId });
        const ticket = new TicketModel({
            purchase_datetime: new Date(),
            amount: TicketModel.calcularTotal(productsPurchased),
            purchaser: usuarioDelcart.email,
        });

        await ticket.save();

        // Vaciar el carrito después de la compra
        await CartModel.findByIdAndUpdate(cartId, { $set: { cart: [] } });

        res.json({
            message: "Compra generada",
            ticket: {
                id: ticket._id,
                amount: ticket.amount,
                purchaser: ticket.purchaser,
            }
        });
    } catch (error) {
        console.error("Error al crear ticket:", error);
        res.status(500).send("Error del servidor al crear ticket");
    }
});







export default router;
