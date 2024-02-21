
;; title: materials
;; version:
;; summary:
;; description:

(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-token-id-failure (err u101))
(define-constant err-not-token-owner (err u102))

(define-non-fungible-token materials uint)

(define-data-var token-id-nonce uint u0)

(define-read-only (get-last-token-id)
	(ok (var-get token-id-nonce))
)

(define-read-only (get-token-uri (token-id uint)) 
    (ok (some (concat (concat "http://localhost:5173/" (int-to-ascii token-id)) ".json")))
)

(define-read-only (get-owner (token-id uint)) 
    (ok (nft-get-owner? materials token-id))
)

(define-public (mint (recipient principal))
    (let ((token-id (+ (var-get token-id-nonce) u1)))
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (try! (nft-mint? materials token-id recipient))
        (asserts! (var-set token-id-nonce token-id) err-token-id-failure)
        (ok token-id)
    )
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
	(begin
        ;; #[filter(sender)]
		(asserts! (is-eq tx-sender sender) err-not-token-owner)
		(nft-transfer? materials token-id sender recipient)
	)
)