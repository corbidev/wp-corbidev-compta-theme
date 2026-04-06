<?php
/**
 * Page d'accueil du theme.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

$applicationUrl = cdcompta_get_application_page_url();

get_header();
?>
<section class="corbidev-compta-theme-frontpage__hero">
    <div class="corbidev-compta-theme-frontpage__lead corbidev-compta-theme-panel">
        <span class="corbidev-compta-theme-eyebrow"><?php esc_html_e( 'Gestion bancaire WordPress', CDCOMPTA_TEXT_DOMAIN ); ?></span>
        <h1><?php bloginfo( 'name' ); ?></h1>
        <p>
            <?php esc_html_e( 'Un theme metier pour piloter les imports OFX, suivre les comptes et centraliser les transactions dans une interface React integree a WordPress.', CDCOMPTA_TEXT_DOMAIN ); ?>
        </p>
        <div class="corbidev-compta-theme-actions">
            <a class="corbidev-compta-theme-button" href="<?php echo esc_url( $applicationUrl ); ?>">
                <?php esc_html_e( 'Acceder a l application', CDCOMPTA_TEXT_DOMAIN ); ?>
            </a>
            <a class="corbidev-compta-theme-button corbidev-compta-theme-button--ghost" href="#corbidev-compta-theme-sections">
                <?php esc_html_e( 'Voir les fonctionnalites', CDCOMPTA_TEXT_DOMAIN ); ?>
            </a>
        </div>
    </div>

    <aside class="corbidev-compta-theme-frontpage__stats corbidev-compta-theme-panel">
        <div class="corbidev-compta-theme-stat">
            <strong>OFX</strong>
            <span><?php esc_html_e( 'Import natif et dedoublonnage des ecritures.', CDCOMPTA_TEXT_DOMAIN ); ?></span>
        </div>
        <div class="corbidev-compta-theme-stat">
            <strong>AJAX</strong>
            <span><?php esc_html_e( 'Chargement rapide des comptes et transactions sans recharger la page.', CDCOMPTA_TEXT_DOMAIN ); ?></span>
        </div>
        <div class="corbidev-compta-theme-stat">
            <strong>MS</strong>
            <span><?php esc_html_e( 'Compatible multisite et non multisite avec schema versionne.', CDCOMPTA_TEXT_DOMAIN ); ?></span>
        </div>
    </aside>
</section>

<section id="corbidev-compta-theme-sections" class="corbidev-compta-theme-frontpage__sections">
    <article class="corbidev-compta-theme-card">
        <h2><?php esc_html_e( 'Une vraie couche theme', CDCOMPTA_TEXT_DOMAIN ); ?></h2>
        <p class="corbidev-compta-theme-copy"><?php esc_html_e( 'Header, footer, menu WordPress, templates de pages et accueil editorial structurent maintenant le site autour de l application comptable.', CDCOMPTA_TEXT_DOMAIN ); ?></p>
    </article>
    <article class="corbidev-compta-theme-card">
        <h2><?php esc_html_e( 'Application isolee', CDCOMPTA_TEXT_DOMAIN ); ?></h2>
        <p class="corbidev-compta-theme-copy"><?php esc_html_e( 'La SPA React reste encapsulee dans une page dediee, sans imposer son rendu a tout le theme.', CDCOMPTA_TEXT_DOMAIN ); ?></p>
    </article>
    <article class="corbidev-compta-theme-card">
        <h2><?php esc_html_e( 'Edition WordPress standard', CDCOMPTA_TEXT_DOMAIN ); ?></h2>
        <p class="corbidev-compta-theme-copy"><?php esc_html_e( 'Les contenus classiques continuent d utiliser la boucle WordPress et peuvent etre administres comme n importe quel theme.', CDCOMPTA_TEXT_DOMAIN ); ?></p>
    </article>
</section>

<?php if ( have_posts() ) : ?>
    <section class="corbidev-compta-theme-page">
        <div class="corbidev-compta-theme-panel corbidev-compta-theme-shell corbidev-compta-theme-application__header">
            <?php while ( have_posts() ) : the_post(); ?>
                <h2><?php the_title(); ?></h2>
                <div class="corbidev-compta-theme-content">
                    <?php the_content(); ?>
                </div>
            <?php endwhile; ?>
        </div>
    </section>
<?php endif; ?>
<?php
get_footer();