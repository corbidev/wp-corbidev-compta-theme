<?php
/**
 * Footer du theme.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}
?>
</main>
<footer class="corbidev-compta-theme-footer">
    <div class="corbidev-compta-theme-footer__inner">
        <div>
            <strong><?php bloginfo( 'name' ); ?></strong><br>
            <span><?php echo esc_html( wp_date( 'Y' ) ); ?> - <?php esc_html_e( 'Theme WordPress pour la comptabilite et les operations OFX.', CDCOMPTA_TEXT_DOMAIN ); ?></span>
        </div>
        <div class="corbidev-compta-theme-footer__menu">
            <?php
            wp_nav_menu(
                [
                    'theme_location' => 'footer',
                    'container'      => false,
                    'menu_class'     => 'corbidev-compta-theme-menu',
                    'fallback_cb'    => 'cdcompta_render_fallback_menu',
                ]
            );
            ?>
        </div>
    </div>
</footer>
<?php wp_footer(); ?>
</body>
</html>