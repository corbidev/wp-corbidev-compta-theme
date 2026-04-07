<?php
/**
 * Point d'entree du theme wp-corbidev-compta-theme.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$theme = wp_get_theme();

define( 'CDCOMPTA_VERSION', (string) ( $theme->get( 'Version' ) ?: '1.0.0' ) );
define( 'CDCOMPTA_SCHEMA_VERSION', '1.0.0' );
define( 'CDCOMPTA_THEME_DIR', trailingslashit( get_stylesheet_directory() ) );
define( 'CDCOMPTA_THEME_URL', trailingslashit( get_stylesheet_directory_uri() ) );
define( 'CDCOMPTA_TEXT_DOMAIN', 'corbidevcompta' );

require_once CDCOMPTA_THEME_DIR . 'loader/bootstrap.php';

add_action('after_setup_theme', static function (): void {
    add_theme_support(
        'custom-logo',
        [
            'height'      => 64,
            'width'       => 64,
            'flex-height' => true,
            'flex-width'  => true,
        ]
    );

    add_theme_support('align-wide');

    register_nav_menus(
        [
            'primary' => __('Menu principal', CDCOMPTA_TEXT_DOMAIN),
            'footer'  => __('Menu pied de page', CDCOMPTA_TEXT_DOMAIN),
        ]
    );
});

add_action('wp_enqueue_scripts', static function (): void {
    wp_enqueue_style(
        'corbidev-compta-theme-style',
        get_stylesheet_uri(),
        [],
        CDCOMPTA_VERSION
    );
});

add_action('after_switch_theme', 'cdcompta_ensure_application_page');
add_action('admin_init', 'cdcompta_ensure_application_page');

if (! function_exists('cdcompta_ensure_application_page')) {
    function cdcompta_ensure_application_page(): int
    {
        $existingPageId = cdcompta_get_application_page_id(false);

        if ($existingPageId > 0) {
            update_option('cdcompta_application_page_id', $existingPageId);
            return $existingPageId;
        }

        $pageId = (int) get_option('cdcompta_application_page_id');

        if ($pageId > 0 && get_post_status($pageId)) {
            return $pageId;
        }

        $pageId = wp_insert_post(
            [
                'post_type'    => 'page',
                'post_status'  => 'publish',
                'post_title'   => __('Comptabilite', CDCOMPTA_TEXT_DOMAIN),
                'post_name'    => 'comptabilite',
                'post_excerpt' => __('Acces a l application de gestion des comptes et des transactions OFX.', CDCOMPTA_TEXT_DOMAIN),
                'post_content' => __('Cette page heberge l application comptable du site.', CDCOMPTA_TEXT_DOMAIN),
            ],
            true
        );

        if (is_wp_error($pageId) || $pageId <= 0) {
            return 0;
        }

        update_post_meta($pageId, '_wp_page_template', 'templates/page-comptabilite.php');
        update_option('cdcompta_application_page_id', (int) $pageId);

        return (int) $pageId;
    }
}

if (! function_exists('cdcompta_get_application_page_id')) {
    function cdcompta_get_application_page_id(bool $allowAutoCreate = true): int
    {
        static $pageId = null;

        if ($pageId !== null && $pageId > 0) {
            return $pageId;
        }

        $savedPageId = (int) get_option('cdcompta_application_page_id');

        if ($savedPageId > 0 && get_post_status($savedPageId)) {
            $template = (string) get_post_meta($savedPageId, '_wp_page_template', true);

            if ($template === 'templates/page-comptabilite.php') {
                $pageId = $savedPageId;
                return $pageId;
            }
        }

        $pages = get_posts(
            [
                'post_type'              => 'page',
                'post_status'            => 'publish',
                'posts_per_page'         => 1,
                'fields'                 => 'ids',
                'no_found_rows'          => true,
                'update_post_meta_cache' => false,
                'update_post_term_cache' => false,
                'meta_key'               => '_wp_page_template',
                'meta_value'             => 'templates/page-comptabilite.php',
            ]
        );

        $pageId = isset($pages[0]) ? (int) $pages[0] : 0;

        if ($pageId > 0) {
            update_option('cdcompta_application_page_id', $pageId);
            return $pageId;
        }

        if ($allowAutoCreate && is_admin()) {
            $pageId = cdcompta_ensure_application_page();
        }

        return $pageId;
    }
}

if (! function_exists('cdcompta_get_application_page_url')) {
    function cdcompta_get_application_page_url(): string
    {
        $pageId = cdcompta_get_application_page_id();

        if ($pageId <= 0) {
            return home_url('/');
        }

        $url = get_permalink($pageId);

        return is_string($url) ? $url : home_url('/');
    }
}

if (! function_exists('cdcompta_has_imported_accounts')) {
    function cdcompta_has_imported_accounts(): bool
    {
        static $hasImportedAccounts = null;

        if ($hasImportedAccounts !== null) {
            return $hasImportedAccounts;
        }

        $repository = new \CorbiDev\Compta\Core\TransactionRepository();
        $accounts   = $repository->getAccounts();

        $hasImportedAccounts = ! empty($accounts);

        return $hasImportedAccounts;
    }
}

if (! function_exists('cdcompta_get_import_page_url')) {
    function cdcompta_get_import_page_url(): string
    {
        return add_query_arg('cdcompta-import', '1', cdcompta_get_application_page_url());
    }
}

if (! function_exists('cdcompta_render_fallback_menu')) {
    function cdcompta_render_fallback_menu($args): void
    {
        $menuClass = is_object($args) && isset($args->menu_class) ? (string) $args->menu_class : 'menu';
        $appUrl    = cdcompta_get_application_page_url();
        $postsPage = (int) get_option('page_for_posts');

        echo '<ul class="' . esc_attr($menuClass) . '">';
        echo '<li><a href="' . esc_url(home_url('/')) . '">' . esc_html__('Accueil', CDCOMPTA_TEXT_DOMAIN) . '</a></li>';

        if (cdcompta_get_application_page_id() > 0) {
            echo '<li><a href="' . esc_url($appUrl) . '">' . esc_html__('Comptabilite', CDCOMPTA_TEXT_DOMAIN) . '</a></li>';
        }

        if ($postsPage > 0) {
            echo '<li><a href="' . esc_url(get_permalink($postsPage)) . '">' . esc_html__('Actualites', CDCOMPTA_TEXT_DOMAIN) . '</a></li>';
        }

        echo '</ul>';
    }
}