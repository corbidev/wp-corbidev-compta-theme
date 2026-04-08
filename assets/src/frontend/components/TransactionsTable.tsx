export function TransactionsTable({ transactions, loading }: any) {
  if (loading) return <div>Chargement...</div>;
  if (!transactions.length) return <div>Aucune donnée</div>;

  return (
    <div className="overflow-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th>Date</th>
            <th>Libellé</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t: any) => (
            <tr key={t.fitid}>
              <td>{t.dt_posted}</td>
              <td>{t.name}</td>
              <td>{t.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}