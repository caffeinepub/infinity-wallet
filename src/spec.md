# Specification

## Summary
**Goal:** Add an authenticated Receive screen that shows the user’s ICP Ledger Account ID (derived from their Internet Identity Principal) with an easy copy-to-clipboard action.

**Planned changes:**
- Add a new authenticated “Receive” page/screen to the app.
- Implement a frontend utility to derive the ICP Ledger Account ID from the currently authenticated Principal (default subaccount) and display it on the Receive screen.
- Add a copy button on the Receive screen that copies the full Account ID and shows visible success feedback.
- Update authenticated navigation/routing to include “Receive” and wire the Dashboard “Quick Actions” > “Receive” button to navigate to it.
- Add brief, non-technical guidance explaining that exchanges typically require the ICP Account ID (not the Principal) for deposits.

**User-visible outcome:** Signed-in users can open a Receive screen from navigation or the Dashboard, view their ICP Account ID, copy it with a button, and read a short note explaining why this (not the Principal) is used for exchange deposits.
