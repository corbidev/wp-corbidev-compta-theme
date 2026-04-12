<?php

/**
 * Theme bootstrap file.
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get theme data
 */
$theme = wp_get_theme();

/**
 * Theme version (from style.css)
 */
if (!defined('CDCOMPTA_THEME_VERSION')) {
    define('CDCOMPTA_THEME_VERSION', (string) $theme->get('Version'));
}

/**
 * Theme paths
 */
if (!defined('CDCOMPTA_THEME_PATH')) {
    define('CDCOMPTA_THEME_PATH', get_template_directory());
}

if (!defined('CDCOMPTA_THEME_URL')) {
    define('CDCOMPTA_THEME_URL', get_template_directory_uri());
}

/**
 * Includes path
 */
if (!defined('CDCOMPTA_INCLUDES_PATH')) {
    define('CDCOMPTA_INCLUDES_PATH', CDCOMPTA_THEME_PATH . '/includes');
}

/**
 * Loader path
 */
if (!defined('CDCOMPTA_LOADER_PATH')) {
    define('CDCOMPTA_LOADER_PATH', CDCOMPTA_THEME_PATH . '/loader');
}

if (!defined('CDCOMPTA_TEXT_DOMAIN')) {
     define('CDCOMPTA_TEXT_DOMAIN', 'corbidevcompta' );
}

/**
 * Load autoloader
 */
require_once CDCOMPTA_LOADER_PATH . '/autoload.php';

/**
 * Load theme bootstrap
 */
require_once CDCOMPTA_LOADER_PATH . '/bootstrap.php';