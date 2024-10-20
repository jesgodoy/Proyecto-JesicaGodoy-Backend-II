import express from 'express';
import cartController from '../controllers/cart.controllers.js';

const router = express.Router();


router.post('/', cartController.createCart);


router.get('/', cartController.getAllCarts);


router.get('/:cid', cartController.getCart);


router.delete('/:cid', cartController.deleteCart);


router.post('/:cid/products/:pid', cartController.addProduct);


router.delete('/:cid/products/:pid', cartController.removeProduct);


router.delete('/:cid/clear', cartController.clearCart); 


router.put('/:cid/products/:pid', cartController.updateQuantity);









export default router;
