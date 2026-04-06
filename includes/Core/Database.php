<?php
/**
 * Gestion de la base de données : création et mise à jour des tables du plugin.
 *
 * Ne dépend d'aucune fonction WordPress autre que dbDelta et $wpdb.
 */

declare( strict_types=1 );

namespace CorbiDev\Compta\Core;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class Database
{
    /**
     * Nom de la table sans préfixe.
     */
    public const TABLE_TRANSACTIONS = 'corbidev_compta_transactions';

    /**
     * Retourne le nom complet de la table (avec préfixe WordPress).
     */
    public static function getTableName(): string
    {
        global $wpdb;
        return $wpdb->prefix . self::TABLE_TRANSACTIONS;
    }

    /**
     * Crée ou met à jour la table des transactions.
     * Compatible multisite : à appeler dans le contexte du blog courant.
     */
    public static function createTables(): void
    {
        global $wpdb;

        $table           = self::getTableName();
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE IF NOT EXISTS {$table} (
            id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            account_id  VARCHAR(50)     NOT NULL,
            bank_id     VARCHAR(20)     DEFAULT NULL,
            branch_id   VARCHAR(20)     DEFAULT NULL,
            currency    VARCHAR(10)     NOT NULL DEFAULT 'EUR',
            fitid       VARCHAR(100)    NOT NULL,
            trn_type    VARCHAR(50)     DEFAULT NULL,
            dt_posted   DATE            NOT NULL,
            dt_avail    DATE            DEFAULT NULL,
            amount      DECIMAL(15,2)   NOT NULL,
            name        VARCHAR(255)    DEFAULT NULL,
            memo        TEXT            DEFAULT NULL,
            imported_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY  (id),
            UNIQUE KEY   fitid_account (fitid, account_id)
        ) {$charset_collate};";

        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        dbDelta( $sql );
    }
}
