<?php
/**
 * Template du blog.
 */

if (! defined('ABSPATH')) {
    exit;
}

get_header();
?>
<section class="corbidev-compta-theme-page">
    <div class="corbidev-compta-theme-shell corbidev-compta-theme-stack">
        <header class="corbidev-compta-theme-panel corbidev-compta-theme-archive-header">
            <span class="corbidev-compta-theme-kicker"><?php esc_html_e('Journal', CDCOMPTA_TEXT_DOMAIN); ?></span>
            <h1 class="corbidev-compta-theme-page-title">
                <?php echo esc_html(get_the_title((int) get_option('page_for_posts')) ?: __('Actualites', CDCOMPTA_TEXT_DOMAIN)); ?>
            </h1>
            <p class="corbidev-compta-theme-archive-description">
                <?php esc_html_e('Retrouvez ici les articles, notes de version et contenus editoriaux du site.', CDCOMPTA_TEXT_DOMAIN); ?>
            </p>
        </header>

        <?php if (have_posts()) : ?>
            <div class="corbidev-compta-theme-post-list">
                <?php while (have_posts()) : the_post(); ?>
                    <article <?php post_class('corbidev-compta-theme-post'); ?>>
                        <div class="corbidev-compta-theme-meta-row">
                            <span><?php echo esc_html(get_the_date()); ?></span>
                            <span><?php echo esc_html(get_the_author()); ?></span>
                        </div>
                        <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                        <div class="corbidev-compta-theme-content">
                            <?php the_excerpt(); ?>
                        </div>
                        <footer class="corbidev-compta-theme-post__footer">
                            <a class="corbidev-compta-theme-link" href="<?php the_permalink(); ?>"><?php esc_html_e('Lire l article', CDCOMPTA_TEXT_DOMAIN); ?></a>
                            <span class="corbidev-compta-theme-meta"><?php echo esc_html(get_comments_number_text(__('Aucun commentaire', CDCOMPTA_TEXT_DOMAIN), __('1 commentaire', CDCOMPTA_TEXT_DOMAIN), __('% commentaires', CDCOMPTA_TEXT_DOMAIN))); ?></span>
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
                <h2><?php esc_html_e('Aucun article pour le moment', CDCOMPTA_TEXT_DOMAIN); ?></h2>
                <p class="corbidev-compta-theme-page-intro"><?php esc_html_e('Le blog est pret, mais aucun contenu n a encore ete publie.', CDCOMPTA_TEXT_DOMAIN); ?></p>
            </div>
        <?php endif; ?>
    </div>
</section>
<?php
get_footer();