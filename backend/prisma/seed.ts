import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário de teste
  const testUser = await prisma.user.upsert({
    where: { walletAddress: '0x1234567890123456789012345678901234567890' },
    update: {},
    create: {
      walletAddress: '0x1234567890123456789012345678901234567890',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
      isActive: true,
      isVerified: true,
      kycStatus: 'APPROVED',
    },
  });

  // Criar usuário admin de teste
  const adminUser = await prisma.user.upsert({
    where: { walletAddress: '0xadmin567890123456789012345678901234567890' },
    update: {},
    create: {
      walletAddress: '0xadmin567890123456789012345678901234567890',
      username: 'admin',
      displayName: 'Admin User',
      email: 'admin@example.com',
      isActive: true,
      isVerified: true,
      kycStatus: 'APPROVED',
    },
  });

  // Criar projeto de teste
  const testProject = await prisma.project.upsert({
    where: { id: 'test-project-1' },
    update: {},
    create: {
      id: 'test-project-1',
      name: 'Test Project',
      symbol: 'TST',
      description: 'Projeto de teste para desenvolvimento',
      website: 'https://test-project.com',
      twitter: '@testproject',
      telegram: 'testproject',
      discord: 'testproject',
      whitepaper: 'https://test-project.com/whitepaper.pdf',
      totalSupply: '1000000',
      tokenPrice: '0.1',
      targetAmount: '100000',
      minContribution: '0.01',
      maxContribution: '10',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-03-01'),
      vestingPeriod: 30,
      status: 'ACTIVE',
      category: 'DEFI',
      creatorId: testUser.id,
    },
  });

  // Criar sessão AMA de teste
  const testAma = await prisma.ama.upsert({
    where: { id: 'test-ama-1' },
    update: {},
    create: {
      id: 'test-ama-1',
      title: 'AMA de Teste',
      description: 'Sessão AMA para testes de desenvolvimento',
      projectId: testProject.id,
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
      endDate: new Date(Date.now() + 25 * 60 * 60 * 1000), // Amanhã + 1h
      isActive: true,
      maxQuestions: 50,
    },
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('📊 Dados criados:');
  console.log(`- Usuário teste: ${testUser.username} (${testUser.walletAddress})`);
  console.log(`- Usuário admin: ${adminUser.username} (${adminUser.walletAddress})`);
  console.log(`- Projeto: ${testProject.name} (${testProject.id})`);
  console.log(`- AMA: ${testAma.title} (${testAma.id})`);
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });