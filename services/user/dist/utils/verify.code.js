"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gen_verfification_code = void 0;
const gen_verfification_code = (length = 6) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        code += chars[randomIndex];
    }
    return code;
};
exports.gen_verfification_code = gen_verfification_code;
