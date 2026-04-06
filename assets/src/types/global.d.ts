interface CdComptaI18n {
    importFile?: string;
    selectFile?: string;
    import?: string;
    importing?: string;
    importSummary?: string;
    importSuccess?: string;
    importError?: string;
    account?: string;
    total?: string;
    imported?: string;
    duplicates?: string;
    dateRange?: string;
    balance?: string;
    close?: string;
    errors?: string;
}

interface CdComptaData {
    ajaxUrl?: string;
    nonce?: string;
    i18n?: CdComptaI18n;
}

declare global {
    interface Window {
        cdComptaData?: CdComptaData;
    }
}

export {};