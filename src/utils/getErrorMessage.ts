/**
 * Get a user-friendly error message from an Axios error.
 *
 * @param err - The Axios error object.
 * @returns {string} A user-friendly error message based on the Axios error.
 */
export default function getErrorMessage(err: any): string {
  return err.message || 'An unexpected error occurred, please try again later';
}
