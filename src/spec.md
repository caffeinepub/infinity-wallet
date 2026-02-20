# Specification

## Summary
**Goal:** Fix ckBTC wallet address generation by resolving Principal serialization issues in the deposit address and deposit status hooks.

**Planned changes:**
- Fix Principal serialization in useCkBtcDepositAddress hook to send proper Candid Principal type instead of JSON object when calling ckBTC minter's get_btc_address method
- Fix Principal serialization in useCkBtcDepositStatus hook to send proper Candid Principal type instead of JSON object when calling ckBTC minter's update_balance method

**User-visible outcome:** Users can successfully generate Bitcoin deposit addresses on the Receive page and view pending Bitcoin deposit status without errors.
