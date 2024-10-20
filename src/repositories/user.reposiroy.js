// repository/user.repository.js
import UserDAO from '../dao/user.dao.js';

import cartDao from'../dao/cart.dao.js'
import { UserDTO } from '../dto/user.dto.js';


class UserRepository {
    async registerUser(userData) {
        const existingUser = await UserDAO.findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error("El usuario ya existe.");
        }
        const newCart = await cartDao.create();
        userData.cart = newCart._id;
        return await UserDAO.createUser(userData);
    }

    async loginUser(email) {
        return  await UserDAO.findUserByEmail(email);
        
    }

    async getAllUsers() {
        const users= await UserDAO.getAllUsers();
        return users.map(user => new UserDTO(user))
    }
}

export default new UserRepository();
