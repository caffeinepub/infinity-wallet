# Specification

## Summary
**Goal:** Add native Bitcoin, Ethereum, and Solana blockchain interoperability with unique receive addresses per user and dual sending modes (wrapped vs. native on-chain).

**Planned changes:**
- Generate unique BTC, ETH, and SOL receive addresses for each authenticated user using chain-key cryptography
- Display these addresses on the Receive page alongside the existing Principal address
- Add a transfer mode selector on the Send page to choose between "Wrapped (Fast & Cheap)" and "Native On-Chain" transfers for ckBTC, ckETH, and ckSOL
- Implement backend methods to convert and send ckBTC, ckETH, and ckSOL as native on-chain BTC, ETH, and SOL using chain-key integrations
- Update transaction history to distinguish between wrapped ICRC-1 transfers and native on-chain conversions

**User-visible outcome:** Users can receive native BTC, ETH, and SOL using unique addresses specific to their account, and choose to send ckBTC/ckETH/ckSOL either as fast wrapped tokens within IC or as native on-chain coins to external blockchain addresses.
