/**
 * Get a user-friendly error message from an error.
 *
 * @param err - The error object.
 * @returns A user-friendly error message based on the error.
 */
export default function getErrorMessage(err: any) {
  return err.message || 'An unexpected error occurred, please try again later';
}
