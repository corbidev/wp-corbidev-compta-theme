<?php
/**
 * Template public — Page Comptes.
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

/** URL de base de la page courante (sans query string). */
$page_url = get_permalink();
?>
<div class="corbidev-compta-wrap">

    <h1 class="corbidev-compta-title">
        <?php esc_html_e( 'Comptabilité — Comptes', CDCOMPTA_TEXT_DOMAIN ); ?>
    </h1>
<h2>page-account</h2>
    <div class="corbidev-compta-toolbar">
        <button
            type="button"
            id="corbidev-compta-import-btn"
            class="corbidev-compta-btn corbidev-compta-btn-primary corbidev-compta-import-btn"
        >
            <?php esc_html_e( 'Importer un fichier OFX', CDCOMPTA_TEXT_DOMAIN ); ?>
        </button>
    </div>

    <?php if ( empty( $accounts ) ) : ?>

        <div class="corbidev-compta-empty">
            <p><?php esc_html_e( 'Aucun compte importé. Cliquez sur « Importer un fichier OFX » pour commencer.', CDCOMPTA_TEXT_DOMAIN ); ?></p>
        </div>

    <?php else : ?>

        <table class="corbidev-compta-accounts-table">
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
                        <td class="corbidev-compta-account-id">
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
                                    'cdcompta_view' => 'transactions',
                                    'account_id'    => $account['account_id'],
                                ], $page_url ) ); ?>"
                                class="corbidev-compta-btn corbidev-compta-btn-secondary"
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
