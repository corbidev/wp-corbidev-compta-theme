<?php

/**
 * Bootstrap du theme wp-corbidev-compta-theme.
 * Charge l'autoloader, initialise les hooks du theme
 * et garantit la presence du schema de donnees.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

require_once CDCOMPTA_THEME_DIR . 'includes/autoload.php';

use CorbiDev\Compta\Admin\AjaxHandler;
use CorbiDev\Compta\Core\Database;
use CorbiDev\Compta\Frontend\PublicController;

add_action('after_setup_theme', static function (): void {
    load_theme_textdomain(CDCOMPTA_TEXT_DOMAIN, CDCOMPTA_THEME_DIR . 'languages');

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support(
        'html5',
        ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']
    );
} );

/**
 * Cree les tables une seule fois par site et les recree en cas d'evolution du schema.
 */
add_action('init', static function (): void {
    $installedSchemaVersion = get_option('cdcompta_schema_version');

    if ($installedSchemaVersion === CDCOMPTA_SCHEMA_VERSION) {
        return;
    }

    Database::createTables();
    update_option('cdcompta_schema_version', CDCOMPTA_SCHEMA_VERSION);
}, 5);

add_action('init', static function (): void {
    static $isBootstrapped = false;

    if ($isBootstrapped) {
        return;
    }

    $isBootstrapped = true;

    $publicController = new PublicController();
    $publicController->init();

    $ajaxHandler = new AjaxHandler();
    $ajaxHandler->init();
}, 20);
