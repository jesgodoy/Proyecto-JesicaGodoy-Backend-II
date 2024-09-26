import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: { type: String, unique: true },
    age: {
        type: Number,
        validate: {
            validator: function(v) {
                return v >= 0 && v <= 120; 
            },
            message: props => `${props.value} no es una edad válida!`
        }
    },
    password: String,
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
});

const UserModel = mongoose.model("user", userSchema);
export default UserModel;