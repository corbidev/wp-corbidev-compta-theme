<?php
/**
 * Gestion des transactions en base de données.
 *
 * Seule classe autorisée à accéder directement à $wpdb pour les transactions.
 * Ne dépend d'aucune autre logique que la connexion WordPress.
 */

declare( strict_types=1 );

namespace CorbiDev\Compta\Core;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class TransactionRepository
{
    /**
     * Insère une transaction en base.
     * Retourne 'inserted', 'duplicate' ou un code d'erreur.
     *
     * @param  array{
     *   account_id: string,
     *   bank_id: string|null,
     *   branch_id: string|null,
     *   currency: string,
     *   fitid: string,
     *   trn_type: string|null,
     *   dt_posted: string,
     *   dt_avail: string|null,
     *   amount: float,
     *   name: string|null,
     *   memo: string|null
     * } $data
     * @return string
     */
    public function insertTransaction( array $data ): string
    {
        global $wpdb;

        $table = Database::getTableName();

        // Détection doublon par (fitid, account_id).
        $exists = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT id FROM {$table} WHERE fitid = %s AND account_id = %s LIMIT 1",
                $data['fitid'],
                $data['account_id']
            )
        );

        if ( $exists !== null ) {
            return 'duplicate';
        }

        $result = $wpdb->insert(
            $table,
            [
                'account_id' => $data['account_id'],
                'bank_id'    => $data['bank_id'],
                'branch_id'  => $data['branch_id'],
                'currency'   => $data['currency'],
                'fitid'      => $data['fitid'],
                'trn_type'   => $data['trn_type'],
                'dt_posted'  => $data['dt_posted'],
                'dt_avail'   => $data['dt_avail'],
                'amount'     => $data['amount'],
                'name'       => $data['name'],
                'memo'       => $data['memo'],
            ],
            [ '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%f', '%s', '%s' ]
        );

        if ( $result === false ) {
            return 'insert_failed';
        }

        return 'inserted';
    }

    /**
     * Retourne les transactions selon les filtres fournis.
     *
     * @param  array{
     *   account_id?: string,
     *   date_start?: string,
     *   date_end?: string,
     *   limit?: int,
     *   offset?: int,
     *   order?: string
     * } $filters
     * @return array<int, array<string, mixed>>
     */
    public function getTransactions( array $filters = [] ): array
    {
        global $wpdb;

        $table  = Database::getTableName();
        $where  = [];
        $params = [];

        if ( ! empty( $filters['account_id'] ) ) {
            $where[]  = 'account_id = %s';
            $params[] = $filters['account_id'];
        }

        if ( ! empty( $filters['date_start'] ) ) {
            $where[]  = 'dt_posted >= %s';
            $params[] = $filters['date_start'];
        }

        if ( ! empty( $filters['date_end'] ) ) {
            $where[]  = 'dt_posted <= %s';
            $params[] = $filters['date_end'];
        }

        $where_clause = ! empty( $where ) ? 'WHERE ' . implode( ' AND ', $where ) : '';
        $order        = isset( $filters['order'] ) && strtoupper( $filters['order'] ) === 'ASC' ? 'ASC' : 'DESC';
        $limit        = isset( $filters['limit'] )  ? max( 1, (int) $filters['limit'] )  : 100;
        $offset       = isset( $filters['offset'] ) ? max( 0, (int) $filters['offset'] ) : 0;

        $sql      = "SELECT * FROM {$table} {$where_clause} ORDER BY dt_posted {$order} LIMIT %d OFFSET %d";
        $params[] = $limit;
        $params[] = $offset;

        $prepared = $wpdb->prepare( $sql, ...$params );

        return $wpdb->get_results( $prepared, ARRAY_A ) ?: [];
    }

    /**
     * Compte les transactions selon les filtres fournis.
     *
     * @param  array{account_id?: string, date_start?: string, date_end?: string} $filters
     * @return int
     */
    public function countTransactions( array $filters = [] ): int
    {
        global $wpdb;

        $table  = Database::getTableName();
        $where  = [];
        $params = [];

        if ( ! empty( $filters['account_id'] ) ) {
            $where[]  = 'account_id = %s';
            $params[] = $filters['account_id'];
        }

        if ( ! empty( $filters['date_start'] ) ) {
            $where[]  = 'dt_posted >= %s';
            $params[] = $filters['date_start'];
        }

        if ( ! empty( $filters['date_end'] ) ) {
            $where[]  = 'dt_posted <= %s';
            $params[] = $filters['date_end'];
        }

        $where_clause = ! empty( $where ) ? 'WHERE ' . implode( ' AND ', $where ) : '';
        $sql          = "SELECT COUNT(*) FROM {$table} {$where_clause}";

        if ( ! empty( $params ) ) {
            $sql = $wpdb->prepare( $sql, ...$params );
        }

        return (int) $wpdb->get_var( $sql );
    }

    /**
     * Retourne la liste agrégée des comptes présents en base.
     *
     * @return array<int, array{account_id: string, bank_id: string, branch_id: string, currency: string, transaction_count: string, date_start: string, date_end: string, last_import: string}>
     */
    public function getAccounts(): array
    {
        global $wpdb;

        $table = Database::getTableName();

        return $wpdb->get_results(
            "SELECT
                account_id,
                bank_id,
                branch_id,
                currency,
                COUNT(*)         AS transaction_count,
                MIN(dt_posted)   AS date_start,
                MAX(dt_posted)   AS date_end,
                MAX(imported_at) AS last_import
             FROM {$table}
             GROUP BY account_id, bank_id, branch_id, currency
             ORDER BY account_id ASC",
            ARRAY_A
        ) ?: [];
    }
}
