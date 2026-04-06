/**
 * Point d'entrée de la SPA frontend — wp-corbidev-compta.
 *
 * Monte le composant <App /> dans #corbidev-compta-app,
 * conteneur rendu par le shortcode [corbidev_compta].
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/frontend.css';

document.addEventListener( 'DOMContentLoaded', () => {
    const root = document.getElementById( 'corbidev-compta-app' );
    if ( ! root ) return;

    createRoot( root ).render( <App /> );
} );
