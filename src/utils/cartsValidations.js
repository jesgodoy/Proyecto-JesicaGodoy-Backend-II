

export function validateQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("La cantidad debe ser un número entero mayor a 0");
  }
}
export async function validateCartExists(cartDAO, cartId) {
  const cart = await cartDAO.findById(cartId);
  if (!cart) {
      throw new Error("Carrito no encontrado");
  }
  return cart;
}

// Función para validar que el producto existe
export async function validateProductExists(productId) {
  const product = await ProductModel.findById(productId);
  if (!product) {
      throw new Error("Producto no encontrado");
  }
  return product;
}

// Función para buscar un producto en el carrito
export function findProductInCart(cart, productId) {
  return cart.cart.find(item => item.product._id.toString() === productId.toString());
}