<?php
/**
 * Contrôleur admin.
 *
 * Les pages de comptabilité sont désormais exposées côté public via le
 * shortcode [corbidev_compta] (voir PublicController).
 * Ce fichier est conservé pour d'éventuelles extensions futures.
 */

declare( strict_types=1 );

namespace CorbiDev\Compta\Admin;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class AdminController
{
    public function init(): void {}
}