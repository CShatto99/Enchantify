/**
 * Performs a simple case-insensitive search in a list based on a query.
 *
 * @param query - The search query.
 * @param list - The list of strings to search within.
 * @returns An array containing the strings from the list that match the search query.
 */
export default function simpleSearch(query: string, list: string[]) {
  const regex = new RegExp(query, 'i'); // 'i' flag makes the search case-insensitive

  return list.filter(item => regex.test(item));
}
