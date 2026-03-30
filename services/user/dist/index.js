"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100,
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 52, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
});
const app = (0, express_1.default)();
console.log(process.env.DB_URL);
app.use((0, cors_1.default)({
    origin: "*",
    credentials: true
}));
app.use(limiter);
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use('/api/user', user_routes_js_1.default);
const port = process.env.PORT || 8005;
app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
