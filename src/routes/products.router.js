import express from 'express';
import ProductManager from '../dao/db/products-manager-db.js';

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const { limit = 15, page = 1, sort, query } = req.query;

        const products = await productManager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink,
        });

    } catch (error) {
        console.error("Error getting products", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
});

router.get('/:pid', async (req, res) => {
    const id = req.params.pid;
    try {
        const searchProduct = await productManager.getProductById(id);
        res.status(200).json(searchProduct);
    } catch (error) {
        res.status(404).json({
            error: "Producto no encontrado",
            message: "El producto con el ID proporcionado no existe."
        });
    }
});

router.post('/', async (req, res) => {
    const newProduct = req.body;
    try {
        const addedProduct = await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Producto agregado correctamente",
            product: addedProduct
        });
    } catch (error) {
        if (error.message.includes("son obligatorios")) {
            res.status(400).json({
                error: "Datos faltantes",
                message: error.message
            });
        } else if (error.message.includes("código del producto ya existe")) {
            res.status(400).json({
                error: "Código duplicado",
                message: error.message
            });
        } else if (error.message.includes("El precio debe ser")) {
            res.status(400).json({
                error: "Precio inválido",
                message: error.message
            });
        } else if (error.message.includes("El stock no puede ser")) {
            res.status(400).json({
                error: "Stock inválido",
                message: error.message
            });
        }else {
            res.status(500).json({
                error: "Error interno del servidor"
            });
        }
    }
});

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        const updated = await productManager.updateProduct(id, updatedProduct);
        res.status(200).json({
            message: "Producto actualizado correctamente",
            product: updated
        });
    } catch (error) {
        if (error.message.includes("Producto no encontrado")) {
            res.status(404).json({
                error: "Producto no encontrado",
                message: "No se encontró el producto con el ID proporcionado."
            });
        } else {
            res.status(400).json({
                error: "Actualización fallida",
                message: error.message
            });
        }
    }
});

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;

    try {
        const result = await productManager.deleteProduct(id);
        res.status(200).json({
            message: "Producto eliminado correctamente"
        });
    } catch (error) {
        res.status(404).json({
            error: "Producto no encontrado",
            message: "No se encontró el producto con el ID proporcionado."
        });
    }
});

export default router;
