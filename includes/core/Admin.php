<?php

namespace CorbiDev\Core;

/**
 * Gestion du back-office WordPress
 *
 * Rôle :
 * - Déclarer les menus admin
 * - Fournir les points de montage JS
 * - Déléguer la logique métier aux services
 */
class Admin
{
    /**
     * Initialise les hooks admin
     *
     * @return void
     */
    public static function init(): void
    {
        add_action('admin_menu', [self::class, 'registerMenus']);
    }

    /**
     * Enregistre les menus admin
     *
     * @return void
     */
    public static function registerMenus(): void
    {
        add_menu_page(
            __('Application', 'corbidevtheme'),
            __('Application', 'corbidevtheme'),
            'manage_options',
            'corbidev-app',
            [self::class, 'renderApp'],
            'dashicons-admin-generic',
            3
        );
    }

    /**
     * Rend le conteneur de l'application admin
     *
     * ⚠️ Aucun HTML métier ici
     * ⚠️ Juste un point de montage JS
     *
     * @return void
     */
    public static function renderApp(): void
    {
        echo '<div id="corbidev-admin-app"></div>';
    }
}