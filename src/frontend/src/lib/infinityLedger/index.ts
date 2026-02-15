/**
 * Infinity Coin ICRC-1 Ledger Integration
 * 
 * This module provides the main exports for interacting with the Infinity Coin ledger.
 */

export { INFINITY_COIN_LEDGER_CANISTER_ID } from './config';
export {
  createInfinityLedgerClient,
  getDefaultAccount,
  formatTransferError,
  type ICRC1Account,
  type ICRC1TransferArgs,
  type ICRC1TransferError,
  type ICRC1TransferResult,
  type ICRC1LedgerActor,
} from './client';
