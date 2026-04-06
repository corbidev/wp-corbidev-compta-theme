<?php
/**
 * Template admin — Page Comptes.
 *
 * Affiche la liste des comptes importés et le bouton d'import.
 * Le conteneur #corbidev-compta-modal-root est utilisé par React pour monter le modal d'import.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use CorbiDev\Compta\Core\TransactionRepository;

$repository = new TransactionRepository();
$accounts   = $repository->getAccounts();
?>
<div class="wrap corbidev-compta-admin-wrap">

    <h1 class="corbidev-compta-admin-title wp-heading-inline">
        <?php esc_html_e( 'Comptabilité — Comptes', CDCOMPTA_TEXT_DOMAIN ); ?>
    </h1>

    <div class="corbidev-compta-admin-toolbar">
        <button
            type="button"
            id="corbidev-compta-import-btn"
            class="button button-primary corbidev-compta-admin-import-btn"
        >
            <?php esc_html_e( 'Importer un fichier OFX', CDCOMPTA_TEXT_DOMAIN ); ?>
        </button>
    </div>

    <hr class="wp-header-end" />

    <?php if ( empty( $accounts ) ) : ?>

        <div class="corbidev-compta-admin-empty">
            <p><?php esc_html_e( 'Aucun compte importé. Cliquez sur « Importer un fichier OFX » pour commencer.', CDCOMPTA_TEXT_DOMAIN ); ?></p>
        </div>

    <?php else : ?>

        <table class="widefat fixed corbidev-compta-admin-accounts-table">
            <thead>
                <tr>
                    <th><?php esc_html_e( 'N° de compte',        CDCOMPTA_TEXT_DOMAIN ); ?></th>
                    <th><?php esc_html_e( 'Banque',              CDCOMPTA_TEXT_DOMAIN ); ?></th>
                    <th><?php esc_html_e( 'Agence',              CDCOMPTA_TEXT_DOMAIN ); ?></th>
                    <th><?php esc_html_e( 'Devise',              CDCOMPTA_TEXT_DOMAIN ); ?></th>
                    <th><?php esc_html_e( 'Transactions',        CDCOMPTA_TEXT_DOMAIN ); ?></th>
                    <th><?php esc_html_e( 'Première opération',  CDCOMPTA_TEXT_DOMAIN ); ?></th>
                    <th><?php esc_html_e( 'Dernière opération',  CDCOMPTA_TEXT_DOMAIN ); ?></th>
                    <th><?php esc_html_e( 'Dernier import',      CDCOMPTA_TEXT_DOMAIN ); ?></th>
                    <th><?php esc_html_e( 'Actions',             CDCOMPTA_TEXT_DOMAIN ); ?></th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ( $accounts as $account ) : ?>
                    <tr>
                        <td class="corbidev-compta-admin-account-id">
                            <strong><?php echo esc_html( $account['account_id'] ); ?></strong>
                        </td>
                        <td><?php echo esc_html( $account['bank_id']   ?? '—' ); ?></td>
                        <td><?php echo esc_html( $account['branch_id'] ?? '—' ); ?></td>
                        <td><?php echo esc_html( $account['currency'] ); ?></td>
                        <td><?php echo esc_html( $account['transaction_count'] ); ?></td>
                        <td><?php echo esc_html( $account['date_start'] ?? '—' ); ?></td>
                        <td><?php echo esc_html( $account['date_end']   ?? '—' ); ?></td>
                        <td><?php echo esc_html( $account['last_import'] ?? '—' ); ?></td>
                        <td>
                            <a
                                href="<?php echo esc_url( add_query_arg( [
                                    'page'       => 'corbidev-compta-transactions',
                                    'account_id' => $account['account_id'],
                                ], admin_url( 'admin.php' ) ) ); ?>"
                                class="button button-secondary"
                            >
                                <?php esc_html_e( 'Voir les transactions', CDCOMPTA_TEXT_DOMAIN ); ?>
                            </a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

    <?php endif; ?>

    <?php /* Point de montage React pour le modal d'import */ ?>
    <div id="corbidev-compta-modal-root"></div>

</div>
