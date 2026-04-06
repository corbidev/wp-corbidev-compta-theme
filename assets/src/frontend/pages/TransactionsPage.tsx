import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, FileUp, Filter } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ImportDialog } from '@frontend/components/ImportDialog';
import { useAjax } from '@frontend/hooks/useAjax';
import type { Account } from './AccountsPage';

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

interface TransactionsPageProps {
    initialAccount?: string;
    accounts: Account[];
    onBack: () => void;
    onImportSuccess?: () => void;
}

function formatAmount(amount: number): string {
    return `${amount.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} €`;
}

export function TransactionsPage({
    initialAccount,
    accounts,
    onBack,
    onImportSuccess,
}: TransactionsPageProps) {
    const { get } = useAjax();

    const [accountId, setAccountId] = useState(initialAccount ?? 'all');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const loadTransactions = useCallback(async () => {
        setLoading(true);

        try {
            const data = await get<TransactionsResponse>('cdcompta_get_transactions', {
                account_id: accountId === 'all' ? '' : accountId,
                date_start: dateStart,
                date_end: dateEnd,
                limit: 200,
                order: 'DESC',
            });

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
        setAccountId(initialAccount ?? 'all');
        setDateStart('');
        setDateEnd('');
    };

    return (
        <div className="space-y-6">
            <Card className="border-none bg-linear-to-r from-white via-slate-50 to-emerald-50 shadow-xl ring-1 ring-slate-200">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon-sm" onClick={onBack} title="Retour aux comptes">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div>
                            <CardTitle>Transactions</CardTitle>
                            <CardDescription>
                                Analysez les opérations par compte et période avec des filtres chargés depuis WordPress AJAX.
                            </CardDescription>
                        </div>
                    </div>
                    <CardAction>
                        <Button variant="outline" onClick={() => setDialogOpen(true)}>
                            <FileUp className="h-4 w-4" />
                            Importer un fichier OFX
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
                    <div className="grid gap-3 md:grid-cols-3">
                        <FilterField label="Compte">
                            <Select value={accountId} onValueChange={setAccountId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tous les comptes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les comptes</SelectItem>
                                    {accounts.map((account) => (
                                        <SelectItem key={account.account_id} value={account.account_id}>
                                            {account.account_id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FilterField>

                        <FilterField label="Du">
                            <Input
                                type="date"
                                value={dateStart}
                                onChange={(event) => setDateStart(event.target.value)}
                            />
                        </FilterField>

                        <FilterField label="Au">
                            <Input
                                type="date"
                                value={dateEnd}
                                onChange={(event) => setDateEnd(event.target.value)}
                            />
                        </FilterField>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                        <Badge variant="secondary" className="h-9 rounded-3xl px-3 text-sm">
                            <Filter className="h-4 w-4" />
                            {total} résultat{total > 1 ? 's' : ''}
                        </Badge>
                        <Button variant="outline" onClick={handleReset}>
                            Réinitialiser
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Journal des opérations</CardTitle>
                    <CardDescription>
                        {accountId !== 'all' ? `Compte sélectionné: ${accountId}` : 'Tous les comptes affichés'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Separator className="mb-6" />

                    {loading ? (
                        <div className="flex items-center justify-center py-20 text-sm text-slate-500">
                            Chargement des transactions...
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="flex items-center justify-center rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 py-20 text-sm text-slate-500">
                            Aucune transaction pour ces critères.
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                                        <TableHead>Date opération</TableHead>
                                        <TableHead>Date valeur</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Libellé</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Montant</TableHead>
                                        <TableHead>Référence</TableHead>
                                        <TableHead>Compte</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map((transaction) => {
                                        const amount = Number.parseFloat(transaction.amount);
                                        const isDebit = amount < 0;
                                        const isCredit = amount > 0;

                                        return (
                                            <TableRow
                                                key={transaction.fitid}
                                                className={isDebit ? 'bg-red-50/40 hover:bg-red-50/60' : isCredit ? 'bg-emerald-50/50 hover:bg-emerald-50/70' : ''}
                                            >
                                                <TableCell className="whitespace-nowrap tabular-nums text-sm">
                                                    {transaction.dt_posted ?? '—'}
                                                </TableCell>
                                                <TableCell className="text-xs tabular-nums text-slate-500">
                                                    {transaction.dt_avail ?? '—'}
                                                </TableCell>
                                                <TableCell className="text-xs uppercase tracking-wide text-slate-500">
                                                    {transaction.trn_type ?? '—'}
                                                </TableCell>
                                                <TableCell className="font-medium text-slate-900">
                                                    {transaction.name ?? '—'}
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate text-sm text-slate-600">
                                                    {transaction.memo ?? '—'}
                                                </TableCell>
                                                <TableCell className="text-right whitespace-nowrap">
                                                    <Badge
                                                        variant={isDebit ? 'destructive' : 'secondary'}
                                                        className={isCredit ? 'bg-emerald-100 text-emerald-800' : undefined}
                                                    >
                                                        {isCredit ? '+' : ''}
                                                        {formatAmount(amount)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono text-xs text-slate-400">
                                                    {transaction.fitid}
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-500">
                                                    {transaction.account_id ?? '—'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
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
                    void loadTransactions();
                }}
            />
        </div>
    );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{label}</label>
            {children}
        </div>
    );
}