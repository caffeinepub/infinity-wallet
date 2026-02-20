import { Principal } from '@dfinity/principal';

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Validate ICP recipient (Account ID or Principal)
export function validateRecipient(recipient: string): ValidationResult {
  if (!recipient || recipient.trim() === '') {
    return { valid: false, error: 'Recipient address is required' };
  }

  const trimmed = recipient.trim();

  // Try parsing as Principal
  try {
    Principal.fromText(trimmed);
    return { valid: true };
  } catch {
    // Not a valid Principal, check if it's an Account ID
  }

  // Account ID validation (64 hex characters)
  if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
    return { valid: true };
  }

  return {
    valid: false,
    error: 'Invalid address. Must be a valid Principal or Account ID (64 hex characters)',
  };
}

// Enhanced Bitcoin address validation supporting all formats
export function validateBtcAddress(address: string): ValidationResult {
  if (!address || address.trim() === '') {
    return { valid: false, error: 'Bitcoin address is required' };
  }

  const trimmed = address.trim();

  // P2PKH (Legacy): starts with 1, 26-35 characters
  const p2pkhRegex = /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // P2SH: starts with 3, 26-35 characters
  const p2shRegex = /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  
  // Bech32 (SegWit): starts with bc1, lowercase, 42-62 characters
  const bech32Regex = /^bc1[a-z0-9]{39,59}$/;
  
  // Bech32m (Taproot): starts with bc1p, lowercase, 62 characters
  const bech32mRegex = /^bc1p[a-z0-9]{58}$/;

  // Testnet addresses
  const testnetP2PKHRegex = /^[mn][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const testnetP2SHRegex = /^2[a-km-zA-HJ-NP-Z1-9]{25,34}$/;
  const testnetBech32Regex = /^(tb1|bcrt1)[a-z0-9]{39,59}$/;

  if (
    p2pkhRegex.test(trimmed) ||
    p2shRegex.test(trimmed) ||
    bech32Regex.test(trimmed) ||
    bech32mRegex.test(trimmed) ||
    testnetP2PKHRegex.test(trimmed) ||
    testnetP2SHRegex.test(trimmed) ||
    testnetBech32Regex.test(trimmed)
  ) {
    return { valid: true };
  }

  return {
    valid: false,
    error: 'Invalid Bitcoin address. Supported formats: P2PKH (1...), P2SH (3...), Bech32 (bc1...), Taproot (bc1p...)',
  };
}

// Ethereum address validation
export function validateEthAddress(address: string): ValidationResult {
  if (!address || address.trim() === '') {
    return { valid: false, error: 'Ethereum address is required' };
  }

  const trimmed = address.trim();

  // Ethereum address: 0x followed by 40 hex characters
  const ethRegex = /^0x[a-fA-F0-9]{40}$/;

  if (ethRegex.test(trimmed)) {
    return { valid: true };
  }

  return {
    valid: false,
    error: 'Invalid Ethereum address. Must start with 0x followed by 40 hex characters',
  };
}

// Solana address validation
export function validateSolAddress(address: string): ValidationResult {
  if (!address || address.trim() === '') {
    return { valid: false, error: 'Solana address is required' };
  }

  const trimmed = address.trim();

  // Solana address: base58 encoded, 32-44 characters
  const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  if (solRegex.test(trimmed)) {
    return { valid: true };
  }

  return {
    valid: false,
    error: 'Invalid Solana address. Must be 32-44 base58 characters',
  };
}

// Amount validation
export function validateAmount(amount: string): ValidationResult {
  if (!amount || amount.trim() === '') {
    return { valid: false, error: 'Amount is required' };
  }

  const num = parseFloat(amount);

  if (isNaN(num)) {
    return { valid: false, error: 'Amount must be a valid number' };
  }

  if (num <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }

  return { valid: true };
}

// Parse amount to e8s (8 decimal places)
export function parseAmountToE8(amount: string): bigint {
  const num = parseFloat(amount);
  return BigInt(Math.floor(num * 100_000_000));
}

// Format balance from e8s to display
export function formatBalance(balanceE8: bigint): string {
  const balance = Number(balanceE8) / 100_000_000;
  return balance.toFixed(8).replace(/\.?0+$/, '');
}

// Format satoshis to BTC
export function formatSatoshisToBtc(satoshis: bigint): string {
  const btc = Number(satoshis) / 100_000_000;
  return btc.toFixed(8).replace(/\.?0+$/, '');
}

// Parse BTC amount to satoshis
export function parseBtcToSatoshis(btc: string): bigint {
  const num = parseFloat(btc);
  return BigInt(Math.floor(num * 100_000_000));
}

// Format USD value with dollar sign and proper decimals
export function formatUSD(value: number): string {
  if (isNaN(value) || !isFinite(value)) {
    return '$0.00';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
