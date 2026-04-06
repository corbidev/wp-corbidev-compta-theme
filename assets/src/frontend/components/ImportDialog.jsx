/**
 * Dialog d'import OFX.
 *
 * Deux états :
 *  - Formulaire   : zone de dépôt de fichier + bouton Importer.
 *  - Récapitulatif : résumé détaillé après un import réussi.
 */

import React, { useRef, useState } from 'react';
import { Upload }          from 'lucide-react';
import {
    Dialog, DialogContent, DialogHeader, DialogFooter,
    DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge  } from '@/components/ui/badge';
import { useAjax } from '@/frontend/hooks/useAjax';
import { cn }    from '@/lib/utils';

// -----------------------------------------------------------------------------
// Composant principal
// -----------------------------------------------------------------------------

export function ImportDialog( { open, onClose, onSuccess } ) {
    const { post, i18n } = useAjax();
    const inputRef       = useRef( null );

    const [ file,    setFile    ] = useState( null );
    const [ loading, setLoading ] = useState( false );
    const [ result,  setResult  ] = useState( null );
    const [ error,   setError   ] = useState( null );

    const reset = () => {
        setFile( null );
        setResult( null );
        setError( null );
        setLoading( false );
    };

    const handleClose = () => { reset(); onClose(); };

    const handleFileChange = ( e ) => {
        setFile( e.target.files?.[0] ?? null );
        setError( null );
    };

    const handleSubmit = async ( e ) => {
        e.preventDefault();
        if ( ! file || loading ) return;

        setLoading( true );
        setError( null );

        try {
            const fd = new FormData();
            fd.append( 'ofx_file', file );
            const data = await post( 'cdcompta_import_ofx', fd );
            setResult( data );
            onSuccess?.();
        } catch ( err ) {
            setError( err.message );
        } finally {
            setLoading( false );
        }
    };

    return (
        <Dialog open={ open } onOpenChange={ ( o ) => ! o && handleClose() }>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        { result
                            ? ( i18n.importSummary ?? 'Récapitulatif de l\'import' )
                            : ( i18n.importFile    ?? 'Importer un fichier OFX'    ) }
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        { result ? 'Résultats de l\'import' : 'Sélectionnez un fichier .ofx' }
                    </DialogDescription>
                </DialogHeader>

                { ! result ? (
                    <ImportForm
                        file={ file }
                        loading={ loading }
                        error={ error }
                        inputRef={ inputRef }
                        onFileChange={ handleFileChange }
                        onSubmit={ handleSubmit }
                        onClose={ handleClose }
                        i18n={ i18n }
                    />
                ) : (
                    <ImportResult result={ result } i18n={ i18n } onClose={ handleClose } />
                ) }
            </DialogContent>
        </Dialog>
    );
}

// -----------------------------------------------------------------------------
// Formulaire d'import
// -----------------------------------------------------------------------------

function ImportForm( { file, loading, error, inputRef, onFileChange, onSubmit, onClose, i18n } ) {
    return (
        <form onSubmit={ onSubmit } className="flex flex-col gap-4">

            {/* Zone de dépôt */}
            <button
                type="button"
                onClick={ () => inputRef.current?.click() }
                className={ cn(
                    'flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center',
                    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950',
                    file
                        ? 'border-neutral-400 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                ) }
            >
                <Upload className="h-8 w-8 text-neutral-400" strokeWidth={ 1.5 } />
                { file ? (
                    <p className="text-sm font-medium text-neutral-900">{ file.name }</p>
                ) : (
                    <>
                        <p className="text-sm font-medium text-neutral-700">
                            { i18n.selectFile ?? 'Sélectionner un fichier .ofx' }
                        </p>
                        <p className="text-xs text-neutral-400">Cliquez pour parcourir</p>
                    </>
                ) }
                <input
                    ref={ inputRef }
                    type="file"
                    accept=".ofx"
                    onChange={ onFileChange }
                    className="sr-only"
                />
            </button>

            { error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    { error }
                </div>
            ) }

            <DialogFooter>
                <Button type="button" variant="outline" onClick={ onClose } disabled={ loading }>
                    Annuler
                </Button>
                <Button type="submit" disabled={ ! file || loading }>
                    { loading
                        ? ( i18n.importing ?? 'Import en cours…' )
                        : ( i18n.import    ?? 'Importer'         ) }
                </Button>
            </DialogFooter>
        </form>
    );
}

// -----------------------------------------------------------------------------
// Récapitulatif d'import
// -----------------------------------------------------------------------------

function ImportResult( { result, i18n, onClose } ) {
    const balance    = result.balance ?? {};
    const isPositive = ( balance.amount ?? 0 ) >= 0;

    return (
        <div className="flex flex-col gap-4">
            <dl className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 overflow-hidden text-sm">
                <SummaryRow label={ i18n.account ?? 'Compte' }>
                    <span className="font-mono font-medium">{ result.account_id ?? '—' }</span>
                </SummaryRow>
                <SummaryRow label={ i18n.total ?? 'Total dans le fichier' }>
                    { result.total }
                </SummaryRow>
                <SummaryRow label={ i18n.imported ?? 'Importé(s)' }>
                    <Badge variant="success">{ result.imported }</Badge>
                </SummaryRow>
                <SummaryRow label={ i18n.duplicates ?? 'Doublon(s) ignoré(s)' }>
                    <Badge variant="secondary">{ result.duplicates }</Badge>
                </SummaryRow>
                <SummaryRow label={ i18n.dateRange ?? 'Période' }>
                    { result.date_start ?? '—' } → { result.date_end ?? '—' }
                </SummaryRow>
                { balance.amount != null && (
                    <SummaryRow label={ i18n.balance ?? 'Solde du compte' }>
                        <span className={ isPositive ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold' }>
                            { Number( balance.amount ).toFixed( 2 ) } €
                        </span>
                    </SummaryRow>
                ) }
            </dl>

            { result.errors?.length > 0 && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    <strong>{ i18n.errors ?? 'Erreurs' } ({ result.errors.length })</strong>
                    <ul className="mt-1 list-disc list-inside space-y-0.5">
                        { result.errors.map( ( code, i ) => <li key={ i }>{ code }</li> ) }
                    </ul>
                </div>
            ) }

            <DialogFooter>
                <Button onClick={ onClose }>
                    { i18n.close ?? 'Fermer' }
                </Button>
            </DialogFooter>
        </div>
    );
}

function SummaryRow( { label, children } ) {
    return (
        <div className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-neutral-500">{ label }</dt>
            <dd>{ children }</dd>
        </div>
    );
}
