<?php
/**
 * Gestionnaire des requêtes AJAX admin.
 *
 * Transforme les codes d'erreur métier en réponses JSON WordPress.
 * C'est ici que sont autorisées les fonctions wp_send_json_* et check_ajax_referer.
 */

declare( strict_types=1 );

namespace CorbiDev\Compta\Admin;

use CorbiDev\Compta\Core\TransactionImporter;
use CorbiDev\Compta\Core\TransactionRepository;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class AjaxHandler
{
    private TransactionImporter   $importer;
    private TransactionRepository $repository;

    public function __construct()
    {
        $this->repository = new TransactionRepository();
        $this->importer   = new TransactionImporter( $this->repository );
    }

    /**
     * Enregistre les actions AJAX WordPress.
     */
    public function init(): void
    {
        add_action( 'wp_ajax_cdcompta_import_ofx',       [ $this, 'handleImport' ] );
        add_action( 'wp_ajax_cdcompta_get_transactions', [ $this, 'handleGetTransactions' ] );
        add_action( 'wp_ajax_cdcompta_get_accounts',     [ $this, 'handleGetAccounts' ] );
    }

    // -------------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------------

    /**
     * Gère l'upload et l'import d'un fichier OFX.
     */
    public function handleImport(): void
    {
        if ( ! check_ajax_referer( 'cdcompta_nonce', 'nonce', false ) ) {
            wp_send_json_error( [ 'code' => 'invalid_nonce' ], 403 );
        }

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'code' => 'permission_denied' ], 403 );
        }

        if ( empty( $_FILES['ofx_file'] ) ) {
            wp_send_json_error( [ 'code' => 'no_file_uploaded' ], 400 );
        }

        /** @var array{name: string, tmp_name: string, error: int, size: int} $file */
        $file = $_FILES['ofx_file'];

        if ( $file['error'] !== UPLOAD_ERR_OK ) {
            wp_send_json_error( [ 'code' => 'upload_error', 'upload_error_code' => $file['error'] ], 400 );
        }

        $ext = strtolower( (string) pathinfo( $file['name'], PATHINFO_EXTENSION ) );

        if ( $ext !== 'ofx' ) {
            wp_send_json_error( [ 'code' => 'invalid_file_type' ], 400 );
        }

        $content = file_get_contents( $file['tmp_name'] );

        if ( $content === false ) {
            wp_send_json_error( [ 'code' => 'file_read_error' ], 500 );
        }

        try {
            $result = $this->importer->import( $content );
            wp_send_json_success( $result );
        } catch ( \RuntimeException $e ) {
            wp_send_json_error( [ 'code' => $e->getMessage() ], 422 );
        }
    }

    /**
     * Retourne les transactions filtrées (lecture).
     */
    public function handleGetTransactions(): void
    {
        if ( ! check_ajax_referer( 'cdcompta_nonce', 'nonce', false ) ) {
            wp_send_json_error( [ 'code' => 'invalid_nonce' ], 403 );
        }

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'code' => 'permission_denied' ], 403 );
        }

        $filters = [
            'account_id' => sanitize_text_field( $_GET['account_id'] ?? '' ),
            'date_start' => sanitize_text_field( $_GET['date_start'] ?? '' ),
            'date_end'   => sanitize_text_field( $_GET['date_end']   ?? '' ),
            'limit'      => min( (int) ( $_GET['limit']  ?? 100 ), 500 ),
            'offset'     => max( (int) ( $_GET['offset'] ?? 0 ),   0   ),
            'order'      => sanitize_text_field( $_GET['order'] ?? 'DESC' ),
        ];

        $transactions = $this->repository->getTransactions( $filters );
        $total        = $this->repository->countTransactions( $filters );

        wp_send_json_success( [
            'transactions' => $transactions,
            'total'        => $total,
        ] );
    }

    /**
     * Retourne la liste des comptes distincts (lecture).
     */
    public function handleGetAccounts(): void
    {
        if ( ! check_ajax_referer( 'cdcompta_nonce', 'nonce', false ) ) {
            wp_send_json_error( [ 'code' => 'invalid_nonce' ], 403 );
        }

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( [ 'code' => 'permission_denied' ], 403 );
        }

        wp_send_json_success( [
            'accounts' => $this->repository->getAccounts(),
        ] );
    }
}
