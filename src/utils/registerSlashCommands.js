"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
function registerSlashCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        const rest = new discord_js_1.REST({ version: '10' }).setToken(config_1.default.BOT_TOKEN);
        const commands = [];
        const importPromises = [];
        const commandsPath = path_1.default.join(__dirname, '..', 'commands');
        const commandsFiles = fs_1.default
            .readdirSync(commandsPath)
            .filter((file) => file.endsWith(config_1.default.NODE_ENV === 'production' ? '.js' : '.ts'));
        commandsFiles.forEach((file) => __awaiter(this, void 0, void 0, function* () {
            const filePath = path_1.default.join(commandsPath, file);
            importPromises.push(Promise.resolve(`${filePath}`).then(s => __importStar(require(s))));
        }));
        const importedCommands = yield Promise.all(importPromises);
        importedCommands.forEach(file => {
            commands.push(file.default.data.toJSON());
        });
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            // The put method is used to fully refresh all commands in the guild with the current set
            const data = (yield rest.put(discord_js_1.Routes.applicationCommands(config_1.default.APPLICATION_ID), { body: commands }));
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.default = registerSlashCommands;
