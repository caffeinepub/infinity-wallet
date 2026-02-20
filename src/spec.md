# Specification

## Summary
**Goal:** Fix ckBTC minter canister integration errors to enable proper Bitcoin deposit address generation and status checking.

**Planned changes:**
- Update useCkBtcDepositAddress hook to use the correct ckBTC minter canister method name for fetching Bitcoin deposit addresses
- Fix useCkBtcDepositStatus hook to properly decode the deposit status response from the ckBTC minter canister
- Resolve agent configuration conflict warnings by ensuring only 'agent' or 'agentOptions' is passed to createActor functions, not both

**User-visible outcome:** Users can successfully generate Bitcoin deposit addresses and view their deposit status without errors in the Receive page.
