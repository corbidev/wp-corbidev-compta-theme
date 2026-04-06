<?php
/**
 * Header du theme.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$applicationUrl = cdcompta_get_application_page_url();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'corbidev-compta-theme' ); ?>>
<?php wp_body_open(); ?>
<header class="corbidev-compta-theme-header">
    <div class="corbidev-compta-theme-header__inner">
        <div class="corbidev-compta-theme-brand">
            <?php if ( has_custom_logo() ) : ?>
                <div class="corbidev-compta-theme-brand__logo"><?php the_custom_logo(); ?></div>
            <?php else : ?>
                <span class="corbidev-compta-theme-brand__mark">C</span>
            <?php endif; ?>
            <div class="corbidev-compta-theme-brand__text">
                <a class="corbidev-compta-theme-brand__title" href="<?php echo esc_url( home_url( '/' ) ); ?>">
                    <?php bloginfo( 'name' ); ?>
                </a>
                <span class="corbidev-compta-theme-brand__tagline">
                    <?php bloginfo( 'description' ); ?>
                </span>
            </div>
        </div>

        <div class="corbidev-compta-theme-nav">
            <nav aria-label="<?php esc_attr_e( 'Navigation principale', CDCOMPTA_TEXT_DOMAIN ); ?>">
                <?php
                wp_nav_menu(
                    [
                        'theme_location' => 'primary',
                        'container'      => false,
                        'menu_class'     => 'corbidev-compta-theme-menu',
                        'fallback_cb'    => 'cdcompta_render_fallback_menu',
                    ]
                );
                ?>
            </nav>

            <a class="corbidev-compta-theme-button" href="<?php echo esc_url( $applicationUrl ); ?>">
                <?php esc_html_e( 'Ouvrir la comptabilite', CDCOMPTA_TEXT_DOMAIN ); ?>
            </a>
        </div>
    </div>
</header>
<main class="corbidev-compta-theme-main">