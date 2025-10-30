const crypto = require('crypto');

// Simular uma assinatura Web3 válida
function simulateWeb3Signature(message, privateKey) {
  // Em um cenário real, isso seria feito com ethers.js ou web3.js
  // Para teste, vamos criar uma assinatura simulada
  const hash = crypto.createHash('sha256').update(message + privateKey).digest('hex');
  return '0x' + hash;
}

// Dados do teste
const walletAddress = '0x1234567890123456789012345678901234567890';
const nonce = '13c254cc66a2e8864ae8be9295090702e88381826a8b4b05465b996e8438110e';
const message = `Login to Launchpad with nonce: ${nonce}`;
const privateKey = 'test_private_key_123'; // Chave privada simulada

// Gerar assinatura simulada
const signature = simulateWeb3Signature(message, privateKey);

console.log('🔐 Dados de autenticação simulados:');
console.log('Wallet Address:', walletAddress);
console.log('Message:', message);
console.log('Signature:', signature);
console.log('');

// Preparar payload para login
const loginPayload = {
  walletAddress,
  signature,
  message
};

console.log('📤 Payload de login:');
console.log(JSON.stringify(loginPayload, null, 2));