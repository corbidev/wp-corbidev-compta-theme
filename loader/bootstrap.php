<?php
/**
 * Bootstrap du plugin wp-corbidev-compta.
 * Charge l'autoloader, enregistre les hooks d'activation/désactivation,
 * et initialise les contrôleurs.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once CDCOMPTA_PLUGIN_DIR . 'includes/autoload.php';

use CorbiDev\Compta\Core\Database;
use CorbiDev\Compta\Admin\AjaxHandler;
use CorbiDev\Compta\Frontend\PublicController;

/**
 * Activation : création des tables pour le site courant.
 */
register_activation_hook( CDCOMPTA_PLUGIN_FILE, static function (): void {
    Database::createTables();
} );

/**
 * Multisite : création des tables pour chaque nouveau sous-site.
 */
add_action( 'wpmu_new_blog', static function ( int $blog_id ): void {
    switch_to_blog( $blog_id );
    Database::createTables();
    restore_current_blog();
} );

/**
 * Initialisation du plugin après le chargement de tous les plugins.
 */
add_action( 'plugins_loaded', static function (): void {
    load_plugin_textdomain(
        CDCOMPTA_TEXT_DOMAIN,
        false,
        dirname( plugin_basename( CDCOMPTA_PLUGIN_FILE ) ) . '/languages'
    );

    // Shortcode public [corbidev_compta] (frontend).
    $publicController = new PublicController();
    $publicController->init();

    // Handlers AJAX (wp_ajax_* fonctionne aussi bien depuis le frontend que l'admin).
    $ajaxHandler = new AjaxHandler();
    $ajaxHandler->init();
} );
