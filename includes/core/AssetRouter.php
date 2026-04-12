<?php

namespace CorbiDev\Core;

/**
 * Router des assets
 *
 * Rôle :
 * - Associer le contexte WP aux entrées Vite
 */
class AssetRouter
{
    /**
     * Entrées frontend
     *
     * @return array<string>
     */
    public static function getFrontendEntries(): array
    {
        // Homepage
        if (is_front_page()) {
            return ['assets/src/frontend/main.tsx'];
        }

        // Pages
        if (is_page()) {
            return ['assets/src/main.ts'];
        }

        // Articles
        if (is_single()) {
            return ['assets/src/main.ts'];
        }

        // Fallback
        return ['assets/src/main.ts'];
    }

    /**
     * Entrées admin
     *
     * @return array<string>
     */
    public static function getAdminEntries(): array
    {
        $screen = get_current_screen();

        if (!$screen) {
            return [];
        }

        if ($screen->id === 'toplevel_page_corbidev-app') {
            return ['assets/src/admin/main.tsx'];
        }

        return [];
    }
}