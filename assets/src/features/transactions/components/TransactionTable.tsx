import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function formatAmount(amount: number): string {
  return `${amount.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

export function TransactionTable({
  transactions = [],
  loading,
}: any) {
  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-sm text-slate-500">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700" />
          Chargement...
        </div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center text-slate-500 py-10">
        Aucune transaction
      </div>
    );
  }

  return (
    <>
      {/* 📱 MOBILE VIEW */}
      <div className="space-y-2 md:hidden">
        {transactions.map((t: any, index: number) => {
          const amount = Number.parseFloat(t.amount || "0");
          const isCredit = amount > 0;

          return (
            <div
              key={t.fitid}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50"
              } ${
                isCredit
                  ? "border-l-4 border-l-emerald-400"
                  : "border-l-4 border-l-red-400"
              } hover:bg-slate-100`}
            >
              {/* Ligne principale */}
              <div className="flex justify-between items-center">
                <div className="font-medium text-sm leading-tight">
                  {t.name ?? "—"}
                </div>

                <div
                  className={`font-semibold text-sm ${
                    isCredit ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {isCredit ? "+" : ""}
                  {formatAmount(amount)}
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-slate-500 mt-0.5 leading-tight truncate">
                {t.memo ?? ""}
              </div>

              {/* Infos secondaires */}
              <div className="flex justify-between text-[11px] mt-1 text-slate-400">
                <span>{t.dt_posted ?? "—"}</span>
                <span>{t.trn_type ?? "—"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 💻 DESKTOP TABLE */}
      <div className="hidden md:block overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.map((t: any, index: number) => {
              const amount = Number.parseFloat(t.amount || "0");
              const isCredit = amount > 0;

              return (
                <TableRow
                  key={t.fitid}
                  className={
                    index % 2 === 0
                      ? "bg-white"
                      : "bg-slate-50"
                  }
                >
                  <TableCell>{t.dt_posted ?? "—"}</TableCell>

                  <TableCell className="font-medium">
                    {t.name ?? "—"}
                  </TableCell>

                  <TableCell className="text-sm text-slate-500">
                    {t.memo ?? "—"}
                  </TableCell>

                  <TableCell>{t.trn_type ?? "—"}</TableCell>

                  <TableCell className="text-right">
                    <Badge
                      variant={isCredit ? "secondary" : "destructive"}
                      className={
                        isCredit
                          ? "bg-emerald-100 text-emerald-700"
                          : ""
                      }
                    >
                      {isCredit ? "+" : ""}
                      {formatAmount(amount)}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}