// dao/user.dao.js
import UserModel from './models/user.model.js';

class UserDAO {
    async findUserById(id) {
        return await UserModel.findById(id);
    }

    async findUserByEmail(email) {
        return await UserModel.findOne({ email });
    }

    async createUser(userData) {
        return await UserModel.create(userData);
    }

    async getAllUsers() {
        return await UserModel.find({});
    }
}

export default new UserDAO();
