# Specification

## Summary
**Goal:** Fix ICRC-1 balance query errors by correctly serializing the subaccount field in account objects.

**Planned changes:**
- Update account object construction in useInfinityCoinBalance.ts to include subaccount field as optional array type ([] or [Uint8Array])
- Fix Account type definition in InfinityLedgerClient to match ICRC-1 specification with owner (Principal) and subaccount (opt blob)
- Ensure all ICRC-1 account objects use the format { owner: Principal, subaccount: [] } for default subaccount queries

**User-visible outcome:** The dashboard successfully displays the Infinity Coin balance without "Record is missing key 'subaccount'" errors.
