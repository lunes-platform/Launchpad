import LaunchpadABI from './abi/Launchpad.json';

/**
 * Configuration for Smart Contracts
 */
export const CONTRACTS = {
  LAUNCHPAD: {
    // Endereço do contrato Launchpad na rede Lunes (Mainnet/Testnet)
    // TODO: Substituir pelo endereço real após o deploy
    address: '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM',
    abi: LaunchpadABI,
  },
};

export default CONTRACTS;
