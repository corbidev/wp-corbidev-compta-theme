import { useCallback, useEffect, useState } from "react";
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
import { useAjax } from "@frontend/hooks/useAjax";

import type { Account } from "@frontend/pages/AccountsPage";

/** 🔥 NOUVEAUX COMPOSANTS */
import { TransactionsFilters } from "./components/TransactionsFilters";
import { TransactionsTable } from "./components/TransactionsTable";
import { TransactionsStats } from "./components/TransactionsStats";

interface Transaction {
  fitid: string;
  amount: string;
  dt_posted?: string | null;
  dt_avail?: string | null;
  trn_type?: string | null;
  name?: string | null;
  memo?: string | null;
  account_id?: string | null;
}

interface TransactionsResponse {
  transactions?: Transaction[];
  total?: number;
}

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
  const { get } = useAjax();

  const [accountId, setAccountId] = useState(initialAccount ?? "all");
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadTransactions = useCallback(async () => {
    setLoading(true);

    try {
      const data = await get<TransactionsResponse>(
        "cdcompta_get_transactions",
        {
          account_id: accountId === "all" ? "" : accountId,
          date_start: dateStart,
          date_end: dateEnd,
          limit: 200,
          order: "DESC",
        }
      );

      setTransactions(data.transactions ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setTransactions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [accountId, dateEnd, dateStart, get]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const handleReset = () => {
    setAccountId(initialAccount ?? "all");
    setDateStart("");
    setDateEnd("");
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <Card className="border-none bg-gradient-to-r from-white via-slate-50 to-emerald-50">
        <CardHeader className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(true)}>
                <FileUp className="h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>

          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Analyse des opérations
          </CardDescription>
        </CardHeader>

        <CardContent>
          <TransactionsFilters
            accountId={accountId}
            setAccountId={setAccountId}
            dateStart={dateStart}
            setDateStart={setDateStart}
            dateEnd={dateEnd}
            setDateEnd={setDateEnd}
            accounts={accounts}
            total={total}
          />
        </CardContent>
      </Card>

      {/* STATS */}
      <TransactionsStats transactions={transactions} />

      {/* TABLE */}
      <TransactionsTable
        transactions={transactions}
        loading={loading}
        accountId={accountId}
        dateStart={dateStart}
        dateEnd={dateEnd}
      />

      {/* IMPORT */}
      <ImportDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setDialogOpen(false);
          onImportSuccess?.();
          void loadTransactions();
        }}
      />
    </div>
  );
}