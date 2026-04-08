export const TransactionStats = ({
  transactions = [],
}: {
  transactions?: any[];
}) => {
  const safe = transactions ?? [];

  const income = safe
    .filter((t) => Number(t.amount) > 0)
    .reduce((a, t) => a + Number(t.amount || 0), 0);

  const expense = safe
    .filter((t) => Number(t.amount) < 0)
    .reduce((a, t) => a + Number(t.amount || 0), 0);

  const balance = income + expense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* 💰 Revenus */}
      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
        <div className="text-xs text-emerald-700 uppercase">
          Revenus
        </div>
        <div className="text-lg font-semibold text-emerald-800">
          {income.toFixed(2)} €
        </div>
      </div>

      {/* 💸 Dépenses */}
      <div className="p-3 rounded-xl bg-red-50 border border-red-100">
        <div className="text-xs text-red-700 uppercase">
          Dépenses
        </div>
        <div className="text-lg font-semibold text-red-800">
          {expense.toFixed(2)} €
        </div>
      </div>

      {/* 📊 Solde */}
      <div className="p-3 rounded-xl bg-slate-900 text-white">
        <div className="text-xs uppercase opacity-70">
          Solde
        </div>
        <div className="text-lg font-semibold">
          {balance.toFixed(2)} €
        </div>
      </div>
    </div>
  );
};