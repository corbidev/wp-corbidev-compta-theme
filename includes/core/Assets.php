<?php

namespace CorbiDev\Core;

/**
 * Point d'entrée des assets WordPress
 *
 * Rôle :
 * - Brancher les hooks WordPress
 * - Déléguer le chargement des assets au AssetManager
 * - Appliquer les optimisations globales (defer)
 */
class Assets
{
    /**
     * Initialise les hooks liés aux assets
     *
     * @return void
     */
    public static function init(): void
    {
        /**
         * Frontend
         */
        add_action('wp_enqueue_scripts', [self::class, 'enqueueFrontend']);

        /**
         * Admin
         */
        add_action('admin_enqueue_scripts', [self::class, 'enqueueAdmin']);

        /**
         * Optimisation : ajout du defer sur les scripts CorbiDev
         */
        add_filter(
            'script_loader_tag',
            [AssetManager::class, 'addScriptAttributes'],
            10,
            3
        );
    }

    /**
     * Charge les assets frontend
     *
     * @return void
     */
    public static function enqueueFrontend(): void
    {
        $entries = AssetRouter::getFrontendEntries();

        if (empty($entries)) {
            return;
        }

        foreach ($entries as $entry) {
            AssetManager::enqueue($entry, 'frontend');
        }
    }

    /**
     * Charge les assets admin
     *
     * @return void
     */
    public static function enqueueAdmin(): void
    {
        $entries = AssetRouter::getAdminEntries();

        if (empty($entries)) {
            return;
        }

        foreach ($entries as $entry) {
            AssetManager::enqueue($entry, 'admin');
        }
    }
}