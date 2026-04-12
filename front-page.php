<?php
/**
 * Template de la page d'accueil
 *
 * Rôle :
 * - Fournir un point de montage React
 * - Transmettre le contexte WordPress au front
 *
 * ⚠️ Aucun rendu HTML métier
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

/**
 * Contexte WordPress exposé à React
 */
$context = [
    'type'      => 'front-page',
    'pageId'    => get_the_ID(),
    'postType'  => get_post_type(),
];
?>

<div 
    id="corbidev-frontend-app"
    data-context="<?php echo esc_attr(wp_json_encode($context)); ?>"
></div>

<?php
get_footer();
