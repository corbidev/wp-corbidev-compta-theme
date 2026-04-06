import { useState } from 'react';
import { ArrowRight, FileUp, Landmark, ReceiptText } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Badge } from '@/components/ui/badge';
import { ImportDialog } from '@frontend/components/ImportDialog';

export interface Account {
    account_id: string;
    bank_id?: string | null;
    branch_id?: string | null;
    currency?: string | null;
    transaction_count?: number;
    date_start?: string | null;
    date_end?: string | null;
    last_import?: string | null;
}

interface AccountsPageProps {
    accounts: Account[];
    loading: boolean;
    onViewTransactions: (accountId: string) => void;
    onImportSuccess?: () => void;
}

export function AccountsPage({
  accounts,
  loading,
  onViewTransactions,
  onImportSuccess,
}: AccountsPageProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const totalTransactions = accounts.reduce(
    (sum, account) => sum + (account.transaction_count ?? 0),
    0,
  );

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white shadow-xl ring-0">
        <CardHeader className="gap-4 px-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <CardTitle className="text-3xl font-semibold tracking-tight">
            Comptabilité
          </CardTitle>
          <CardDescription className="max-w-2xl text-slate-300">
            Consolidez vos comptes et importez vos relevés OFX depuis une
            interface React chargée uniquement par Vite.
          </CardDescription>
          <CardAction className="col-start-auto row-span-1 row-start-auto justify-self-start lg:justify-self-end">
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-white text-slate-950 hover:bg-slate-100"
            >
              <FileUp className="h-4 w-4" />
              Importer un fichier OFX
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="grid gap-3 px-4 pb-4 sm:px-5 md:grid-cols-3 xl:grid-cols-4">
          <MetricCard
            icon={<Landmark className="h-5 w-5" />}
            label="Comptes"
            value={loading ? "..." : String(accounts.length)}
          />
          <MetricCard
            icon={<ReceiptText className="h-5 w-5" />}
            label="Transactions"
            value={loading ? "..." : String(totalTransactions)}
          />
          <MetricCard
            icon={<FileUp className="h-5 w-5" />}
            label="Dernier état"
            value={
              loading
                ? "Chargement"
                : accounts.length > 0
                ? "Synchronisé"
                : "En attente"
            }
          />
          <MetricCard
            icon={<ArrowRight className="h-5 w-5" />}
            label="Navigation"
            value={loading ? "..." : accounts.length > 0 ? "Active" : "Vide"}
          />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="gap-2 px-4 sm:px-5">
          <CardTitle>Liste des comptes</CardTitle>
          <CardDescription>
            {loading
              ? "Chargement des comptes..."
              : `${accounts.length} compte${
                  accounts.length > 1 ? "s" : ""
                } disponible${accounts.length > 1 ? "s" : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0 sm:px-0">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-sm text-slate-500">
              Chargement des comptes...
            </div>
          ) : accounts.length === 0 ? (
            <Empty className="border border-dashed border-slate-200 bg-slate-50">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileUp className="h-5 w-5" />
                </EmptyMedia>
                <EmptyTitle>Aucun compte importé</EmptyTitle>
                <EmptyDescription>
                  Importez un premier fichier OFX pour initialiser la
                  comptabilité.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button variant="outline" onClick={() => setDialogOpen(true)}>
                  Commencer l'import
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="overflow-hidden rounded-[1.25rem] border-y border-slate-200 bg-white sm:mx-4 sm:mb-4 sm:rounded-[1.25rem] sm:border">
              <Table className="min-w-[68rem]">
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead>Compte</TableHead>
                    <TableHead>Banque</TableHead>
                    <TableHead>Agence</TableHead>
                    <TableHead>Devise</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Dernier import</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.account_id}>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-mono font-semibold text-slate-950">
                            {account.account_id}
                          </span>
                          <Badge variant="secondary" className="w-fit">
                            {account.currency ?? "N/A"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {account.bank_id ?? "—"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {account.branch_id ?? "—"}
                      </TableCell>
                      <TableCell>{account.currency ?? "—"}</TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {account.transaction_count ?? 0}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {account.date_start ?? "—"} {" -> "}{" "}
                        {account.date_end ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {account.last_import ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewTransactions(account.account_id)}
                        >
                          Voir les transactions
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ImportDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setDialogOpen(false);
          onImportSuccess?.();
        }}
      />
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-white/8 px-3 py-3 backdrop-blur-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-white">
        {icon}
      </div>
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}