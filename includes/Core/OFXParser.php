<?php
/**
 * Parseur de fichiers OFX (format SGML).
 *
 * Le format OFX/SGML n'est pas du XML valide : les éléments feuilles
 * n'ont pas de balise fermante. Ce parseur traite le contenu de façon
 * textuelle via des expressions régulières.
 *
 * Ne dépend d'aucune fonction WordPress.
 */

declare( strict_types=1 );

namespace CorbiDev\Compta\Core;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

class OFXParser
{
    /**
     * Parse le contenu brut d'un fichier OFX.
     *
     * @param  string $content Contenu brut du fichier.
     * @return array{
     *   account: array{bank_id: string|null, branch_id: string|null, account_id: string|null, acct_type: string|null, currency: string},
     *   transactions: array<int, array{trn_type: string|null, dt_posted: string|null, dt_avail: string|null, amount: float, fitid: string|null, name: string|null, memo: string|null}>,
     *   balance: array{amount: float|null, date: string|null}
     * }
     *
     * @throws \RuntimeException Codes : ofx_tag_not_found
     */
    public static function parse( string $content ): array
    {
        $content = self::normalizeLineEndings( $content );
        $body    = self::extractBody( $content );

        return [
            'account'      => self::parseAccount( $body ),
            'transactions' => self::parseTransactions( $body ),
            'balance'      => self::parseBalance( $body ),
        ];
    }

    // -------------------------------------------------------------------------
    // Méthodes privées
    // -------------------------------------------------------------------------

    /**
     * Normalise les fins de ligne en LF.
     */
    private static function normalizeLineEndings( string $content ): string
    {
        return str_replace( [ "\r\n", "\r" ], "\n", $content );
    }

    /**
     * Extrait le corps SGML à partir de la balise <OFX>.
     *
     * @throws \RuntimeException ofx_tag_not_found
     */
    private static function extractBody( string $content ): string
    {
        $pos = strpos( $content, '<OFX>' );

        if ( $pos === false ) {
            throw new \RuntimeException( 'ofx_tag_not_found' );
        }

        return substr( $content, $pos );
    }

    /**
     * Extrait la valeur d'un tag SGML feuille (sans balise fermante).
     * Ex : <ACCTID>00842487838  →  "00842487838"
     */
    private static function extractTag( string $content, string $tag ): ?string
    {
        $pattern = '/<' . preg_quote( $tag, '/' ) . '>\s*([^\r\n<]+)/';

        if ( preg_match( $pattern, $content, $matches ) ) {
            return trim( $matches[1] );
        }

        return null;
    }

    /**
     * Parse les informations du compte bancaire.
     *
     * @return array{bank_id: string|null, branch_id: string|null, account_id: string|null, acct_type: string|null, currency: string}
     */
    private static function parseAccount( string $body ): array
    {
        return [
            'bank_id'    => self::extractTag( $body, 'BANKID' ),
            'branch_id'  => self::extractTag( $body, 'BRANCHID' ),
            'account_id' => self::extractTag( $body, 'ACCTID' ),
            'acct_type'  => self::extractTag( $body, 'ACCTTYPE' ),
            'currency'   => self::extractTag( $body, 'CURDEF' ) ?? 'EUR',
        ];
    }

    /**
     * Parse le solde du compte.
     *
     * @return array{amount: float|null, date: string|null}
     */
    private static function parseBalance( string $body ): array
    {
        $raw_amount = self::extractTag( $body, 'BALAMT' );
        $raw_date   = self::extractTag( $body, 'DTASOF' );

        return [
            'amount' => $raw_amount !== null ? (float) $raw_amount : null,
            'date'   => $raw_date   !== null ? self::parseDate( $raw_date ) : null,
        ];
    }

    /**
     * Parse toutes les transactions OFX du document.
     *
     * @return array<int, array{trn_type: string|null, dt_posted: string|null, dt_avail: string|null, amount: float, fitid: string|null, name: string|null, memo: string|null}>
     */
    private static function parseTransactions( string $body ): array
    {
        $transactions = [];

        preg_match_all( '/<STMTTRN>(.*?)<\/STMTTRN>/si', $body, $matches );

        foreach ( $matches[1] as $block ) {
            $transactions[] = self::parseTransaction( $block );
        }

        return $transactions;
    }

    /**
     * Parse un bloc <STMTTRN>...</STMTTRN>.
     *
     * @return array{trn_type: string|null, dt_posted: string|null, dt_avail: string|null, amount: float, fitid: string|null, name: string|null, memo: string|null}
     */
    private static function parseTransaction( string $block ): array
    {
        $raw_posted = self::extractTag( $block, 'DTPOSTED' );
        $raw_avail  = self::extractTag( $block, 'DTAVAIL' );
        $raw_amount = self::extractTag( $block, 'TRNAMT' );

        return [
            'trn_type'  => self::extractTag( $block, 'TRNTYPE' ),
            'dt_posted' => $raw_posted !== null ? self::parseDate( $raw_posted ) : null,
            'dt_avail'  => $raw_avail  !== null ? self::parseDate( $raw_avail )  : null,
            'amount'    => $raw_amount !== null ? (float) $raw_amount             : 0.0,
            'fitid'     => self::extractTag( $block, 'FITID' ),
            'name'      => self::extractTag( $block, 'NAME' ),
            'memo'      => self::extractTag( $block, 'MEMO' ),
        ];
    }

    /**
     * Convertit une date OFX (YYYYMMDD ou YYYYMMDDHHMMSS) en format Y-m-d.
     */
    private static function parseDate( string $raw ): string
    {
        $clean = substr( trim( $raw ), 0, 8 );

        return sprintf(
            '%s-%s-%s',
            substr( $clean, 0, 4 ),
            substr( $clean, 4, 2 ),
            substr( $clean, 6, 2 )
        );
    }
}
