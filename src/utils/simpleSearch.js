"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function simpleSearch(query, list) {
    const regex = new RegExp(query, 'i'); // 'i' flag makes the search case-insensitive
    return list.filter(item => regex.test(item));
}
exports.default = simpleSearch;
