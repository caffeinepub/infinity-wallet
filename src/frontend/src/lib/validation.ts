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
