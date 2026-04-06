import { useRef, useState, type ChangeEvent, type FormEvent, type RefObject } from 'react';
import { Upload } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAjax } from '@frontend/hooks/useAjax';
import { cn } from '@/lib/utils';

interface ImportResultData {
    account_id?: string;
    total?: number;
    imported?: number;
    duplicates?: number;
    date_start?: string;
    date_end?: string;
    balance?: {
        amount?: number | string | null;
    };
    errors?: string[];
}

interface ImportDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

interface ImportFormProps {
    file: File | null;
    loading: boolean;
    error: string | null;
    inputRef: RefObject<HTMLInputElement | null>;
    onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    onClose: () => void;
    i18n: CdComptaI18n;
}

interface ImportResultProps {
    result: ImportResultData;
    i18n: CdComptaI18n;
    onClose: () => void;
}

function getBadgeVariant(value: number | undefined): 'default' | 'secondary' {
    return (value ?? 0) > 0 ? 'default' : 'secondary';
}

export function ImportDialog({ open, onClose, onSuccess }: ImportDialogProps) {
  const { post, i18n } = useAjax();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResultData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file || loading) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("ofx_file", file);

      const data = await post<ImportResultData>(
        "cdcompta_import_ofx",
        formData,
      );
      setResult(data);
      onSuccess?.();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent className="max-w-lg rounded-[2rem] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-5 text-white">
          <DialogHeader>
            <DialogTitle>
              {result
                ? i18n.importSummary ?? "Récapitulatif de l'import"
                : i18n.importFile ?? "Importer un fichier OFX"}
            </DialogTitle>
            <DialogDescription className="text-slate-300 sr-only">
              {result
                ? "Résultats de l'import"
                : "Sélectionnez un fichier .ofx"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-6">
          {!result ? (
            <ImportForm
              file={file}
              loading={loading}
              error={error}
              inputRef={inputRef}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              onClose={handleClose}
              i18n={i18n}
            />
          ) : (
            <ImportResult result={result} i18n={i18n} onClose={handleClose} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ImportForm({
  file,
  loading,
  error,
  inputRef,
  onFileChange,
  onSubmit,
  onClose,
  i18n,
}: ImportFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-3 rounded-[1.75rem] border-2 border-dashed px-6 py-12 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950",
          file
            ? "border-emerald-300 bg-emerald-50"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white",
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
          <Upload className="h-7 w-7 text-slate-500" strokeWidth={1.8} />
        </span>
        {file ? (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">{file.name}</p>
            <p className="text-xs text-slate-500">Prêt pour l'import</p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              {i18n.selectFile ?? "Sélectionner un fichier .ofx"}
            </p>
            <p className="text-xs text-slate-500">Cliquez pour parcourir</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".ofx"
          onChange={onFileChange}
          className="sr-only"
        />
      </button>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <DialogFooter className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          Annuler
        </Button>
        <Button type="submit" disabled={!file || loading}>
          {loading
            ? i18n.importing ?? "Import en cours…"
            : i18n.import ?? "Importer"}
        </Button>
      </DialogFooter>
    </form>
  );
}

function ImportResult({ result, i18n, onClose }: ImportResultProps) {
    const balance = result.balance ?? {};
    const amount = balance.amount == null ? null : Number(balance.amount);
    const isPositive = (amount ?? 0) >= 0;

    return (
        <div className="flex flex-col gap-5">
            <dl className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50/80 text-sm">
                <SummaryRow label={i18n.account ?? 'Compte'}>
                    <span className="font-mono font-semibold">{result.account_id ?? '—'}</span>
                </SummaryRow>
                <SummaryRow label={i18n.total ?? 'Total dans le fichier'}>
                    {result.total ?? 0}
                </SummaryRow>
                <SummaryRow label={i18n.imported ?? 'Importé(s)'}>
                    <Badge variant={getBadgeVariant(result.imported)} className="bg-emerald-100 text-emerald-800">
                        {result.imported ?? 0}
                    </Badge>
                </SummaryRow>
                <SummaryRow label={i18n.duplicates ?? 'Doublon(s) ignoré(s)'}>
                    <Badge variant="secondary">{result.duplicates ?? 0}</Badge>
                </SummaryRow>
                <SummaryRow label={i18n.dateRange ?? 'Période'}>
                    {result.date_start ?? '—'} {' -> '} {result.date_end ?? '—'}
                </SummaryRow>
                {amount !== null && (
                    <SummaryRow label={i18n.balance ?? 'Solde du compte'}>
                        <span className={cn('font-semibold', isPositive ? 'text-emerald-700' : 'text-red-700')}>
                            {amount.toFixed(2)} €
                        </span>
                    </SummaryRow>
                )}
            </dl>

            {result.errors && result.errors.length > 0 && (
                <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <strong>{i18n.errors ?? 'Erreurs'} ({result.errors.length})</strong>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                        {result.errors.map((code) => (
                            <li key={code}>{code}</li>
                        ))}
                    </ul>
                </div>
            )}

            <DialogFooter>
                <Button onClick={onClose}>{i18n.close ?? 'Fermer'}</Button>
            </DialogFooter>
        </div>
    );
}

function SummaryRow({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 last:border-b-0">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right text-slate-900">{children}</dd>
        </div>
    );
}