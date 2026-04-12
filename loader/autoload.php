<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Autoloader PSR-4 multi-namespaces pour le thème CorbiDev
 *
 * Permet de charger automatiquement les classes PHP en fonction de leur namespace.
 * Chaque namespace est associé à un répertoire spécifique du thème.
 *
 * Exemple :
 * - CorbiDev\Services\AccountService → /includes/Services/AccountService.php
 * - CorbiDevAdmin\Pages\AccountsPage → /admin/Pages/AccountsPage.php
 *
 * @param string $class Nom complet de la classe (FQCN)
 * @return void
 */
spl_autoload_register(function (string $class): void {

    /**
     * Mapping des namespaces vers les répertoires
     *
     * Clé   = namespace racine
     * Valeur = chemin relatif depuis la racine du thème
     */
    $prefixes = [

        // Cœur du thème (logique métier, core, services, helpers)
        'CorbiDev\\' => CORBIDEV_THEME_PATH . '/includes/',

        // Back-office WordPress (pages admin, UI admin)
        'CorbiDevAdmin\\' => CORBIDEV_THEME_PATH . '/admin/',

        // ⚠️ Optionnel (à éviter si tu respectes strictement CorbiDev)
        'CorbiDevPublic\\' => CORBIDEV_THEME_PATH . '/public/',
    ];

    /**
     * Parcours des namespaces déclarés
     */
    foreach ($prefixes as $prefix => $base_dir) {

        $len = strlen($prefix);

        /**
         * Vérifie si la classe appartient à ce namespace
         */
        if (strncmp($prefix, $class, $len) !== 0) {
            continue;
        }

        /**
         * Récupère la partie relative de la classe
         */
        $relative_class = substr($class, $len);

        /**
         * Transforme le namespace en chemin de fichier
         */
        $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

        /**
         * Normalisation du chemin (sécurité)
         */
        $file = str_replace(['//', '\\\\'], ['/', '\\'], $file);

        /**
         * Inclusion du fichier si existant
         */
        if (file_exists($file)) {
            require_once $file;
        }

        return;
    }
});
