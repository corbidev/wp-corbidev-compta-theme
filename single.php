<?php
/**
 * Template des articles unitaires.
 */

if (! defined('ABSPATH')) {
    exit;
}

get_header();
?>
<section class="corbidev-compta-theme-page">
    <div class="corbidev-compta-theme-single corbidev-compta-theme-stack">
        <?php while (have_posts()) : the_post(); ?>
            <article <?php post_class('corbidev-compta-theme-panel corbidev-compta-theme-application__header'); ?>>
                <header>
                    <span class="corbidev-compta-theme-kicker"><?php echo esc_html(get_post_type_object(get_post_type())->labels->singular_name ?? __('Article', CDCOMPTA_TEXT_DOMAIN)); ?></span>
                    <h1 class="corbidev-compta-theme-page-title"><?php the_title(); ?></h1>
                    <div class="corbidev-compta-theme-meta-row">
                        <span><?php echo esc_html(get_the_date()); ?></span>
                        <span><?php echo esc_html(get_the_author()); ?></span>
                        <?php if (has_category()) : ?>
                            <span><?php echo wp_kses_post(get_the_category_list(', ')); ?></span>
                        <?php endif; ?>
                    </div>
                </header>

                <div class="corbidev-compta-theme-single__content corbidev-compta-theme-content">
                    <?php the_content(); ?>
                </div>

                <footer class="corbidev-compta-theme-post__footer">
                    <div class="corbidev-compta-theme-meta">
                        <?php the_tags('', ' ', ''); ?>
                    </div>
                </footer>
            </article>

            <nav class="corbidev-compta-theme-post-nav" aria-label="<?php esc_attr_e('Navigation des articles', CDCOMPTA_TEXT_DOMAIN); ?>">
                <div>
                    <?php previous_post_link('%link', '<span class="corbidev-compta-theme-post-nav-label">' . esc_html__('Article precedent', CDCOMPTA_TEXT_DOMAIN) . '</span>%title'); ?>
                </div>
                <div>
                    <?php next_post_link('%link', '<span class="corbidev-compta-theme-post-nav-label">' . esc_html__('Article suivant', CDCOMPTA_TEXT_DOMAIN) . '</span>%title'); ?>
                </div>
            </nav>
        <?php endwhile; ?>
    </div>
</section>
<?php
get_footer();