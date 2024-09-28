import jwt from 'jsonwebtoken';

const secretKey = "Beauty";

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            first_name: user.first_name, 
            last_name: user.last_name, 
            email: user.email, 
            role: user.role 
        }, 
        secretKey, 
        { expiresIn: "1h" }
    );
};



export {generateToken};