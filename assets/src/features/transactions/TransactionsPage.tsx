import { useState } from "react";
import { ArrowLeft, FileUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { ImportDialog } from "@frontend/components/ImportDialog";
import type { Account } from "@frontend/pages/AccountsPage";

import { useTransactionsStore } from "./store/transactions.store";
import { TransactionFilters } from "./components/TransactionFilters";
import { TransactionTable } from "./components/TransactionTable";
import { TransactionStats } from "./components/TransactionStats";

import { useTransactionsQuery } from "./hooks/useTransactionsQuery";

interface Props {
  initialAccount?: string;
  accounts: Account[];
  onBack: () => void;
  onImportSuccess?: () => void;
}

export function TransactionsPage({
  initialAccount,
  accounts,
  onBack,
  onImportSuccess,
}: Props) {
  const [accountId, setAccountId] = useState(initialAccount ?? "all");
  const [dialogOpen, setDialogOpen] = useState(false);

  /**
   * 🔥 STORE (filtres)
   */
  const { filters } = useTransactionsStore();

  /**
   * 🔥 DATA (React Query)
   */
  const { data, isLoading, isFetching, refetch } = useTransactionsQuery({
    accountId,
    dateStart: filters.dateStart,
    dateEnd: filters.dateEnd,
  });

  const transactions = data?.transactions ?? [];
  const total = data?.total ?? 0;

  /**
   * 🔥 FILTRAGE FRONT (instantané UX)
   */
  const filteredTransactions = transactions.filter((t: any) => {
    const amount = Number(t.amount || 0);

    // 🔍 recherche
    if (
      filters.search &&
      !(`${t.name ?? ""} ${t.memo ?? ""}`
        .toLowerCase()
        .includes(filters.search.toLowerCase()))
    ) {
      return false;
    }

    // 💰 type
    if (filters.type === "credit" && amount <= 0) return false;
    if (filters.type === "debit" && amount >= 0) return false;

    // 💸 montant
    if (filters.amountValue) {
      const value = Number(filters.amountValue);

      if (filters.amountOperator === "gt" && amount <= value) return false;
      if (filters.amountOperator === "lt" && amount >= value) return false;
      if (filters.amountOperator === "eq" && amount !== value) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* HEADER + FILTRES */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2">
            <Button onClick={() => setDialogOpen(true)}>
              <FileUp className="h-4 w-4" />
              Import
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <TransactionFilters />
        </CardContent>
      </Card>

      {/* 📊 RÉSUMÉ */}
      <Card className="border-none shadow-sm">
  <CardContent className="p-4 space-y-3">
    <div className="text-xs text-slate-500 uppercase tracking-wide">
      Résumé
    </div>

    <TransactionStats transactions={filteredTransactions} />
  </CardContent>
</Card>

      {/* 📋 TABLE */}
      <TransactionTable
        transactions={filteredTransactions}
        loading={isLoading || isFetching}
      />

      {/* 📥 IMPORT */}
      <ImportDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setDialogOpen(false);
          onImportSuccess?.();
          refetch();
        }}
      />
    </div>
  );
}