import UserRepository from '../repositories/user.reposiroy.js'
import { createHash, isValidPassword } from '../utils/util.js';

class UserService {
    async registerUser(userData) {
        userData.password = createHash(userData.password);
        return await UserRepository.registerUser(userData);
    }

    async loginUser(email, password) {
        const user = await UserRepository.loginUser(email);
        if (!user || !isValidPassword(password, user)) throw new Error("Credenciales incorrectas");
        return user;

    }

    async getAllUsers() {
        return await UserRepository.getAllUsers();
    }
}

export default new UserService();
