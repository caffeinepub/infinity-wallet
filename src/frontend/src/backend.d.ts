import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface Contact {
    id: bigint;
    owner: Principal;
    name: string;
    address: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface TransactionHistoryItem {
    id: bigint;
    recipient: string;
    amountE8: bigint;
    sender: Principal;
    blockHeight?: bigint;
    timestamp: Time;
    coinType: CoinType;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum CoinType {
    icp = "icp",
    ckBtc = "ckBtc",
    ckEth = "ckEth",
    ckSol = "ckSol",
    infinityCoin = "infinityCoin"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteContact(contactId: bigint): Promise<void>;
    getBalances(): Promise<[bigint, bigint, bigint, bigint, bigint]>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContacts(): Promise<Array<Contact>>;
    getCurrentRates(): Promise<string>;
    getTransactionHistory(): Promise<Array<TransactionHistoryItem>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordBalance(coinType: CoinType, balance: bigint): Promise<void>;
    recordTransaction(recipient: string, amountE8: bigint, coinType: CoinType, blockHeight: bigint | null): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveContact(name: string, address: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateContact(contactId: bigint, name: string, address: string): Promise<void>;
}
