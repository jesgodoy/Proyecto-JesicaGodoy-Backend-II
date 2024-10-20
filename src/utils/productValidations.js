import productRepository from '../repositories/product.repository.js';

const validatePrice = (price) => {
  if (typeof price !== 'number' || price <= 0) {
    throw new Error('El precio debe ser un número mayor a 0.');
  }
};

const validateStock = (stock) => {
  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error('El stock debe ser un número entero no negativo.');
  }
};

const validateRequiredFields = (data, fields) => {
  for (const field of fields) {
    if (data[field] == null) {
      throw new Error(`El campo ${field} es obligatorio.`);
    }
  }
};

export async function validateProductCode(code, currentProductId = null) {
  const existingProduct = await productRepository.getProductByCode(code);
  if (existingProduct && existingProduct._id.toString() !== currentProductId) {
    throw new Error('El código del producto ya existe. Por favor, ingrese un código diferente.');
  }
}

export async function validateProduct(productData) {
  const requiredFields = ['title', 'category', 'description', 'price', 'img', 'code', 'stock'];
  validateRequiredFields(productData, requiredFields);
  validatePrice(productData.price);
  validateStock(productData.stock);
  await validateProductCode(productData.code);
}

export async function validateUpdateProduct(updateData, productId) {
  if (updateData.price !== undefined) {
    validatePrice(updateData.price);
  }
  if (updateData.stock !== undefined) {
    validateStock(updateData.stock);
  }
  if (updateData.code !== undefined) {
    await validateProductCode(updateData.code, productId);
  }
}