# Specification

## Summary
**Goal:** Display USD values with extended decimal precision to show non-zero amounts for very small token balances, and fix the ckBTC deposit status decoding error.

**Planned changes:**
- Modify TotalAssetsDisplay component to format USD values with 8-12 decimal places instead of 2
- Apply the same extended decimal formatting to individual token USD values in BalanceCard component
- Fix the "Not a vector type" decoding error in useCkBtcDepositStatus hook

**User-visible outcome:** Users will see meaningful USD values (with many decimal places) for their small token holdings instead of $0.00, and the ckBTC deposit status will display correctly without console errors.
