import { useCallback, useEffect, useState } from 'react';
import { AccountsPage, type Account } from '@frontend/pages/AccountsPage';
import { TransactionsPage } from '@frontend/pages/TransactionsPage';
import { useAjax } from '@frontend/hooks/useAjax';

interface AccountsResponse {
    accounts?: Account[];
}

type View = 'accounts' | 'transactions';

export default function App() {
    const { get } = useAjax();

    const [view, setView] = useState<View>('accounts');
    const [selectedAccount, setSelectedAccount] = useState('');
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [accountsLoading, setAccountsLoading] = useState(true);

    const loadAccounts = useCallback(async () => {
        setAccountsLoading(true);

        try {
            const data = await get<AccountsResponse>('cdcompta_get_accounts');
            setAccounts(data.accounts ?? []);
        } catch {
            setAccounts([]);
        } finally {
            setAccountsLoading(false);
        }
    }, [get]);

    useEffect(() => {
        void loadAccounts();
    }, [loadAccounts]);

    const goToTransactions = (accountId: string) => {
        setSelectedAccount(accountId);
        setView('transactions');
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 text-slate-900 antialiased sm:px-6 lg:px-8">
            {view === 'accounts' ? (
                <AccountsPage
                    accounts={accounts}
                    loading={accountsLoading}
                    onViewTransactions={goToTransactions}
                    onImportSuccess={loadAccounts}
                />
            ) : (
                <TransactionsPage
                    initialAccount={selectedAccount}
                    accounts={accounts}
                    onBack={() => setView('accounts')}
                    onImportSuccess={loadAccounts}
                />
            )}
        </div>
    );
}