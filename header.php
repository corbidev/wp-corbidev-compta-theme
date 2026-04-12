<?php
/**
 * En-tête principal du thème
 *
 * Rôle :
 * - Initialiser le document HTML
 * - Charger les hooks WordPress (wp_head)
 * - Ouvrir la balise body
 *
 * ⚠️ Aucune logique métier
 */

if (!defined('ABSPATH')) {
    exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>