import { Router } from 'express';
import productController from '../controllers/product.controller.js';

const router = Router();

router.post('/', productController.addProduct);
router.get('/', productController.getProducts);
router.get('/:pid', productController.getProductById);
router.put('/:pid', productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

export default router;
