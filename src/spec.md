# Specification

## Summary
**Goal:** Restore the application to the most recent known-good version that successfully deployed, removing the changes that caused the current deployment failure.

**Planned changes:**
- Revert frontend and backend code to the last known working deployment state, ensuring no remaining changes from the failed deployment attempt.
- Confirm the reverted codebase builds and deploys successfully.
- Perform a smoke test of the primary wallet journeys: connect wallet, load Dashboard, and navigate to Send, Receive, Contacts, History, and Contracts to verify no runtime errors.

**User-visible outcome:** The deployed app loads successfully and the authenticated Oisy Wallet flow renders without errors, with core pages accessible and interactive.
