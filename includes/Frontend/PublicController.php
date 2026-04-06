<?php
/**
 * Contrôleur public : shortcode [corbidev_compta] et SPA frontend.
 *
 * Rend un point de montage <div id="corbidev-compta-app">.
 * La SPA React (assets/src/frontend/main.jsx) gère l'intégralité de l'UI.
 */

declare( strict_types=1 );

namespace CorbiDev\Compta\Frontend;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class PublicController
{
    /** Indique si les assets ont déjà été mis en file d'attente. */
    private bool $assetsEnqueued = false;

    /**
     * Enregistre les hooks WordPress.
     */
    public function init(): void
    {
        add_shortcode( 'corbidev_compta', [ $this, 'renderShortcode' ] );
    }

    /**
     * Rendu du shortcode [corbidev_compta].
     *
     * @return string HTML du point de montage React.
     */
    public function renderShortcode(): string
    {
        if ( ! current_user_can( 'manage_options' ) ) {
            return '<p>' . esc_html__( 'Accès réservé aux administrateurs.', CDCOMPTA_TEXT_DOMAIN ) . '</p>';
        }

        $this->enqueueAssets();

        return '<div id="corbidev-compta-app"></div>';
    }

    /**
     * Charge les assets de la SPA (entrée `frontend` du manifest Vite).
     */
    private function enqueueAssets(): void
    {
        if ( $this->assetsEnqueued ) {
            return;
        }

        $manifest = $this->loadManifest();

        if ( $manifest === null ) {
            return;
        }

        $entry = $manifest['assets/src/frontend/main.jsx'] ?? null;

        if ( $entry === null ) {
            return;
        }

        $js_file = $entry['file'] ?? null;

        if ( $js_file !== null ) {
            wp_enqueue_script(
                'corbidev-compta-frontend',
                CDCOMPTA_PLUGIN_URL . 'assets/dist/' . $js_file,
                [],
                CDCOMPTA_VERSION,
                true
            );

            wp_localize_script(
                'corbidev-compta-frontend',
                'cdComptaData',
                [
                    'ajaxUrl' => admin_url( 'admin-ajax.php' ),
                    'nonce'   => wp_create_nonce( 'cdcompta_nonce' ),
                    'i18n'    => [
                        'importFile'    => __( 'Importer un fichier OFX',      CDCOMPTA_TEXT_DOMAIN ),
                        'selectFile'    => __( 'Sélectionner un fichier .ofx', CDCOMPTA_TEXT_DOMAIN ),
                        'import'        => __( 'Importer',                     CDCOMPTA_TEXT_DOMAIN ),
                        'importing'     => __( 'Import en cours…',              CDCOMPTA_TEXT_DOMAIN ),
                        'importSummary' => __( 'Récapitulatif de l\'import',   CDCOMPTA_TEXT_DOMAIN ),
                        'importSuccess' => __( 'Import réussi',                CDCOMPTA_TEXT_DOMAIN ),
                        'importError'   => __( 'Erreur lors de l\'import',     CDCOMPTA_TEXT_DOMAIN ),
                        'account'       => __( 'Compte',                       CDCOMPTA_TEXT_DOMAIN ),
                        'total'         => __( 'Total dans le fichier',        CDCOMPTA_TEXT_DOMAIN ),
                        'imported'      => __( 'Importé(s)',                   CDCOMPTA_TEXT_DOMAIN ),
                        'duplicates'    => __( 'Doublon(s) ignoré(s)',        CDCOMPTA_TEXT_DOMAIN ),
                        'dateRange'     => __( 'Période',                      CDCOMPTA_TEXT_DOMAIN ),
                        'balance'       => __( 'Solde du compte',              CDCOMPTA_TEXT_DOMAIN ),
                        'close'         => __( 'Fermer',                       CDCOMPTA_TEXT_DOMAIN ),
                        'errors'        => __( 'Erreurs',                      CDCOMPTA_TEXT_DOMAIN ),
                    ],
                ]
            );
        }

        foreach ( $entry['css'] ?? [] as $css_file ) {
            wp_enqueue_style(
                'corbidev-compta-frontend',
                CDCOMPTA_PLUGIN_URL . 'assets/dist/' . $css_file,
                [],
                CDCOMPTA_VERSION
            );
        }

        $this->assetsEnqueued = true;
    }

    /**
     * Charge le manifest Vite (assets/dist/.vite/manifest.json).
     *
     * @return array<string, mixed>|null
     */
    private function loadManifest(): ?array
    {
        $path = CDCOMPTA_PLUGIN_DIR . 'assets/dist/.vite/manifest.json';

        if ( ! file_exists( $path ) ) {
            return null;
        }

        $content = file_get_contents( $path );

        if ( $content === false ) {
            return null;
        }

        return json_decode( $content, true ) ?: null;
    }
}