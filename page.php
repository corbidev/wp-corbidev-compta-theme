<?php
/**
 * Template standard des pages.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

get_header();
?>
<section class="corbidev-compta-theme-page">
    <div class="corbidev-compta-theme-shell">
        <?php while ( have_posts() ) : the_post(); ?>
            <article <?php post_class( 'corbidev-compta-theme-panel corbidev-compta-theme-application__header' ); ?>>
                <header>
                    <h1 class="corbidev-compta-theme-page-title"><?php the_title(); ?></h1>
                </header>
                <div class="corbidev-compta-theme-content corbidev-compta-theme-page-intro">
                    <?php the_content(); ?>
                </div>
            </article>
        <?php endwhile; ?>
    </div>
</section>
<?php
get_footer();