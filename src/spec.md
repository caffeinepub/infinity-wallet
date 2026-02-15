# Specification

## Summary
**Goal:** Integrate the live Infinity Coin ICRC-1 ledger canister (`atuk3-uqaaa-aaaam-qduwa-cai`) so the wallet shows real on-chain balances and performs real on-chain transfers using the signed-in Internet Identity.

**Planned changes:**
- Add a single, clearly named frontend config/constant for the Infinity Coin ledger canister ID set to `atuk3-uqaaa-aaaam-qduwa-cai`, and ensure all Infinity Coin ledger calls use only this ID.
- Implement an authenticated ICRC-1 ledger client in the frontend that uses the current Internet Identity to call `icrc1_balance_of` and `icrc1_transfer`, with a clear signed-out gating/error state.
- Update the Dashboard balance flow (React Query hooks + UI) to fetch Infinity Coin balances from `icrc1_balance_of` on the live ledger instead of backend-recorded balances, including refetch on refresh.
- Update the Send confirmation flow to execute a real transfer via `icrc1_transfer`, show success only after the ledger call succeeds, display the returned ledger transfer identifier, and refetch balance after success.
- After a successful ledger transfer, record the transaction to the backend for the app’s local History view; if history recording fails, keep the transfer as successful and show a non-blocking warning.
- Update the Receive screen to display the authenticated user’s Principal as the ICRC-1 account owner and indicate the default (all-zeros / not set) subaccount, with copy-to-clipboard actions.
- Remove/update any Send UI copy implying Infinity Coin transfers are demo/local-only so it accurately reflects live-ledger sends (English copy).

**User-visible outcome:** Signed-in users can view their real Infinity Coin balance from the live ledger, send Infinity Coin via on-ledger transfers with real transfer identifiers, see updated balances after sends, view their correct receive details (Principal + default subaccount) with copy buttons, and still see locally recorded transaction history entries after successful sends.
