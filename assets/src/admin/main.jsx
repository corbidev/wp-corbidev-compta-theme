/**
 * Point d'entrée admin — wp-corbidev-compta.
 *
 * Monte le composant React ImportModal dans le conteneur
 * #corbidev-compta-modal-root présent dans les templates PHP admin.
 * L'ouverture est déclenchée par le bouton #corbidev-compta-import-btn.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { ImportModal } from '@/components/ImportModal';
import '@admin/styles/admin.css';

document.addEventListener( 'DOMContentLoaded', () => {
    const rootEl = document.getElementById( 'corbidev-compta-modal-root' );

    if ( ! rootEl ) return;

    const reactRoot = createRoot( rootEl );
    const importBtn = document.getElementById( 'corbidev-compta-import-btn' );

    /**
     * Rend le modal avec l'état ouvert/fermé fourni.
     *
     * @param {boolean} isOpen
     */
    function renderModal( isOpen ) {
        reactRoot.render(
            <ImportModal
                isOpen={ isOpen }
                onClose={ () => renderModal( false ) }
                data={ window.cdComptaData ?? {} }
            />
        );
    }

    // Rendu initial (modal fermé).
    renderModal( false );

    // Ouverture sur clic du bouton d'import.
    if ( importBtn ) {
        importBtn.addEventListener( 'click', () => renderModal( true ) );
    }
} );
