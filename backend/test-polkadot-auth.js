const { Keyring } = require('@polkadot/keyring');
const { cryptoWaitReady } = require('@polkadot/util-crypto');
const { stringToU8a, u8aToHex } = require('@polkadot/util');

async function testPolkadotAuth() {
  try {
    // Aguardar inicialização das funções crypto
    await cryptoWaitReady();
    
    // Criar keyring para sr25519 (padrão Polkadot)
    const keyring = new Keyring({ type: 'sr25519' });
    
    // Criar uma conta de teste
    const testAccount = keyring.addFromUri('//Alice'); // Conta de teste padrão
    
    const walletAddress = testAccount.address;
    const nonce = '02b196948c7864a8f2f1c0c7a7f551f108b11fb366e7306198331324511f638f';
    const message = `Login to Launchpad with nonce: ${nonce}`;
    
    // Assinar a mensagem
    const messageBytes = stringToU8a(message);
    const signature = testAccount.sign(messageBytes);
    const signatureHex = u8aToHex(signature);
    
    console.log('🔐 Dados de autenticação Polkadot:');
    console.log('Wallet Address:', walletAddress);
    console.log('Message:', message);
    console.log('Signature:', signatureHex);
    console.log('');
    
    // Preparar payload para login
    const loginPayload = {
      walletAddress,
      signature: signatureHex,
      message
    };
    
    console.log('📤 Payload de login:');
    console.log(JSON.stringify(loginPayload, null, 2));
    
    return loginPayload;
    
  } catch (error) {
    console.error('❌ Erro ao gerar autenticação Polkadot:', error);
  }
}

testPolkadotAuth();