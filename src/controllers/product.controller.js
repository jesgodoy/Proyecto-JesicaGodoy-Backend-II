import productService from '../services/product.service.js';

class ProductController {
  async addProduct(req, res) {
    try {
      const newProduct = await productService.addProduct(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProducts(req, res) {
    try {
      const { limit, page, sort, query } = req.query;
      const result = await productService.getProducts({ limit, page, sort, query });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = req.params.pid; 
      const product = await productService.getProductById(productId);  
      if (!product) {
          return res.status(404).render('error', { message: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const productId = req.params.pid;  
      console.log(productId)
      const updatedProduct = await productService.updateProduct(productId, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
  try {
    const productId = req.params.pid; 
    await productService.deleteProduct(productId);
    res.status(200).json({ message: `Producto con ID ${productId} eliminado correctamente.` });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
 

    async renderProducts(req, res) {
      try {
        const { page = 1, limit = 4, sort, query } = req.query;
  
      
        const queryOptions = {};
        const sortOptions = sort ? { price: sort === 'desc' ? -1 : 1 } : {};
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const productos = await productService.getProducts({ limit, page, sort, query });
  

        const productArray = productos.docs.map((producto) => producto.toObject());
      
     
        res.render("products", {
          productos: productArray,
          hasPrevPage: productos.hasPrevPage,
          hasNextPage: productos.hasNextPage,
          prevPage: productos.prevPage,
          nextPage: productos.nextPage,
          currentPage: productos.page,
          totalPages: productos.totalPages,
          query: query, 
          sort: sort
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  
 
    async renderDetailProduct(req, res) {
      try {
          const productId = req.params.pid;  
          const product = await productService.getProductById(productId);  
  
          if (!product) {
           
              return res.status(404).render('error', { message: 'Producto no encontrado' });
          }
  

          res.render('product-detail', {
              product: product.toObject ? product.toObject() : product  
          });
      } catch (error) {
  
          console.error("Error al obtener el producto:", error);
          res.status(500).json({ error: 'Error al obtener el producto' });
      }
  }
}

export default new ProductController();