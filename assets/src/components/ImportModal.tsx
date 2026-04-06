import { useState, type ChangeEvent, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: CdComptaData;
}

interface ImportResultData {
    account_id?: string;
    total?: number;
    imported?: number;
    duplicates?: number;
    date_start?: string;
    date_end?: string;
    balance?: {
        amount?: number | null;
    };
    errors?: string[];
}

export function ImportModal({ isOpen, onClose, data }: ImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ImportResultData | null>(null);
    const [error, setError] = useState<string | null>(null);

    const i18n = data.i18n ?? {};

    const handleClose = () => {
        setFile(null);
        setResult(null);
        setError(null);
        setIsLoading(false);
        onClose();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files?.[0] ?? null);
        setError(null);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file || isLoading) {
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('action', 'cdcompta_import_ofx');
        formData.append('nonce', data.nonce ?? '');
        formData.append('ofx_file', file);

        try {
            const response = await fetch(data.ajaxUrl ?? '/wp-admin/admin-ajax.php', {
                method: 'POST',
                body: formData,
            });
            const json = await response.json() as { success?: boolean; data?: ImportResultData & { code?: string } };

            if (json.success) {
                setResult(json.data ?? null);
            } else {
                setError(json.data?.code ?? 'import_error');
            }
        } catch {
            setError('network_error');
        } finally {
            setIsLoading(false);
        }
    };

    const title = result
        ? (i18n.importSummary ?? 'Récapitulatif de l\'import')
        : (i18n.importFile ?? 'Importer un fichier OFX');

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="corbidev-compta-admin-modal-overlay" />
                <Dialog.Content
                    className="corbidev-compta-admin-modal-content"
                    aria-describedby="cdcompta-modal-desc"
                >
                    <Dialog.Title className="corbidev-compta-admin-modal-title">
                        {title}
                    </Dialog.Title>
                    <Dialog.Description id="cdcompta-modal-desc" className="sr-only">
                        {result ? 'Résultats de l\'import OFX' : 'Formulaire d\'import de fichier OFX'}
                    </Dialog.Description>

                    {result ? (
                        <ImportResult result={result} i18n={i18n} onClose={handleClose} />
                    ) : (
                        <ImportForm
                            file={file}
                            isLoading={isLoading}
                            error={error}
                            onFileChange={handleFileChange}
                            onSubmit={handleSubmit}
                            onClose={handleClose}
                            i18n={i18n}
                        />
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function ImportForm({
    file,
    isLoading,
    error,
    onFileChange,
    onSubmit,
    onClose,
    i18n,
}: {
    file: File | null;
    isLoading: boolean;
    error: string | null;
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    onClose: () => void;
    i18n: CdComptaI18n;
}) {
    return (
        <form onSubmit={onSubmit} className="corbidev-compta-admin-modal-form">
            <div className="corbidev-compta-admin-modal-field">
                <label htmlFor="cdcompta-file-input" className="corbidev-compta-admin-modal-label">
                    {i18n.selectFile ?? 'Sélectionner un fichier .ofx'}
                </label>
                <input
                    id="cdcompta-file-input"
                    type="file"
                    accept=".ofx"
                    onChange={onFileChange}
                    disabled={isLoading}
                    className="corbidev-compta-admin-modal-file-input"
                />
                {file && <span className="corbidev-compta-admin-modal-filename">{file.name}</span>}
            </div>

            {error && (
                <div className="corbidev-compta-admin-modal-error" role="alert">
                    {error}
                </div>
            )}

            <div className="corbidev-compta-admin-modal-actions">
                <button
                    type="button"
                    className="button button-secondary"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    {i18n.close ?? 'Fermer'}
                </button>
                <button
                    type="submit"
                    className="button button-primary"
                    disabled={!file || isLoading}
                >
                    {isLoading ? (i18n.importing ?? 'Import en cours…') : (i18n.import ?? 'Importer')}
                </button>
            </div>
        </form>
    );
}

function ImportResult({
    result,
    i18n,
    onClose,
}: {
    result: ImportResultData;
    i18n: CdComptaI18n;
    onClose: () => void;
}) {
    const balance = result.balance ?? {};

    return (
        <div className="corbidev-compta-admin-modal-result">
            <dl className="corbidev-compta-admin-modal-summary">
                <div className="corbidev-compta-admin-modal-summary-row">
                    <dt>{i18n.account ?? 'Compte'}</dt>
                    <dd><strong>{result.account_id ?? '—'}</strong></dd>
                </div>

                <div className="corbidev-compta-admin-modal-summary-row">
                    <dt>{i18n.total ?? 'Total dans le fichier'}</dt>
                    <dd>{result.total ?? 0}</dd>
                </div>

                <div className="corbidev-compta-admin-modal-summary-row corbidev-compta-admin-modal-summary-imported">
                    <dt>{i18n.imported ?? 'Importé(s)'}</dt>
                    <dd><strong>{result.imported ?? 0}</strong></dd>
                </div>

                <div className="corbidev-compta-admin-modal-summary-row corbidev-compta-admin-modal-summary-duplicates">
                    <dt>{i18n.duplicates ?? 'Doublon(s) ignoré(s)'}</dt>
                    <dd>{result.duplicates ?? 0}</dd>
                </div>

                <div className="corbidev-compta-admin-modal-summary-row">
                    <dt>{i18n.dateRange ?? 'Période'}</dt>
                    <dd>{result.date_start ?? '—'} {' -> '} {result.date_end ?? '—'}</dd>
                </div>

                {balance.amount !== null && balance.amount !== undefined && (
                    <div className="corbidev-compta-admin-modal-summary-row">
                        <dt>{i18n.balance ?? 'Solde du compte'}</dt>
                        <dd>
                            <strong className={balance.amount >= 0 ? 'corbidev-compta-admin-positive' : 'corbidev-compta-admin-negative'}>
                                {Number(balance.amount).toFixed(2)} €
                            </strong>
                        </dd>
                    </div>
                )}
            </dl>

            {result.errors && result.errors.length > 0 && (
                <div className="corbidev-compta-admin-modal-errors-list" role="alert">
                    <strong>{i18n.errors ?? 'Erreurs'} ({result.errors.length})</strong>
                    <ul>
                        {result.errors.map((code) => (
                            <li key={code}>{code}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="corbidev-compta-admin-modal-actions">
                <button type="button" className="button button-primary" onClick={onClose}>
                    {i18n.close ?? 'Fermer'}
                </button>
            </div>
        </div>
    );
}