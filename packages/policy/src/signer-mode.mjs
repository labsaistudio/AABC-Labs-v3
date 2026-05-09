export const SignerMode = Object.freeze({
  PREPARE_ONLY: 'prepare_only',
  CONNECTED_WALLET: 'connected_wallet',
  SESSION_WALLET: 'session_wallet',
  SMART_ACCOUNT_SESSION: 'smart_account_session',
  SERVER_TREASURY: 'server_treasury',
});

export function isSignerMode(value) {
  return Object.values(SignerMode).includes(value);
}
