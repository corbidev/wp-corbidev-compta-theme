/**
 * Root de l'application comptabilité.
 *
 * Gère la navigation entre :
 *  - AccountsPage  : liste des comptes + bouton d'import
 *  - TransactionsPage : transactions filtrables d'un compte
 */

import React, { useCallback, useEffect, useState } from 'react';
import { AccountsPage }     from './pages/AccountsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { useAjax }          from './hooks/useAjax';

export default function App() {
    const { get } = useAjax();

    const [ view,            setView            ] = useState( 'accounts' );
    const [ selectedAccount, setSelectedAccount ] = useState( '' );
    const [ accounts,        setAccounts        ] = useState( [] );
    const [ accountsLoading, setAccountsLoading ] = useState( true );

    const loadAccounts = useCallback( async () => {
        setAccountsLoading( true );
        try {
            const data = await get( 'cdcompta_get_accounts' );
            setAccounts( data.accounts ?? [] );
        } catch {
            setAccounts( [] );
        } finally {
            setAccountsLoading( false );
        }
    }, [] );

    useEffect( () => { loadAccounts(); }, [ loadAccounts ] );

    const goToTransactions = ( accountId ) => {
        setSelectedAccount( accountId );
        setView( 'transactions' );
    };

    return (
        <div className="mx-auto max-w-7xl p-6 font-sans antialiased text-neutral-900">
            { view === 'accounts' ? (
                <AccountsPage
                    accounts={ accounts }
                    loading={ accountsLoading }
                    onViewTransactions={ goToTransactions }
                    onImportSuccess={ loadAccounts }
                />
            ) : (
                <TransactionsPage
                    initialAccount={ selectedAccount }
                    accounts={ accounts }
                    onBack={ () => setView( 'accounts' ) }
                    onImportSuccess={ loadAccounts }
                />
            ) }
        </div>
    );
}
