import ProductModel from './models/product.model.js';

class ProductDAO {
  async create(productData) {
    const newProduct = new ProductModel(productData);
    return await newProduct.save();
  }

  async findByCode(code) {
    return await ProductModel.findOne({ code });
  }

  async findById(id) {
    return await ProductModel.findById(id);
  }

  async find(queryOptions, sortOptions, skip, limit) {
    return await ProductModel
      .find(queryOptions)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
  }

  async countDocuments(queryOptions) {
    return await ProductModel.countDocuments(queryOptions);
  }

  async findByIdAndUpdate(id, updateData) {
    return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByIdAndDelete(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}

export default new ProductDAO();