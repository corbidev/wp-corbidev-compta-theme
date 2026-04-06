/**
 * Page Transactions — tableau filtrable avec navigation vers AccountsPage.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, FileUp } from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input  } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge  } from '@/components/ui/badge';
import { useAjax } from '@/frontend/hooks/useAjax';
import { ImportDialog } from '@/frontend/components/ImportDialog';

const fmt = ( amount ) =>
    amount.toLocaleString( 'fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 } ) + ' €';

export function TransactionsPage( { initialAccount, accounts, onBack, onImportSuccess } ) {
    const { get }    = useAjax();

    const [ accountId,    setAccountId    ] = useState( initialAccount ?? '' );
    const [ dateStart,    setDateStart    ] = useState( '' );
    const [ dateEnd,      setDateEnd      ] = useState( '' );
    const [ transactions, setTransactions ] = useState( [] );
    const [ total,        setTotal        ] = useState( 0 );
    const [ loading,      setLoading      ] = useState( false );
    const [ dialogOpen,   setDialogOpen   ] = useState( false );

    const load = useCallback( async () => {
        setLoading( true );
        try {
            const data = await get( 'cdcompta_get_transactions', {
                account_id: accountId,
                date_start: dateStart,
                date_end:   dateEnd,
                limit:      200,
                order:      'DESC',
            } );
            setTransactions( data.transactions ?? [] );
            setTotal( data.total ?? 0 );
        } catch {
            setTransactions( [] );
            setTotal( 0 );
        } finally {
            setLoading( false );
        }
    }, [ get, accountId, dateStart, dateEnd ] );

    useEffect( () => { load(); }, [ load ] );

    const handleReset = () => {
        setAccountId( '' );
        setDateStart( '' );
        setDateEnd( '' );
    };

    return (
        <div className="space-y-6">

            {/* En-tête */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={ onBack } title="Retour aux comptes">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
                        { accountId && (
                            <p className="mt-0.5 text-sm text-neutral-500 font-mono">{ accountId }</p>
                        ) }
                    </div>
                </div>
                <Button variant="outline" onClick={ () => setDialogOpen( true ) }>
                    <FileUp className="h-4 w-4" />
                    Importer un fichier OFX
                </Button>
            </div>

            {/* Barre de filtres */}
            <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4">
                <FilterField label="Compte">
                    <Select
                        value={ accountId }
                        onChange={ ( e ) => setAccountId( e.target.value ) }
                        className="min-w-[200px]"
                    >
                        <option value="">Tous les comptes</option>
                        { accounts.map( ( a ) => (
                            <option key={ a.account_id } value={ a.account_id }>{ a.account_id }</option>
                        ) ) }
                    </Select>
                </FilterField>

                <FilterField label="Du">
                    <Input
                        type="date"
                        value={ dateStart }
                        onChange={ ( e ) => setDateStart( e.target.value ) }
                        className="w-36"
                    />
                </FilterField>

                <FilterField label="Au">
                    <Input
                        type="date"
                        value={ dateEnd }
                        onChange={ ( e ) => setDateEnd( e.target.value ) }
                        className="w-36"
                    />
                </FilterField>

                <Button variant="outline" onClick={ handleReset }>
                    Réinitialiser
                </Button>
            </div>

            {/* Compteur */}
            <p className="text-sm text-neutral-500">
                { total } transaction{ total !== 1 ? 's' : '' } trouvée{ total !== 1 ? 's' : '' }
            </p>

            {/* Tableau */}
            { loading ? (
                <div className="flex items-center justify-center py-20 text-neutral-400 text-sm">
                    Chargement…
                </div>
            ) : transactions.length === 0 ? (
                <div className="flex items-center justify-center py-20 text-neutral-400 text-sm">
                    Aucune transaction pour ces critères.
                </div>
            ) : (
                <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-neutral-50 hover:bg-neutral-50">
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
                            { transactions.map( ( tx ) => {
                                const amount   = parseFloat( tx.amount );
                                const isDebit  = amount < 0;
                                const isCredit = amount > 0;

                                return (
                                    <TableRow
                                        key={ tx.fitid }
                                        className={
                                            isDebit  ? 'bg-red-50/40 hover:bg-red-50/60'   :
                                            isCredit ? 'bg-green-50/40 hover:bg-green-50/60' : ''
                                        }
                                    >
                                        <TableCell className="whitespace-nowrap tabular-nums text-sm">
                                            { tx.dt_posted }
                                        </TableCell>
                                        <TableCell className="text-neutral-500 text-xs tabular-nums">
                                            { tx.dt_avail ?? '—' }
                                        </TableCell>
                                        <TableCell className="text-xs text-neutral-500">
                                            { tx.trn_type ?? '—' }
                                        </TableCell>
                                        <TableCell className="font-medium whitespace-nowrap">
                                            { tx.name ?? '—' }
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-neutral-600 text-sm">
                                            { tx.memo ?? '—' }
                                        </TableCell>
                                        <TableCell className="text-right whitespace-nowrap">
                                            <Badge variant={ isDebit ? 'destructive' : isCredit ? 'success' : 'secondary' }>
                                                { isCredit ? '+' : '' }{ fmt( amount ) }
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-neutral-400">
                                            { tx.fitid }
                                        </TableCell>
                                        <TableCell className="text-xs text-neutral-500">
                                            { tx.account_id }
                                        </TableCell>
                                    </TableRow>
                                );
                            } ) }
                        </TableBody>
                    </Table>
                </div>
            ) }

            <ImportDialog
                open={ dialogOpen }
                onClose={ () => setDialogOpen( false ) }
                onSuccess={ () => {
                    setDialogOpen( false );
                    onImportSuccess?.();
                    load();
                } }
            />
        </div>
    );
}

// -----------------------------------------------------------------------------
// Helper
// -----------------------------------------------------------------------------

function FilterField( { label, children } ) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">{ label }</label>
            { children }
        </div>
    );
}
