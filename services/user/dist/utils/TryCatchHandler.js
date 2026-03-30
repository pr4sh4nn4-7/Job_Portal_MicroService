"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TryCatchHandler = void 0;
const error_js_1 = __importDefault(require("./error.js"));
const TryCatchHandler = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    }
    catch (err) {
        if (err instanceof error_js_1.default) {
            return res.status(err.statusCode).json({
                message: err.message
            });
        }
        console.log("user error" + err);
        return res.status(500).json({
            message: err.message
        });
    }
};
exports.TryCatchHandler = TryCatchHandler;
