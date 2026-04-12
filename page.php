<?php
/**
 * Template générique des pages
 *
 * Rôle :
 * - Fournir un point de montage React
 * - Transmettre le contexte WordPress au front
 *
 * ⚠️ Aucun rendu WordPress (the_title, the_content, etc.)
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

/**
 * Contexte WordPress exposé à React
 */
$context = [
    'type'      => 'page',
    'pageId'    => get_the_ID(),
    'postType'  => get_post_type(),
    'slug'      => get_post_field('post_name', get_the_ID()),
];
?>

<div 
    id="corbidev-frontend-app"
    data-context="<?php echo esc_attr(wp_json_encode($context)); ?>"
></div>

<?php
get_footer();