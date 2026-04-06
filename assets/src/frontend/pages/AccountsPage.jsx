/**
 * Page Comptes — affiche la liste des comptes avec le bouton d'import OFX.
 */

import React, { useState } from 'react';
import { FileUp } from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button }       from '@/components/ui/button';
import { ImportDialog } from '@/frontend/components/ImportDialog';

export function AccountsPage( { accounts, loading, onViewTransactions, onImportSuccess } ) {
    const [ dialogOpen, setDialogOpen ] = useState( false );

    return (
        <div className="space-y-6">

            {/* En-tête */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Comptabilité</h1>
                    <p className="mt-1 text-sm text-neutral-500">
                        { loading
                            ? 'Chargement…'
                            : `${ accounts.length } compte${ accounts.length !== 1 ? 's' : '' } enregistré${ accounts.length !== 1 ? 's' : '' }` }
                    </p>
                </div>
                <Button onClick={ () => setDialogOpen( true ) }>
                    <FileUp className="h-4 w-4" />
                    Importer un fichier OFX
                </Button>
            </div>

            {/* Contenu */}
            { loading ? (
                <div className="flex items-center justify-center py-24 text-neutral-400 text-sm">
                    Chargement des comptes…
                </div>
            ) : accounts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-neutral-200 py-24 text-center">
                    <FileUp className="h-10 w-10 text-neutral-300" strokeWidth={ 1.5 } />
                    <div>
                        <p className="font-medium text-neutral-700">Aucun compte importé</p>
                        <p className="mt-1 text-sm text-neutral-400">
                            Importez un fichier OFX pour commencer.
                        </p>
                    </div>
                    <Button variant="outline" onClick={ () => setDialogOpen( true ) }>
                        Commencer l'import
                    </Button>
                </div>
            ) : (
                <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-white">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                                <TableHead>N° de compte</TableHead>
                                <TableHead>Banque</TableHead>
                                <TableHead>Agence</TableHead>
                                <TableHead>Devise</TableHead>
                                <TableHead className="text-right">Transactions</TableHead>
                                <TableHead>Première opération</TableHead>
                                <TableHead>Dernière opération</TableHead>
                                <TableHead>Dernier import</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { accounts.map( ( account ) => (
                                <TableRow key={ account.account_id }>
                                    <TableCell className="font-mono font-medium text-neutral-900">
                                        { account.account_id }
                                    </TableCell>
                                    <TableCell className="text-neutral-600">{ account.bank_id   ?? '—' }</TableCell>
                                    <TableCell className="text-neutral-600">{ account.branch_id ?? '—' }</TableCell>
                                    <TableCell>{ account.currency }</TableCell>
                                    <TableCell className="text-right font-medium tabular-nums">
                                        { account.transaction_count }
                                    </TableCell>
                                    <TableCell className="text-neutral-500 text-xs tabular-nums">
                                        { account.date_start ?? '—' }
                                    </TableCell>
                                    <TableCell className="text-neutral-500 text-xs tabular-nums">
                                        { account.date_end ?? '—' }
                                    </TableCell>
                                    <TableCell className="text-neutral-500 text-xs">
                                        { account.last_import ?? '—' }
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={ () => onViewTransactions( account.account_id ) }
                                        >
                                            Voir les transactions
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ) ) }
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
                } }
            />
        </div>
    );
}
