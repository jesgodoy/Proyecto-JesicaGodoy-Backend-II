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
 
    // Renderizar página de productos con Handlebars
    async renderProducts(req, res) {
      try {
        const { page = 1, limit = 4, sort, query } = req.query;
  
        // Configurando opciones de consulta y paginación
        const queryOptions = {};
        const sortOptions = sort ? { price: sort === 'desc' ? -1 : 1 } : {};
        const skip = (parseInt(page) - 1) * parseInt(limit);
  
        // Llamamos al servicio para obtener los productos
        const productos = await productService.getProducts({ limit, page, sort, query });
  
        // Convertimos los productos en objetos planos
        const productArray = productos.docs.map((producto) => producto.toObject());
      
        // Renderizamos la vista con los productos y la información de la paginación
        res.render("products", {
          productos: productArray,
          hasPrevPage: productos.hasPrevPage,
          hasNextPage: productos.hasNextPage,
          prevPage: productos.prevPage,
          nextPage: productos.nextPage,
          currentPage: productos.page,
          totalPages: productos.totalPages,
          query: query,  // Para mostrar en el formulario de búsqueda
          sort: sort,    // Para mantener el estado de la ordenación
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  
    // Renderizar página de un producto específico
    async renderDetailProduct(req, res) {
      try {
          const productId = req.params.pid;  // Obtener el ID del producto desde los parámetros de la URL
          const product = await productService.getProductById(productId);  // Llamada al servicio para obtener el producto
  
          if (!product) {
              // Si el producto no se encuentra, renderizamos una página de error o devolvemos un error 404
              return res.status(404).render('error', { message: 'Producto no encontrado' });
          }
  
          // Renderizamos la vista del detalle del producto, pasando los datos del producto
          res.render('product-detail', {
              product: product.toObject ? product.toObject() : product  // Aseguramos que el producto sea un objeto, si es necesario
          });
      } catch (error) {
          // Si ocurre un error durante el proceso, lo mostramos en la consola y devolvemos un error 500
          console.error("Error al obtener el producto:", error);
          res.status(500).json({ error: 'Error al obtener el producto' });
      }
  }
}

export default new ProductController();