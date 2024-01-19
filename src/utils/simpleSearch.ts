export default function simpleSearch(query: string, list: string[]) {
  const regex = new RegExp(query, 'i'); // 'i' flag makes the search case-insensitive

  return list.filter(item => regex.test(item));
}
