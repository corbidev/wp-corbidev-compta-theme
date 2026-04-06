<?php
/**
 * Template public — Page Transactions.
 *
 * Affiche les transactions filtrées par compte, date de début et date de fin.
 * Le conteneur #corbidev-compta-modal-root est utilisé par React pour monter le modal d'import.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

use CorbiDev\Compta\Core\TransactionRepository;

$repository = new TransactionRepository();
$accounts   = $repository->getAccounts();

/** URL de base de la page courante (sans query string supplémentaire). */
$page_url = get_permalink();

// Lecture et assainissement des filtres depuis l'URL.
$selected_account = sanitize_text_field( $_GET['account_id'] ?? '' );
$date_start       = sanitize_text_field( $_GET['date_start'] ?? '' );
$date_end         = sanitize_text_field( $_GET['date_end']   ?? '' );

$filters = [
    'account_id' => $selected_account,
    'date_start' => $date_start,
    'date_end'   => $date_end,
    'limit'      => 200,
    'order'      => 'DESC',
];

$transactions = $repository->getTransactions( $filters );
$total        = $repository->countTransactions( $filters );
?>
<div class="corbidev-compta-wrap">

    <h1 class="corbidev-compta-title">
        <?php esc_html_e( 'Comptabilité — Transactions', CDCOMPTA_TEXT_DOMAIN ); ?>
    </h1>

    <a
        href="<?php echo esc_url( $page_url ); ?>"
        class="corbidev-compta-back-link"
    >
        <?php esc_html_e( '← Comptes', CDCOMPTA_TEXT_DOMAIN ); ?>
    </a>

    <?php /* Formulaire de filtres */ ?>
    <form method="get" action="<?php echo esc_url( $page_url ); ?>" class="corbidev-compta-filters">
        <input type="hidden" name="cdcompta_view" value="transactions" />

        <div class="corbidev-compta-filters-row">

            <div class="corbidev-compta-filter-group">
                <label for="account_id">
                    <?php esc_html_e( 'Compte', CDCOMPTA_TEXT_DOMAIN ); ?>
                </label>
                <select name="account_id" id="account_id" class="corbidev-compta-select">
                    <option value="">
                        <?php esc_html_e( 'Tous les comptes', CDCOMPTA_TEXT_DOMAIN ); ?>
                    </option>
                    <?php foreach ( $accounts as $account ) : ?>
                        <option
                            value="<?php echo esc_attr( $account['account_id'] ); ?>"
                            <?php selected( $selected_account, $account['account_id'] ); ?>
                        >
                            <?php echo esc_html( $account['account_id'] ); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="corbidev-compta-filter-group">
                <label for="date_start">
                    <?php esc_html_e( 'Du', CDCOMPTA_TEXT_DOMAIN ); ?>
                </label>
                <input
                    type="date"
                    name="date_start"
                    id="date_start"
                    value="<?php echo esc_attr( $date_start ); ?>"
                    class="corbidev-compta-date-input"
                />
            </div>

            <div class="corbidev-compta-filter-group">
                <label for="date_end">
                    <?php esc_html_e( 'Au', CDCOMPTA_TEXT_DOMAIN ); ?>
                </label>
                <input
                    type="date"
                    name="date_end"
                    id="date_end"
                    value="<?php echo esc_attr( $date_end ); ?>"
                    class="corbidev-compta-date-input"
                />
            </div>

            <div class="corbidev-compta-filter-actions">
                <button type="submit" class="corbidev-compta-btn corbidev-compta-btn-primary">
                    <?php esc_html_e( 'Filtrer', CDCOMPTA_TEXT_DOMAIN ); ?>
                </button>
                <a
                    href="<?php echo esc_url( add_query_arg( 'cdcompta_view', 'transactions', $page_url ) ); ?>"
                    class="corbidev-compta-btn corbidev-compta-btn-secondary"
                >
                    <?php esc_html_e( 'Réinitialiser', CDCOMPTA_TEXT_DOMAIN ); ?>
                </a>
            </div>

        </div>
    </form>

    <p class="corbidev-compta-count">
        <?php
        echo esc_html(
            sprintf(
                _n(
                    '%d transaction trouvée',
                    '%d transactions trouvées',
                    $total,
                    CDCOMPTA_TEXT_DOMAIN
                ),
                $total
            )
        );
        ?>
    </p>

    <?php if ( empty( $transactions ) ) : ?>

        <div class="corbidev-compta-empty">
            <p><?php esc_html_e( 'Aucune transaction trouvée pour ces critères.', CDCOMPTA_TEXT_DOMAIN ); ?></p>
        </div>

    <?php else : ?>

        <div class="corbidev-compta-table-wrapper">
            <table class="corbidev-compta-transactions-table">
                <thead>
                    <tr>
                        <th><?php esc_html_e( 'Date opération', CDCOMPTA_TEXT_DOMAIN ); ?></th>
                        <th><?php esc_html_e( 'Date valeur',    CDCOMPTA_TEXT_DOMAIN ); ?></th>
                        <th><?php esc_html_e( 'Type',           CDCOMPTA_TEXT_DOMAIN ); ?></th>
                        <th><?php esc_html_e( 'Libellé',        CDCOMPTA_TEXT_DOMAIN ); ?></th>
                        <th><?php esc_html_e( 'Description',    CDCOMPTA_TEXT_DOMAIN ); ?></th>
                        <th class="corbidev-compta-col-amount">
                            <?php esc_html_e( 'Montant', CDCOMPTA_TEXT_DOMAIN ); ?>
                        </th>
                        <th class="corbidev-compta-col-debit">
                            <?php esc_html_e( 'Débit',   CDCOMPTA_TEXT_DOMAIN ); ?>
                        </th>
                        <th class="corbidev-compta-col-credit">
                            <?php esc_html_e( 'Crédit',  CDCOMPTA_TEXT_DOMAIN ); ?>
                        </th>
                        <th><?php esc_html_e( 'Référence', CDCOMPTA_TEXT_DOMAIN ); ?></th>
                        <th><?php esc_html_e( 'Compte',    CDCOMPTA_TEXT_DOMAIN ); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ( $transactions as $tx ) :
                        $amount    = (float) $tx['amount'];
                        $is_debit  = $amount < 0;
                        $is_credit = $amount > 0;
                        $row_class = $is_debit
                            ? 'corbidev-compta-row-debit'
                            : ( $is_credit ? 'corbidev-compta-row-credit' : '' );
                    ?>
                        <tr class="<?php echo esc_attr( $row_class ); ?>">
                            <td><?php echo esc_html( $tx['dt_posted'] ); ?></td>
                            <td><?php echo esc_html( $tx['dt_avail'] ?? '—' ); ?></td>
                            <td><?php echo esc_html( $tx['trn_type'] ?? '—' ); ?></td>
                            <td class="corbidev-compta-name">
                                <?php echo esc_html( $tx['name'] ?? '—' ); ?>
                            </td>
                            <td class="corbidev-compta-memo">
                                <?php echo esc_html( $tx['memo'] ?? '—' ); ?>
                            </td>
                            <td class="corbidev-compta-col-amount <?php echo $is_debit ? 'corbidev-compta-negative' : ( $is_credit ? 'corbidev-compta-positive' : '' ); ?>">
                                <?php echo esc_html( number_format( $amount, 2, ',', ' ' ) . ' €' ); ?>
                            </td>
                            <td class="corbidev-compta-col-debit corbidev-compta-negative">
                                <?php echo $is_debit
                                    ? esc_html( number_format( abs( $amount ), 2, ',', ' ' ) . ' €' )
                                    : ''; ?>
                            </td>
                            <td class="corbidev-compta-col-credit corbidev-compta-positive">
                                <?php echo $is_credit
                                    ? esc_html( number_format( $amount, 2, ',', ' ' ) . ' €' )
                                    : ''; ?>
                            </td>
                            <td class="corbidev-compta-fitid">
                                <?php echo esc_html( $tx['fitid'] ); ?>
                            </td>
                            <td><?php echo esc_html( $tx['account_id'] ); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>

    <?php endif; ?>

    <?php /* Point de montage React pour le modal d'import */ ?>
    <div id="corbidev-compta-modal-root"></div>

</div>
