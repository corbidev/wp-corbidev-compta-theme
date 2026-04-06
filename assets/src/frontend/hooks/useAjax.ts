import { useCallback } from 'react';

type AjaxParams = Record<string, string | number | boolean | null | undefined>;

interface AjaxSuccessResponse<T> {
    success: true;
    data: T;
}

interface AjaxErrorResponse {
    success: false;
    data?: {
        code?: string;
    };
}

type AjaxResponse<T> = AjaxSuccessResponse<T> | AjaxErrorResponse;

export function useAjax() {
    const config = window.cdComptaData ?? {};

    const get = useCallback(async <T>(action: string, params: AjaxParams = {}): Promise<T> => {
        const url = new URL(
            config.ajaxUrl ?? '/wp-admin/admin-ajax.php',
            window.location.href,
        );

        url.searchParams.set('action', action);
        url.searchParams.set('nonce', config.nonce ?? '');

        Object.entries(params).forEach(([key, value]) => {
            if (value !== '' && value !== null && value !== undefined) {
                url.searchParams.set(key, String(value));
            }
        });

        const response = await fetch(url.toString(), { credentials: 'same-origin' });
        const json = await response.json() as AjaxResponse<T>;

        if (!json.success) {
            throw new Error(json.data?.code ?? 'error');
        }

        return json.data;
    }, [config.ajaxUrl, config.nonce]);

    const post = useCallback(async <T>(action: string, formData: FormData): Promise<T> => {
        formData.append('action', action);
        formData.append('nonce', config.nonce ?? '');

        const response = await fetch(config.ajaxUrl ?? '/wp-admin/admin-ajax.php', {
            method: 'POST',
            body: formData,
            credentials: 'same-origin',
        });
        const json = await response.json() as AjaxResponse<T>;

        if (!json.success) {
            throw new Error(json.data?.code ?? 'error');
        }

        return json.data;
    }, [config.ajaxUrl, config.nonce]);

    return { get, post, i18n: config.i18n ?? {} };
}