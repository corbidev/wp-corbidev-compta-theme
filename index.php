<?php

/**
 * Template principal du theme.
 */

if (! defined('ABSPATH')) {
    exit;
}

get_header();
?>
<section class="corbidev-compta-theme-page">
    <div class="corbidev-compta-theme-grid corbidev-compta-theme-shell">
        <?php if (have_posts()) : ?>
        <div class="corbidev-compta-theme-post-list">
            <?php while (have_posts()) : the_post(); ?>
            <article <?php post_class('corbidev-compta-theme-post'); ?>>
                <p class="corbidev-compta-theme-meta"><?php echo esc_html(get_the_date()); ?></p>
                <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                <div class="corbidev-compta-theme-content">
                    <?php the_excerpt(); ?>
                </div>
            </article>
            <?php endwhile; ?>
        </div>

        <?php the_posts_pagination(); ?>
        <?php else : ?>
        <div class="corbidev-compta-theme-panel corbidev-compta-theme-empty">
            <h1 class="corbidev-compta-theme-page-title"><?php esc_html_e('Aucun contenu', CDCOMPTA_TEXT_DOMAIN); ?>
            </h1>
            <p class="corbidev-compta-theme-page-intro">
                <?php esc_html_e('Commencez par creer une page d accueil et une page comptabilite pour exploiter le theme.', CDCOMPTA_TEXT_DOMAIN); ?>
            </p>
        </div>
        <?php endif; ?>
    </div>
</section>
<?php
get_footer();