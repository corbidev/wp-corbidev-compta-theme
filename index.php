<?php
/**
 * Template principal du theme.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class( 'corbidev-compta-theme' ); ?>>
<?php wp_body_open(); ?>
<main class="corbidev-compta-theme-main">
    <?php echo do_shortcode( '[corbidev_compta]' ); ?>
</main>
<?php wp_footer(); ?>
</body>
</html>