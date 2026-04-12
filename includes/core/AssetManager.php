<?php

namespace CorbiDev\Core;

/**
 * AssetManager avancé (niveau SaaS)
 *
 * Rôle :
 * - Charger manifest Vite
 * - Gérer cache
 * - Enqueue JS / CSS / chunks
 * - Ajouter preload + defer + optimisation
 */
class AssetManager
{
    /**
     * Manifest Vite
     *
     * @var array<string, mixed>
     */
    private static array $manifest = [];

    /**
     * Liste des assets déjà chargés (anti-duplication)
     *
     * @var array<string, bool>
     */
    private static array $loaded = [];

    /**
     * Initialise le manifest (lazy)
     *
     * @return void
     */
    private static function init(): void
    {
        if (!empty(self::$manifest)) {
            return;
        }

        $cache = wp_cache_get('corbidev_manifest');

        if ($cache !== false) {
            self::$manifest = $cache;
            return;
        }

        $path = CDCOMPTA_THEME_PATH . '/assets/dist/.vite/manifest.json';

        if (!file_exists($path)) {
            return;
        }

        $json = file_get_contents($path);

        if ($json === false) {
            return;
        }

        $decoded = json_decode($json, true);

        if (is_array($decoded)) {
            self::$manifest = $decoded;
            wp_cache_set('corbidev_manifest', self::$manifest);
        }
    }

    /**
     * Enqueue une entrée Vite
     *
     * @param string $entry
     * @param string $context
     * @return void
     */
    public static function enqueue(string $entry, string $context): void
    {
        self::init();

        if (isset(self::$loaded[$entry])) {
            return;
        }

        if (empty(self::$manifest[$entry]['file'])) {
            return;
        }

        $data = self::$manifest[$entry];
        $version = wp_get_theme()->get('Version');

        $handle = 'corbidev-' . $context . '-' . md5($entry);
        $src = CDCOMPTA_THEME_URL . '/assets/dist/' . $data['file'];

        /**
         * Preload JS
         */
        self::preload($src, 'script');

        /**
         * JS principal
         */
        wp_enqueue_script($handle, $src, [], $version, true);

        /**
         * CSS
         */
        if (!empty($data['css'])) {
            foreach ($data['css'] as $css) {

                $href = CDCOMPTA_THEME_URL . '/assets/dist/' . $css;

                self::preload($href, 'style');

                wp_enqueue_style(
                    $handle . '-style-' . md5($css),
                    $href,
                    [],
                    $version
                );
            }
        }

        /**
         * Imports (chunks)
         */
        if (!empty($data['imports'])) {
            foreach ($data['imports'] as $import) {
                self::enqueue($import, $context);
            }
        }

        self::$loaded[$entry] = true;
    }

    /**
     * Ajoute preload dans le head
     *
     * @param string $url
     * @param string $type
     * @return void
     */
    private static function preload(string $url, string $type): void
    {
        add_action('wp_head', function () use ($url, $type) {

            if ($type === 'script') {
                echo '<link rel="preload" href="' . esc_url($url) . '" as="script">';
            }

            if ($type === 'style') {
                echo '<link rel="preload" href="' . esc_url($url) . '" as="style">';
            }

        }, 1);
    }

    /**
     * Ajoute defer automatiquement aux scripts CorbiDev
     *
     * @param string $tag
     * @param string $handle
     * @param string $src
     * @return string
     */
    public static function addScriptAttributes(string $tag, string $handle, string $src): string
    {
        if (str_contains($handle, 'corbidev')) {
            return str_replace('<script ', '<script defer ', $tag);
        }

        return $tag;
    }
}