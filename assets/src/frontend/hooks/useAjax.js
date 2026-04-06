/**
 * Hook utilitaire pour les appels WP AJAX.
 *
 * Lit window.cdComptaData (injecté par wp_localize_script) pour
 * récupérer ajaxUrl, nonce et les chaînes i18n.
 */

import { useCallback } from 'react';

export function useAjax() {
    const config = window.cdComptaData ?? {};

    /**
     * Requête GET vers admin-ajax.php.
     *
     * @param {string} action  Action WP AJAX (ex: cdcompta_get_accounts)
     * @param {object} params  Paramètres de filtrage optionnels
     * @returns {Promise<any>} data du JSON WordPress
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const get = useCallback(async (action, params = {}) => {
        const url = new URL(
            config.ajaxUrl ?? '/wp-admin/admin-ajax.php',
            window.location.href
        );
        url.searchParams.set( 'action', action );
        url.searchParams.set( 'nonce',  config.nonce ?? '' );

        Object.entries( params ).forEach( ( [ k, v ] ) => {
            if ( v !== '' && v !== null && v !== undefined ) {
                url.searchParams.set( k, String( v ) );
            }
        } );

        const res  = await fetch( url.toString(), { credentials: 'same-origin' } );
        const json = await res.json();

        if ( ! json.success ) throw new Error( json.data?.code ?? 'error' );
        return json.data;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Requête POST (multipart) vers admin-ajax.php — utilisée pour l'import OFX.
     *
     * @param {string}   action   Action WP AJAX
     * @param {FormData} formData Corps de la requête
     * @returns {Promise<any>}
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const post = useCallback(async (action, formData) => {
        formData.append( 'action', action );
        formData.append( 'nonce',  config.nonce ?? '' );

        const res = await fetch( config.ajaxUrl ?? '/wp-admin/admin-ajax.php', {
            method:      'POST',
            body:        formData,
            credentials: 'same-origin',
        } );
        const json = await res.json();

        if ( ! json.success ) throw new Error( json.data?.code ?? 'error' );
        return json.data;
    }, []);

    return { get, post, i18n: config.i18n ?? {} };
}
