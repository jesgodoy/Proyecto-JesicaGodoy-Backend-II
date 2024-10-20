import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String, 
        unique: true,
        required: true, 
        default: function() {
            return `TICKET-${Math.floor(Math.random() * 1000)}`;
        }
    }, 
    purchase_datetime: {
        type: Date, 
        default: Date.now, 
        required: true
    }, 
    amount: {
        type: Number, 
        required: true
    },
    purchaser: {
        type: String, 
        required: true
    }
});

// Método para calcular el total de los productos comprados
ticketSchema.statics.calcularTotal = (productosComprados) => {
    return productosComprados.reduce((total, item) => {
        return total + (item.product.price * item.quantity); // Suponiendo que item.product tiene un campo price
    }, 0);
};

const TicketModel = mongoose.model("tickets", ticketSchema);

export default TicketModel;