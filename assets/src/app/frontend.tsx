/**
 * Point d'entrée de l'application frontend React
 *
 * Rôle :
 * - Monter l'application React dans le DOM
 * - Récupérer le contexte WordPress injecté par PHP
 * - Router vers les bonnes features métier
 *
 * ⚠️ Aucune logique métier complexe ici
 * ⚠️ Ce fichier doit rester léger (orchestration uniquement)
 */

import React from 'react'
import { createRoot } from 'react-dom/client'

/**
 * Features métier
 */
import AccountsPage from '@features/accounts/page'
import TransactionsPage from '@features/transactions/page'

/**
 * Interface du contexte WordPress
 */
interface WPContext {
  type?: string
  pageId?: number
  postType?: string
  slug?: string
}

/**
 * Récupère l'élément racine React
 */
const container = document.getElementById('corbidev-frontend-app')

if (!container) {
  console.warn('[CorbiDev] Root container not found')
} else {
  /**
   * Récupération du contexte WordPress
   */
  const context: WPContext = JSON.parse(
    container.dataset.context || '{}'
  )
  /**
 * 🔥 DEBUG (ICI EXACTEMENT)
 * Permet de vérifier les données envoyées par WordPress
 */
  console.log('[CorbiDev] Context:', context)

  /**
   * Initialisation du root React
   */
  const root = createRoot(container)

  /**
   * Router simple basé sur le contexte WordPress
   *
   * ⚠️ Remplacer par un vrai router si besoin (React Router)
   */
  const renderPage = () => {
    switch (context.slug) {
      case 'accounts':
        return <AccountsPage />

      case 'transactions':
        return <TransactionsPage />

      default:
        /**
         * Fallback (page non gérée)
         */
        return <div>Page not found</div>
    }
  }

  /**
   * Montage de l'application
   */
  root.render(
    <React.StrictMode>
      {renderPage()}
    </React.StrictMode>
  )
}