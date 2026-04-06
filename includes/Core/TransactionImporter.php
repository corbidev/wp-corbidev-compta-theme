<?php
/**
 * Service d'import OFX : parse le fichier et insère les transactions.
 *
 * Ne dépend d'aucune fonction WordPress.
 * Retourne uniquement des structures de données neutres.
 */

declare( strict_types=1 );

namespace CorbiDev\Compta\Core;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class TransactionImporter
{
    public function __construct(
        private readonly TransactionRepository $repository
    ) {}

    /**
     * Importe les transactions depuis le contenu brut d'un fichier OFX.
     *
     * @param  string $content Contenu brut du fichier OFX.
     * @return array{
     *   account_id: string|null,
     *   total: int,
     *   imported: int,
     *   duplicates: int,
     *   date_start: string|null,
     *   date_end: string|null,
     *   balance: array{amount: float|null, date: string|null},
     *   errors: array<int, string>
     * }
     *
     * @throws \RuntimeException Codes : ofx_tag_not_found
     */
    public function import( string $content ): array
    {
        $parsed       = OFXParser::parse( $content );
        $account      = $parsed['account'];
        $transactions = $parsed['transactions'];

        $total      = count( $transactions );
        $imported   = 0;
        $duplicates = 0;
        $errors     = [];
        $dates      = [];

        foreach ( $transactions as $transaction ) {
            // Les champs fitid et dt_posted sont obligatoires.
            if ( $transaction['fitid'] === null || $transaction['dt_posted'] === null ) {
                $errors[] = 'missing_required_field';
                continue;
            }

            $dates[] = $transaction['dt_posted'];

            $result = $this->repository->insertTransaction( [
                'account_id' => $account['account_id'],
                'bank_id'    => $account['bank_id'],
                'branch_id'  => $account['branch_id'],
                'currency'   => $account['currency'],
                'fitid'      => $transaction['fitid'],
                'trn_type'   => $transaction['trn_type'],
                'dt_posted'  => $transaction['dt_posted'],
                'dt_avail'   => $transaction['dt_avail'],
                'amount'     => $transaction['amount'],
                'name'       => $transaction['name'],
                'memo'       => $transaction['memo'],
            ] );

            match ( $result ) {
                'inserted'  => $imported++,
                'duplicate' => $duplicates++,
                default     => $errors[] = $result,
            };
        }

        return [
            'account_id' => $account['account_id'],
            'total'      => $total,
            'imported'   => $imported,
            'duplicates' => $duplicates,
            'date_start' => ! empty( $dates ) ? min( $dates ) : null,
            'date_end'   => ! empty( $dates ) ? max( $dates ) : null,
            'balance'    => $parsed['balance'],
            'errors'     => $errors,
        ];
    }
}
