import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { DashboardStats } from "./components/DashboardStats";

export const DashboardPage = () => {
  const { data = [], isLoading } = useTransactions();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1>Dashboard</h1>
      <DashboardStats data={data} />
    </div>
  );
};