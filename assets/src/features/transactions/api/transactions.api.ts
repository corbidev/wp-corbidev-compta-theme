const API_URL = "/wp-json/my-plugin/v1";

export const fetchTransactions = async () => {
  const res = await fetch(`${API_URL}/transactions`);
  if (!res.ok) throw new Error("API error");
  return res.json();
};