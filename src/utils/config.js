"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const process_1 = __importDefault(require("process"));
const config = {
    NODE_ENV: process_1.default.env.NODE_ENV || 'production',
    BOT_TOKEN: process_1.default.env.BOT_TOKEN || '',
    APPLICATION_ID: process_1.default.env.APPLICATION_ID || '',
    SERVER_ID: process_1.default.env.SERVER_ID || '',
};
exports.default = config;
