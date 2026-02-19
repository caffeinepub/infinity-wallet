import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import type { Identity } from '@dfinity/agent';
import { CKBTC_LEDGER_CANISTER_ID } from './config';

/**
 * ICRC-1 Account type
 */
export interface ICRC1Account {
  owner: Principal;
  subaccount: [] | [Uint8Array];
}

/**
 * ICRC-1 Transfer Arguments
 */
export interface ICRC1TransferArgs {
  from_subaccount?: [] | [Uint8Array];
  to: ICRC1Account;
  amount: bigint;
  fee?: bigint;
  memo?: Uint8Array;
  created_at_time?: bigint;
}

/**
 * ICRC-1 Transfer Error
 */
export type ICRC1TransferError =
  | { BadFee: { expected_fee: bigint } }
  | { BadBurn: { min_burn_amount: bigint } }
  | { InsufficientFunds: { balance: bigint } }
  | { TooOld: null }
  | { CreatedInFuture: { ledger_time: bigint } }
  | { Duplicate: { duplicate_of: bigint } }
  | { TemporarilyUnavailable: null }
  | { GenericError: { error_code: bigint; message: string } };

/**
 * ICRC-1 Transfer Result
 */
export type ICRC1TransferResult =
  | { Ok: bigint }
  | { Err: ICRC1TransferError };

/**
 * ICRC-1 Ledger Actor Interface
 */
export interface ICRC1LedgerActor {
  icrc1_balance_of: (account: ICRC1Account) => Promise<bigint>;
  icrc1_transfer: (args: ICRC1TransferArgs) => Promise<ICRC1TransferResult>;
  icrc1_fee: () => Promise<bigint>;
  icrc1_decimals: () => Promise<number>;
  icrc1_name: () => Promise<string>;
  icrc1_symbol: () => Promise<string>;
}

/**
 * IDL Factory for ICRC-1 Ledger
 */
const idlFactory = ({ IDL }: any) => {
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
  });

  const TransferArg = IDL.Record({
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    to: Account,
    amount: IDL.Nat,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
  });

  const TransferError = IDL.Variant({
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
    TooOld: IDL.Null,
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    TemporarilyUnavailable: IDL.Null,
    GenericError: IDL.Record({
      error_code: IDL.Nat,
      message: IDL.Text,
    }),
  });

  const TransferResult = IDL.Variant({
    Ok: IDL.Nat,
    Err: TransferError,
  });

  return IDL.Service({
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ['query']),
    icrc1_transfer: IDL.Func([TransferArg], [TransferResult], []),
    icrc1_fee: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ['query']),
    icrc1_name: IDL.Func([], [IDL.Text], ['query']),
    icrc1_symbol: IDL.Func([], [IDL.Text], ['query']),
  });
};

/**
 * Create an authenticated ICRC-1 ckBTC Ledger client with comprehensive debugging
 */
export async function createCkBtcLedgerClient(
  identity: Identity,
  host?: string
): Promise<ICRC1LedgerActor> {
  const timestamp = new Date().toISOString();
  console.group(`🏗️ [${timestamp}] Creating ckBTC Ledger Client`);

  try {
    console.log('📋 Identity Information:', {
      identityType: identity.constructor.name,
      isDefined: !!identity,
      hasPrincipal: typeof identity.getPrincipal === 'function',
    });

    console.log('🎯 Canister Configuration:', {
      canisterId: CKBTC_LEDGER_CANISTER_ID,
      canisterIdLength: CKBTC_LEDGER_CANISTER_ID.length,
      host: host || window.location.origin,
      network: process.env.DFX_NETWORK || 'local',
    });

    const agent = new HttpAgent({
      identity,
      host: host || window.location.origin,
    });

    if (process.env.DFX_NETWORK !== 'ic') {
      console.log('🔑 Fetching root key for local development...');
      await agent.fetchRootKey().catch((err) => {
        console.warn('⚠️ Unable to fetch root key. Check to ensure that your local replica is running');
        console.error(err);
      });
    }

    console.log('🎭 Creating actor with IDL...');
    const actor = Actor.createActor<ICRC1LedgerActor>(idlFactory, {
      agent,
      canisterId: CKBTC_LEDGER_CANISTER_ID,
    });

    console.log('✅ Actor created successfully');
    console.groupEnd();
    return actor;
  } catch (error: any) {
    console.error('❌ Actor creation failed:', {
      errorMessage: error?.message || 'Unknown error',
      errorName: error?.name,
      errorStack: error?.stack,
      fullError: error,
    });
    console.groupEnd();
    throw error;
  }
}

/**
 * Get default ICRC-1 account for a principal
 */
export function getDefaultAccount(owner: Principal): ICRC1Account {
  return {
    owner,
    subaccount: [],
  };
}

/**
 * Format ICRC-1 transfer error for display
 */
export function formatTransferError(error: ICRC1TransferError): string {
  if ('BadFee' in error) {
    return `Incorrect fee. Expected: ${error.BadFee.expected_fee}`;
  }
  if ('BadBurn' in error) {
    return `Burn amount too small. Minimum: ${error.BadBurn.min_burn_amount}`;
  }
  if ('InsufficientFunds' in error) {
    return `Insufficient funds. Balance: ${error.InsufficientFunds.balance}`;
  }
  if ('TooOld' in error) {
    return 'Transaction is too old';
  }
  if ('CreatedInFuture' in error) {
    return 'Transaction timestamp is in the future';
  }
  if ('Duplicate' in error) {
    return `Duplicate transaction. Original block: ${error.Duplicate.duplicate_of}`;
  }
  if ('TemporarilyUnavailable' in error) {
    return 'Ledger temporarily unavailable. Please try again';
  }
  if ('GenericError' in error) {
    return `Error ${error.GenericError.error_code}: ${error.GenericError.message}`;
  }
  return 'Unknown error occurred';
}
