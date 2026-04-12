<?php
/**
 * Template Name: Application Comptabilite
 * Template Post Type: page
 *
 * Page dediee a l'application comptable React.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();
?>
<section class="corbidev-compta-theme-page">
    <div class="corbidev-compta-theme-shell corbidev-compta-theme-application">
        <?php while ( have_posts() ) : the_post(); ?>
            <article <?php post_class( 'corbidev-compta-theme-panel corbidev-compta-theme-application__header' ); ?>>
                <span class="corbidev-compta-theme-eyebrow"><?php esc_html_e( 'Application interne', CDCOMPTA_TEXT_DOMAIN ); ?></span>
                <h1 class="corbidev-compta-theme-page-title"><?php the_title(); ?></h1>
                <div class="corbidev-compta-theme-content corbidev-compta-theme-page-intro">
                    <?php if ( has_excerpt() ) : ?>
                        <p><?php echo esc_html( get_the_excerpt() ); ?></p>
                    <?php endif; ?>
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>

        <div class="corbidev-compta-theme-application__canvas">
            <?php echo do_shortcode( '[corbidev_compta]' ); ?>
        </div>
    </div>
</section>
<?php
get_footer();