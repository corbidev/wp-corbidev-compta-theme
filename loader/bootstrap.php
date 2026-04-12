<?php

if (!defined('ABSPATH')) {
    exit;
}

use CorbiDev\Core\Theme;

/**
 * Bootstrap du thème CorbiDev
 *
 * Ce fichier est le point d'entrée principal après chargement de WordPress.
 * Il initialise le thème en déclenchant la classe principale.
 *
 * Hook utilisé :
 * - after_setup_theme : déclenché après l'initialisation du thème
 *
 * @return void
 */


add_action('after_setup_theme', function (): void {
    (new Theme())->init();
});
