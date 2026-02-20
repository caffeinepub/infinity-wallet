import { Actor, HttpAgent } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { Identity } from '@dfinity/agent';
import { CKBTC_MINTER_CANISTER_ID } from './config';

// TypeScript types for ckBTC minter
export interface GetBtcAddressArgs {
  owner?: [] | [Principal];
  subaccount?: [] | [Uint8Array];
}

export interface UpdateBalanceArgs {
  owner?: [] | [Principal];
  subaccount?: [] | [Uint8Array];
}

export interface RetrieveBtcArgs {
  address: string;
  amount: bigint;
}

export interface RetrieveBtcWithApprovalArgs {
  address: string;
  amount: bigint;
  from_subaccount?: [] | [Uint8Array];
}

export interface RetrieveBtcStatusArgs {
  block_index: bigint;
}

export interface MinterInfo {
  retrieve_btc_min_amount: bigint;
  min_confirmations: number;
  kyt_fee: bigint;
}

export type RetrieveBtcStatus =
  | { Pending: null }
  | { Signing: null }
  | { Sending: { txid: Uint8Array } }
  | { Submitted: { txid: Uint8Array } }
  | { AmountTooLow: null }
  | { Confirmed: { txid: Uint8Array } };

export interface UtxoStatus {
  confirmations: number;
  value: bigint;
}

export interface CkBtcMinterClient {
  get_btc_address(args: GetBtcAddressArgs): Promise<string>;
  update_balance(args: UpdateBalanceArgs): Promise<Array<{ Ok?: bigint; Err?: any }>>;
  retrieve_btc(args: RetrieveBtcArgs): Promise<{ Ok?: bigint; Err?: any }>;
  retrieve_btc_with_approval(args: RetrieveBtcWithApprovalArgs): Promise<{ Ok?: bigint; Err?: any }>;
  retrieve_btc_status(args: RetrieveBtcStatusArgs): Promise<RetrieveBtcStatus>;
  get_minter_info(): Promise<MinterInfo>;
  get_withdrawal_account(): Promise<{ owner: Principal; subaccount?: [] | [Uint8Array] }>;
}

// IDL factory for ckBTC minter
const ckBtcMinterIdlFactory = () => {
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    owner: IDL.Principal,
    subaccount: IDL.Opt(Subaccount),
  });

  const GetBtcAddressArgs = IDL.Record({
    owner: IDL.Opt(IDL.Principal),
    subaccount: IDL.Opt(Subaccount),
  });

  const UpdateBalanceArgs = IDL.Record({
    owner: IDL.Opt(IDL.Principal),
    subaccount: IDL.Opt(Subaccount),
  });

  const UpdateBalanceError = IDL.Variant({
    GenericError: IDL.Record({ error_message: IDL.Text, error_code: IDL.Nat64 }),
    TemporarilyUnavailable: IDL.Text,
    AlreadyProcessing: IDL.Null,
    NoNewUtxos: IDL.Record({
      required_confirmations: IDL.Nat32,
      current_confirmations: IDL.Opt(IDL.Nat32),
    }),
  });

  const UtxoStatus = IDL.Variant({
    ValueTooSmall: IDL.Record({ min_value: IDL.Nat64 }),
    Tainted: IDL.Record({ address: IDL.Text }),
    Minted: IDL.Record({
      block_index: IDL.Nat64,
      minted_amount: IDL.Nat64,
      utxo: IDL.Record({
        height: IDL.Nat32,
        value: IDL.Nat64,
        outpoint: IDL.Record({ txid: IDL.Vec(IDL.Nat8), vout: IDL.Nat32 }),
      }),
    }),
    Checked: IDL.Record({ confirmations: IDL.Nat32, value: IDL.Nat64 }),
  });

  const RetrieveBtcArgs = IDL.Record({
    address: IDL.Text,
    amount: IDL.Nat64,
  });

  const RetrieveBtcWithApprovalArgs = IDL.Record({
    address: IDL.Text,
    amount: IDL.Nat64,
    from_subaccount: IDL.Opt(Subaccount),
  });

  const RetrieveBtcError = IDL.Variant({
    MalformedAddress: IDL.Text,
    AlreadyProcessing: IDL.Null,
    AmountTooLow: IDL.Nat64,
    InsufficientFunds: IDL.Record({ balance: IDL.Nat64 }),
    TemporarilyUnavailable: IDL.Text,
    GenericError: IDL.Record({ error_message: IDL.Text, error_code: IDL.Nat64 }),
  });

  const RetrieveBtcStatusArgs = IDL.Record({
    block_index: IDL.Nat64,
  });

  const RetrieveBtcStatus = IDL.Variant({
    Pending: IDL.Null,
    Signing: IDL.Null,
    Sending: IDL.Record({ txid: IDL.Vec(IDL.Nat8) }),
    Submitted: IDL.Record({ txid: IDL.Vec(IDL.Nat8) }),
    AmountTooLow: IDL.Null,
    Confirmed: IDL.Record({ txid: IDL.Vec(IDL.Nat8) }),
  });

  const MinterInfo = IDL.Record({
    retrieve_btc_min_amount: IDL.Nat64,
    min_confirmations: IDL.Nat32,
    kyt_fee: IDL.Nat64,
  });

  return IDL.Service({
    get_btc_address: IDL.Func([GetBtcAddressArgs], [IDL.Text], ['query']),
    update_balance: IDL.Func(
      [UpdateBalanceArgs],
      [IDL.Vec(IDL.Variant({ Ok: IDL.Nat64, Err: UpdateBalanceError }))],
      []
    ),
    retrieve_btc: IDL.Func([RetrieveBtcArgs], [IDL.Variant({ Ok: IDL.Nat64, Err: RetrieveBtcError })], []),
    retrieve_btc_with_approval: IDL.Func(
      [RetrieveBtcWithApprovalArgs],
      [IDL.Variant({ Ok: IDL.Nat64, Err: RetrieveBtcError })],
      []
    ),
    retrieve_btc_status: IDL.Func([RetrieveBtcStatusArgs], [RetrieveBtcStatus], ['query']),
    get_minter_info: IDL.Func([], [MinterInfo], ['query']),
    get_withdrawal_account: IDL.Func([], [Account], ['query']),
  });
};

export async function createCkBtcMinterClient(
  identity: Identity,
  host?: string
): Promise<CkBtcMinterClient> {
  console.log('[ckBTC Minter] Creating authenticated client...');
  console.log('[ckBTC Minter] Canister ID:', CKBTC_MINTER_CANISTER_ID);
  console.log('[ckBTC Minter] Identity principal:', identity.getPrincipal().toString());

  const agent = new HttpAgent({
    identity,
    host: host || 'https://ic0.app',
  });

  // Fetch root key for local development
  if (process.env.DFX_NETWORK !== 'ic') {
    console.log('[ckBTC Minter] Fetching root key for local development...');
    await agent.fetchRootKey().catch((err) => {
      console.warn('[ckBTC Minter] Unable to fetch root key:', err);
    });
  }

  const actor = Actor.createActor<CkBtcMinterClient>(ckBtcMinterIdlFactory, {
    agent,
    canisterId: CKBTC_MINTER_CANISTER_ID,
  });

  console.log('[ckBTC Minter] Client created successfully');

  return actor;
}

export function formatRetrieveBtcError(error: any): string {
  if ('MalformedAddress' in error) {
    return `Invalid Bitcoin address: ${error.MalformedAddress}`;
  }
  if ('AlreadyProcessing' in error) {
    return 'A withdrawal is already being processed. Please wait.';
  }
  if ('AmountTooLow' in error) {
    return `Amount too low. Minimum: ${error.AmountTooLow} satoshis`;
  }
  if ('InsufficientFunds' in error) {
    return `Insufficient funds. Balance: ${error.InsufficientFunds.balance} satoshis`;
  }
  if ('TemporarilyUnavailable' in error) {
    return `Service temporarily unavailable: ${error.TemporarilyUnavailable}`;
  }
  if ('GenericError' in error) {
    return `Error: ${error.GenericError.error_message}`;
  }
  return 'Unknown error occurred';
}
