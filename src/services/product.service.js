

import productRepository from '../repositories/product.repository.js';
import { validateProduct, validateUpdateProduct } from '../utils/productValidations.js';
import { buildQueryOptions } from '../utils/queryUtils.js';

class ProductService {
  async addProduct(productData) {
    await validateProduct(productData);
    return await productRepository.addProduct(productData);
  }

  async getProducts(query = {}) {
    const { limit, skip, sortOptions } = buildQueryOptions(query);
    const page = Math.floor(skip / limit) + 1;

    let queryOptions = {};
    if (query.category) {
      queryOptions.category = query.category;
    }

    const productos = await productRepository.getProducts(queryOptions, sortOptions, skip, limit);
    const totalProducts = await productRepository.getTotalProducts(queryOptions);
    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      docs: productos,
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${query.sort}&category=${query.category}` : null,
      nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${query.sort}&category=${query.category}` : null,
    };
  }

  async getProductById(id) {
    const product = await productRepository.getProductById(id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  async updateProduct(id, updateData) {
    await validateUpdateProduct(updateData, id);
    const updatedProduct = await productRepository.updateProduct(id, updateData);
    if (!updatedProduct) {
      throw new Error("Producto no encontrado");
    }
    return updatedProduct;
  }

  async deleteProduct(id) {
    const result = await productRepository.deleteProduct(id);
    if (!result) {
      throw new Error("Producto no encontrado");
    }
    return result;
  }
}

export default new ProductService();