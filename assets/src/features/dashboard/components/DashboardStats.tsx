import { Transaction } from "@/features/transactions/types";

export const DashboardStats = ({ data }: { data: Transaction[] }) => {
  const income = data.filter(t => t.type === "income").reduce((a,t)=>a+t.amount,0);
  const expense = data.filter(t => t.type === "expense").reduce((a,t)=>a+t.amount,0);
  const balance = income - expense;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>Revenus: {income}€</div>
      <div>Dépenses: {expense}€</div>
      <div>Solde: {balance}€</div>
    </div>
  );
};