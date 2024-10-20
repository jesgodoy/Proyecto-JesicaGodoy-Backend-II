import productDAO from '../dao/product.dao.js';

class ProductRepository {
  async addProduct(productData) {
    return await productDAO.create(productData);
  }

  async getProductByCode(code) {
    return await productDAO.findByCode(code);
  }

  async getProducts(queryOptions, sortOptions, skip, limit) {
    return await productDAO.find(queryOptions, sortOptions, skip, limit);
  }

  async getTotalProducts(queryOptions) {
    return await productDAO.countDocuments(queryOptions);
  }

  async getProductById(id) {
    return await productDAO.findById(id);
  }

  async updateProduct(id, updateData) {
    return await productDAO.findByIdAndUpdate(id, updateData);
  }

  async deleteProduct(id) {
    return await productDAO.findByIdAndDelete(id);
  }
}

export default new ProductRepository();