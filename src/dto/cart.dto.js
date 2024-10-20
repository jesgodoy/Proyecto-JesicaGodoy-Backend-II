export class CartDTO {
  constructor(cart) {
      this.id = cart._id; // ID del carrito
      this.cart = cart.cart.map(item => ({
          product: {
              id: item.product._id,
              title: item.product.title,
              price: item.product.price
          },
          quantity: item.quantity
      }));
      this.totalItems = cart.cart.reduce((sum, item) => sum + item.quantity, 0); // Total de ítems en el carrito
  }
}
