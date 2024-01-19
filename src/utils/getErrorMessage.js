"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get a user-friendly error message from an Axios error.
 *
 * @param err - The Axios error object.
 * @returns {string} A user-friendly error message based on the Axios error.
 */
function getErrorMessage(err) {
    return err.message || 'An unexpected error occurred, please try again later';
}
exports.default = getErrorMessage;
