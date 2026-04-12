<?php

namespace CorbiDev\Core;

/**
 * Gestion des hooks WordPress
 *
 * Rôle :
 * - Centraliser tous les add_action / add_filter
 * - Éviter toute logique dans functions.php
 */
class Hooks
{
    /**
     * Initialise les hooks
     *
     * @return void
     */
    public static function init(): void
    {
        add_action('after_setup_theme', [self::class, 'setupTheme']);
        add_action('init', [self::class, 'registerMenus']);
    }

    /**
     * Configuration du thème
     *
     * @return void
     */
    public static function setupTheme(): void
    {
        add_theme_support('title-tag');
        add_theme_support('post-thumbnails');
    }

    /**
     * Enregistrement des menus
     *
     * @return void
     */
    public static function registerMenus(): void
    {
        register_nav_menus([
            'primary' => __('Primary Menu', 'corbidevtheme'),
        ]);
    }
}