# Specification

## Summary
**Goal:** Add USD value display for all tokens and total portfolio using real-time exchange rates from ICPSwap oracle.

**Planned changes:**
- Create backend service to fetch real-time exchange rates from ICPSwap oracle for ICP, ckBTC, ckETH, ckSOL, and Infinity Coin
- Update TotalAssetsDisplay component to calculate and show total portfolio value in USD
- Add USD value display for each individual token balance on the dashboard
- Remove the "Exchange rate conversion not yet implemented" disclaimer from the UI

**User-visible outcome:** Users will see their token balances and total portfolio value converted to USD in real-time using ICPSwap oracle exchange rates.
