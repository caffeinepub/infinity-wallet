import { Principal } from '@dfinity/principal';

export function validateRecipient(recipient: string): { valid: boolean; error?: string } {
  if (!recipient || recipient.trim() === '') {
    return { valid: false, error: 'Recipient address is required' };
  }

  const trimmed = recipient.trim();

  // Check if it's a valid 64-character hex string (ICP Account ID)
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return { valid: true };
  }

  // Try to parse as Principal
  try {
    Principal.fromText(trimmed);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid address. Must be a valid ICP Account ID (Account Identifier) or Principal' };
  }
}

export function validateBtcAddress(address: string): { valid: boolean; error?: string } {
  if (!address || address.trim() === '') {
    return { valid: false, error: 'Bitcoin address is required' };
  }

  const trimmed = address.trim();

  // Basic Bitcoin address validation (P2PKH, P2SH, Bech32)
  // P2PKH: starts with 1, 26-35 characters
  // P2SH: starts with 3, 26-35 characters
  // Bech32: starts with bc1, 42-62 characters
  const btcRegex = /^(1|3)[a-km-zA-HJ-NP-Z1-9]{25,34}$|^(bc1)[a-z0-9]{39,59}$/;
  
  if (btcRegex.test(trimmed)) {
    return { valid: true };
  }

  return { valid: false, error: 'Invalid Bitcoin address format' };
}

export function validateEthAddress(address: string): { valid: boolean; error?: string } {
  if (!address || address.trim() === '') {
    return { valid: false, error: 'Ethereum address is required' };
  }

  const trimmed = address.trim();

  // Ethereum address: 0x followed by 40 hex characters
  const ethRegex = /^0x[a-fA-F0-9]{40}$/;
  
  if (ethRegex.test(trimmed)) {
    return { valid: true };
  }

  return { valid: false, error: 'Invalid Ethereum address format (must be 0x followed by 40 hex characters)' };
}

export function validateSolAddress(address: string): { valid: boolean; error?: string } {
  if (!address || address.trim() === '') {
    return { valid: false, error: 'Solana address is required' };
  }

  const trimmed = address.trim();

  // Solana address: base58 encoded, typically 32-44 characters
  const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  
  if (solRegex.test(trimmed)) {
    return { valid: true };
  }

  return { valid: false, error: 'Invalid Solana address format (must be base58 encoded, 32-44 characters)' };
}

export function validateAmount(amount: string): { valid: boolean; error?: string } {
  if (!amount || amount.trim() === '') {
    return { valid: false, error: 'Amount is required' };
  }

  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) {
    return { valid: false, error: 'Amount must be a valid number' };
  }

  if (numAmount <= 0) {
    return { valid: false, error: 'Amount must be greater than zero' };
  }

  return { valid: true };
}

export function formatBalance(balanceE8: bigint): string {
  const balance = Number(balanceE8) / 100_000_000;
  return balance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
}

export function parseAmountToE8(amount: string): bigint {
  const numAmount = parseFloat(amount);
  return BigInt(Math.floor(numAmount * 100_000_000));
}
