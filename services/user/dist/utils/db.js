"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
const serverless_1 = require("@neondatabase/serverless");
exports.sql = (0, serverless_1.neon)(process.env.DB_URL);
