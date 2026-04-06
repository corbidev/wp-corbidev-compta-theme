<?php
/**
 * Plugin Name:       Corbidev Compta
 * Plugin URI:        https://github.com/CorbiDev/wp-corbidev-compta
 * Depot Github:      wp-corbidev-compta
 * Description:       Gestion de comptabilité bancaire avec import de fichiers OFX. Affichage des transactions par compte, filtrage par dates.
 * Version:           1.0.0
 * Author:            CorbiDev
 * Author URI:        https://github.com/CorbiDev
 *
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 *
 * Text Domain:       corbidevcompta
 * Domain Path:       /languages
 *
 * Requires at least: 6.0
 * Tested up to:      6.5
 * Requires PHP:      8.4
 *
 * Icone:             assets/icons/favicon.png
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$plugin_data = get_file_data(
    __FILE__,
    array( 'Version' => 'Version' )
);

define( 'CDCOMPTA_VERSION',     $plugin_data['Version'] );
define( 'CDCOMPTA_PLUGIN_FILE', __FILE__ );
define( 'CDCOMPTA_PLUGIN_DIR',  plugin_dir_path( __FILE__ ) );
define( 'CDCOMPTA_PLUGIN_URL',  plugin_dir_url( __FILE__ ) );
define( 'CDCOMPTA_TEXT_DOMAIN', 'corbidevcompta' );

require_once CDCOMPTA_PLUGIN_DIR . 'loader/bootstrap.php';