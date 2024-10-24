export class UserDTO {
    constructor(user) {
        this.email = user.email;
        this.role = user.role;
        this.first_name = user.first_name;
        this.cart = user.cart
    }
}
