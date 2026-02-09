# Infinity Wallet - Smoke Test Checklist

This document provides a repeatable smoke-test checklist to validate primary user journeys after deployment.

## Prerequisites
- Application deployed and accessible
- Browser console open (F12) to monitor for errors
- Test environment ready

## Test Scenarios

### 1. Connection Flow
**Objective:** Verify wallet connection works without crashes

- [ ] Load the application
- [ ] Verify the welcome screen displays correctly
- [ ] Click "Connect Oisy Wallet" button
- [ ] Wait for connection to complete (mock implementation simulates 1s delay)
- [ ] Verify no uncaught exceptions in console
- [ ] Verify navigation bar appears after connection
- [ ] **Expected:** User is connected and sees the Dashboard

**Unavailable State (Optional):**
- [ ] If Oisy unavailable state is triggered, verify error message displays
- [ ] Verify "Try Again" and "Visit Oisy Wallet" buttons are present
- [ ] Verify no crashes occur

---

### 2. Profile Setup
**Objective:** Verify first-time profile setup flow

- [ ] On first connection, profile setup dialog should appear
- [ ] Enter a name in the input field
- [ ] Click "Continue" button
- [ ] Verify profile saves successfully (toast notification)
- [ ] Verify dialog closes after save
- [ ] Verify no uncaught exceptions in console
- [ ] **Expected:** Profile is saved and user proceeds to Dashboard

---

### 3. Dashboard Render
**Objective:** Verify Dashboard page loads and displays correctly

- [ ] After connection, verify Dashboard is the default page
- [ ] Verify Infinity Coin balance displays (may be 0.00)
- [ ] Verify Quick Actions buttons are visible (Receive, History)
- [ ] Click Quick Actions buttons to verify navigation
- [ ] Verify no uncaught exceptions in console
- [ ] **Expected:** Dashboard renders without errors

---

### 4. Navigation Between Pages
**Objective:** Verify all navigation links work

- [ ] Click "Dashboard" in navigation bar
- [ ] Click "Receive" in navigation bar
- [ ] Click "Send" in navigation bar
- [ ] Click "Contacts" in navigation bar
- [ ] Click "History" in navigation bar
- [ ] Click "Contracts" in navigation bar
- [ ] Verify each page renders without blank screens
- [ ] Verify no uncaught exceptions in console
- [ ] **Expected:** All pages are accessible and render correctly

---

### 5. Send Form
**Objective:** Verify Send page renders and form is interactable

- [ ] Navigate to Send page
- [ ] Verify form displays with Recipient and Amount fields
- [ ] Enter a test recipient address (e.g., `aaaaa-aa`)
- [ ] Enter a test amount (e.g., `1.5`)
- [ ] Click "Review Transaction" button
- [ ] Verify confirmation screen appears
- [ ] Click "Confirm & Send" button
- [ ] Verify success message displays
- [ ] Verify no uncaught exceptions in console
- [ ] **Expected:** Send flow completes without errors

---

### 6. Receive Copy-to-Clipboard
**Objective:** Verify Receive page displays address and copy works

- [ ] Navigate to Receive page
- [ ] Verify principal address displays
- [ ] Click "Copy Address" button
- [ ] Verify toast notification confirms copy
- [ ] Verify no uncaught exceptions in console
- [ ] **Expected:** Address is displayed and copyable

---

### 7. Contacts CRUD UI
**Objective:** Verify Contacts page CRUD operations are interactable

**Add Contact:**
- [ ] Navigate to Contacts page
- [ ] Click "Add Contact" button
- [ ] Enter name and address in dialog
- [ ] Click "Save Contact" button
- [ ] Verify contact appears in list
- [ ] Verify no uncaught exceptions in console

**Edit Contact:**
- [ ] Click edit icon on a contact card
- [ ] Modify name or address
- [ ] Click "Save Changes" button
- [ ] Verify contact updates in list
- [ ] Verify no uncaught exceptions in console

**Delete Contact:**
- [ ] Click delete icon on a contact card
- [ ] Confirm deletion in alert dialog
- [ ] Verify contact is removed from list
- [ ] Verify no uncaught exceptions in console

- [ ] **Expected:** All CRUD operations work without errors

---

### 8. History List Refresh
**Objective:** Verify History page displays transactions

- [ ] Navigate to History page
- [ ] Verify transaction list displays (may be empty initially)
- [ ] If transactions exist, verify they display with correct details
- [ ] Verify no uncaught exceptions in console
- [ ] **Expected:** History page renders transaction list

---

### 9. Contracts Form Interactions
**Objective:** Verify Contracts page form is interactable

- [ ] Navigate to Contracts page
- [ ] Verify form displays with Canister ID, Method, and Arguments fields
- [ ] Enter test values (e.g., Canister ID: `rrkah-fqaaa-aaaaa-aaaaq-cai`, Method: `greet`, Arguments: `{"name": "World"}`)
- [ ] Click "Execute Contract Call" button
- [ ] Verify simulated execution completes
- [ ] Verify success/error feedback displays
- [ ] Verify no uncaught exceptions in console
- [ ] **Expected:** Contracts form is functional and provides feedback

---

### 10. Disconnect Flow
**Objective:** Verify disconnect clears state properly

- [ ] Click "Disconnect Oisy" button in header
- [ ] Verify user is logged out
- [ ] Verify navigation bar disappears
- [ ] Verify welcome screen displays again
- [ ] Verify no uncaught exceptions in console
- [ ] **Expected:** Clean disconnect with state cleared

---

## Console Error Check
Throughout all tests, monitor the browser console for:
- [ ] No uncaught exceptions
- [ ] No unhandled promise rejections
- [ ] No critical errors (warnings are acceptable)

---

## Test Completion
- [ ] All scenarios passed
- [ ] No critical console errors observed
- [ ] Application is stable and ready for use

**Tester Name:** _______________  
**Date:** _______________  
**Result:** ☐ PASS  ☐ FAIL  
**Notes:** _______________________________________________
