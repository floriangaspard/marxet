
;; title: sip010-token
;; version:
;; summary:
;; description:

(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

(define-fungible-token kral)

(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

(define-constant contract-owner tx-sender)
(define-constant token-uri u"https://hiro.so") 
(define-constant token-name "Clarity Coin")
(define-constant token-symbol "CC")
(define-constant token-decimals u6) 


(define-read-only (get-balance (who principal))
  (ok (ft-get-balance kral who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply kral))
)

(define-read-only (get-name)
  (ok token-name)
)

(define-read-only (get-symbol)
  (ok token-symbol)
)

(define-read-only (get-decimals)
  (ok token-decimals)
)

(define-read-only (get-token-uri)
  (ok (some token-uri))
)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? kral amount recipient)
  )
)

(define-public (transfer
  (amount uint)
  (sender principal)
  (recipient principal)
  (memo (optional (buff 34)))
)
  (begin
    ;; #[filter(amount, recipient)]
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (try! (ft-transfer? kral amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)