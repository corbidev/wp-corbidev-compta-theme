export function TransactionsStats({ transactions }: { transactions: any[] }) {
  const total = transactions.reduce(
    (acc, t) => acc + Number.parseFloat(t.amount),
    0
  );

  return (
    <div className="p-4 border rounded">
      Total: {total.toFixed(2)} €
    </div>
  );
}