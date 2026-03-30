"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jwt_Token_Generator = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Jwt_Token_Generator = (email, role) => {
    return jsonwebtoken_1.default.sign({ role, email }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};
exports.Jwt_Token_Generator = Jwt_Token_Generator;
