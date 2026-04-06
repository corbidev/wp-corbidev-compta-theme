<?php
/**
 * Point d'entree du theme wp-corbidev-compta-theme.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$theme = wp_get_theme();

define( 'CDCOMPTA_VERSION', (string) ( $theme->get( 'Version' ) ?: '1.0.0' ) );
define( 'CDCOMPTA_SCHEMA_VERSION', '1.0.0' );
define( 'CDCOMPTA_THEME_DIR', trailingslashit( get_stylesheet_directory() ) );
define( 'CDCOMPTA_THEME_URL', trailingslashit( get_stylesheet_directory_uri() ) );
define( 'CDCOMPTA_TEXT_DOMAIN', 'corbidevcompta' );

require_once CDCOMPTA_THEME_DIR . 'loader/bootstrap.php';