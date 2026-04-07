<?php
/**
 * Template des archives.
 */

if (! defined('ABSPATH')) {
    exit;
}

get_header();
?>
<section class="corbidev-compta-theme-page">
    <div class="corbidev-compta-theme-shell corbidev-compta-theme-stack">
        <header class="corbidev-compta-theme-panel corbidev-compta-theme-archive-header">
            <span class="corbidev-compta-theme-kicker"><?php esc_html_e('Archive', CDCOMPTA_TEXT_DOMAIN); ?></span>
            <h1 class="corbidev-compta-theme-page-title"><?php the_archive_title(); ?></h1>
            <div class="corbidev-compta-theme-archive-description">
                <?php the_archive_description(); ?>
            </div>
        </header>

        <?php if (have_posts()) : ?>
            <div class="corbidev-compta-theme-post-list">
                <?php while (have_posts()) : the_post(); ?>
                    <article <?php post_class('corbidev-compta-theme-post'); ?>>
                        <div class="corbidev-compta-theme-meta-row">
                            <span><?php echo esc_html(get_the_date()); ?></span>
                            <span><?php echo esc_html(get_post_type_object(get_post_type())->labels->singular_name ?? ''); ?></span>
                        </div>
                        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                        <div class="corbidev-compta-theme-content">
                            <?php the_excerpt(); ?>
                        </div>
                        <footer class="corbidev-compta-theme-post__footer">
                            <a class="corbidev-compta-theme-link" href="<?php the_permalink(); ?>"><?php esc_html_e('Ouvrir', CDCOMPTA_TEXT_DOMAIN); ?></a>
                        </footer>
                    </article>
                <?php endwhile; ?>
            </div>

            <?php
            the_posts_pagination([
                'mid_size'  => 1,
                'prev_text' => __('Precedent', CDCOMPTA_TEXT_DOMAIN),
                'next_text' => __('Suivant', CDCOMPTA_TEXT_DOMAIN),
                'class'     => 'corbidev-compta-theme-pagination',
            ]);
            ?>
        <?php else : ?>
            <div class="corbidev-compta-theme-panel corbidev-compta-theme-empty">
                <h2><?php esc_html_e('Aucun resultat', CDCOMPTA_TEXT_DOMAIN); ?></h2>
                <p class="corbidev-compta-theme-page-intro"><?php esc_html_e('Cette archive est vide pour le moment.', CDCOMPTA_TEXT_DOMAIN); ?></p>
            </div>
        <?php endif; ?>
    </div>
</section>
<?php
get_footer();