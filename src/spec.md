# Specification

## Summary
**Goal:** Add multi-token support for ICP, ckBTC, ckETH, and ckSOL with balance viewing, transfers, and transaction history.

**Planned changes:**
- Create ICRC-1 ledger clients for ICP, ckBTC, ckETH, and ckSOL tokens
- Add React Query hooks for fetching balances of all new tokens
- Display Total Assets section on Dashboard with dropdown to select denomination currency (ckUSDT, ICP, ckBTC, ckETH, or ckSOL)
- Show all token balances simultaneously on Dashboard as balance cards with individual refresh buttons
- Update SendPage with token selector dropdown to support sending any of the five tokens
- Update ReceivePage to display receiving addresses for all tokens with explanation of unified ICRC-1 addressing
- Update transaction history backend and HistoryPage to record and display transactions for all token types

**User-visible outcome:** Users can view balances for Infinity Coin, ICP, ckBTC, ckETH, and ckSOL all at once on the Dashboard with a combined portfolio value in their chosen denomination, send any of these tokens through the Send page, receive all tokens at the same address, and view transaction history filtered by token type.
