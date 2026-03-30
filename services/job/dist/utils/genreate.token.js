import jwt from 'jsonwebtoken';
export const Jwt_Token_Generator = (email, role) => {
    return jwt.sign({ role, email }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};
