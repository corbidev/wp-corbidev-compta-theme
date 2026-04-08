import { useTransactionsStore } from "../store/transactions.store";

export const TransactionFilters = () => {
  const { filters, setFilters, resetFilters } = useTransactionsStore();

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-white">
      {/* 🔍 Recherche */}
      <input
        placeholder="Recherche..."
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        className="w-full border rounded px-2 py-1 text-sm"
      />

      {/* 📅 Dates */}
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={filters.dateStart}
          onChange={(e) => setFilters({ dateStart: e.target.value })}
          className="border rounded px-2 py-1 text-sm"
        />

        <input
          type="date"
          value={filters.dateEnd}
          onChange={(e) => setFilters({ dateEnd: e.target.value })}
          className="border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* 💰 Type */}
      <select
        value={filters.type}
        onChange={(e) => setFilters({ type: e.target.value })}
        className="w-full border rounded px-2 py-1 text-sm"
      >
        <option value="">Tous</option>
        <option value="credit">Crédit</option>
        <option value="debit">Débit</option>
      </select>

      {/* 💸 Montant */}
      <div className="flex gap-2">
        <select
          value={filters.amountOperator}
          onChange={(e) => setFilters({ amountOperator: e.target.value })}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">=</option>
          <option value="gt">&gt;</option>
          <option value="lt">&lt;</option>
          <option value="eq">=</option>
        </select>

        <input
          type="number"
          placeholder="Montant"
          value={filters.amountValue}
          onChange={(e) => setFilters({ amountValue: e.target.value })}
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* 🔄 Reset */}
      <button
        onClick={resetFilters}
        className="text-xs text-slate-500 underline"
      >
        Réinitialiser
      </button>
    </div>
  );
};