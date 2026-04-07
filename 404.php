<?php
/**
 * Template 404.
 */

if (! defined('ABSPATH')) {
    exit;
}

get_header();
?>
<section class="corbidev-compta-theme-page">
    <div class="corbidev-compta-theme-shell">
        <div class="corbidev-compta-theme-panel corbidev-compta-theme-404">
            <span class="corbidev-compta-theme-404-code">404</span>
            <h1 class="corbidev-compta-theme-page-title"><?php esc_html_e('Page introuvable', CDCOMPTA_TEXT_DOMAIN); ?></h1>
            <p class="corbidev-compta-theme-page-intro"><?php esc_html_e('Le contenu demande n existe pas ou a ete deplace. Revenez a l accueil ou ouvrez directement l application comptable.', CDCOMPTA_TEXT_DOMAIN); ?></p>
            <div class="corbidev-compta-theme-actions">
                <a class="corbidev-compta-theme-button" href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('Retour a l accueil', CDCOMPTA_TEXT_DOMAIN); ?></a>
                <a class="corbidev-compta-theme-button corbidev-compta-theme-button--ghost" href="<?php echo esc_url(cdcompta_get_application_page_url()); ?>"><?php esc_html_e('Ouvrir la comptabilite', CDCOMPTA_TEXT_DOMAIN); ?></a>
            </div>
        </div>
    </div>
</section>
<?php
get_footer();