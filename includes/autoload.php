<?php
/**
 * Autoloader PSR-4 pour le namespace CorbiDev\Compta\.
 *
 * Mapping : CorbiDev\Compta\{Reste} → includes/{Reste}.php
 * Exemple  : CorbiDev\Compta\Core\Database → includes/Core/Database.php
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

spl_autoload_register( static function ( string $class ): void {
    $prefix   = 'CorbiDev\\Compta\\';
    $base_dir = CDCOMPTA_THEME_DIR . 'includes/';

    if ( ! str_starts_with( $class, $prefix ) ) {
        return;
    }

    $relative_class = substr( $class, strlen( $prefix ) );
    $file           = $base_dir . str_replace( '\\', '/', $relative_class ) . '.php';

    if ( file_exists( $file ) ) {
        require_once $file;
    }
} );
