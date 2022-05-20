# Run local

## 1

    solana-test-validator -r	(-r reset)

## 2

    solana aidrop 10 Publickey
    (File sc_luxury_brand/Anchor.toml)
    wallet = "~/.config/solana/id.json"

## 3

    Connect wallet and airdrop for account in Local net
    solana aidrop 10 Publickey	(Publickey from extension chrome)

# Note: Metaplex just work on devnet, need to change in Anchor.toml

1. [programs.devnet]

2. cluster = "devnet"

# Error

1. RangeError: encoding overruns Buffer (over limit byte in contract)
