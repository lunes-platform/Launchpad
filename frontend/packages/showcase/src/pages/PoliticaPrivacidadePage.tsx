import { Shield, Eye, Lock, Calendar, Users, Database } from 'lucide-react'

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
        <div className="container-custom text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-badge px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Privacidade</span>
          </div>

          <h1 className="heading-1 mb-6">
            Política de <span className="text-gradient">Privacidade</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Sua privacidade é fundamental. Saiba como coletamos, usamos e protegemos seus dados.
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>Última atualização: 15 de janeiro de 2024</span>
          </div>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="card text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-success" />
              </div>
              <h3 className="heading-5 mb-2">Dados Protegidos</h3>
              <p className="text-slate-200 text-sm">
                Utilizamos criptografia de ponta para proteger suas informações
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-info" />
              </div>
              <h3 className="heading-5 mb-2">Transparência Total</h3>
              <p className="text-slate-200 text-sm">
                Você tem controle total sobre seus dados pessoais
              </p>
            </div>
            
            <div className="card text-center">
              <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-warning" />
              </div>
              <h3 className="heading-5 mb-2">Nunca Compartilhamos</h3>
              <p className="text-slate-200 text-sm">
                Seus dados nunca são vendidos ou compartilhados com terceiros
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="prose prose-invert max-w-none">
              <h2 className="heading-3 mb-6">1. Informações que Coletamos</h2>
              
              <h3 className="heading-4 mb-4">1.1 Informações Fornecidas por Você</h3>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Endereço de carteira (obrigatório para usar a plataforma)</li>
                <li>Email (para notificações importantes)</li>
                <li>Informações de KYC quando solicitadas</li>
                <li>Comunicações que você envia para nosso suporte</li>
              </ul>

              <h3 className="heading-4 mb-4">1.2 Informações Coletadas Automaticamente</h3>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Dados de transação na blockchain (públicos por natureza)</li>
                <li>Logs de acesso e uso da plataforma</li>
                <li>Informações do dispositivo e navegador</li>
                <li>Endereço IP (anonimizado após 30 dias)</li>
                <li>Cookies para melhorar a experiência do usuário</li>
              </ul>

              <h2 className="heading-3 mb-6">2. Como Usamos Suas Informações</h2>
              <p className="text-slate-200 mb-4">
                Utilizamos suas informações exclusivamente para:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Processar transações e investimentos</li>
                <li>Verificar identidade conforme regulamentações</li>
                <li>Enviar notificações importantes sobre seus investimentos</li>
                <li>Detectar e prevenir fraudes</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Análises internas para melhorar a plataforma</li>
              </ul>

              <h2 className="heading-3 mb-6">3. Bases Legais para Processamento</h2>
              <p className="text-slate-200 mb-4">
                Processamos seus dados pessoais com base em:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li><strong>Consentimento:</strong> Quando você nos dá permissão explícita</li>
                <li><strong>Contrato:</strong> Para executar serviços que você solicitou</li>
                <li><strong>Interesse Legítimo:</strong> Para melhorar nossos serviços e segurança</li>
                <li><strong>Obrigação Legal:</strong> Para cumprir leis e regulamentações</li>
              </ul>

              <h2 className="heading-3 mb-6">4. Compartilhamento de Informações</h2>
              <p className="text-slate-200 mb-4">
                <strong>Nunca vendemos seus dados.</strong> Podemos compartilhar informações apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Com seu consentimento explícito</li>
                <li>Com provedores de serviços que nos ajudam a operar (sob rigorosos acordos de confidencialidade)</li>
                <li>Para cumprir ordens judiciais ou requisições legais</li>
                <li>Para proteger nossos direitos e a segurança da plataforma</li>
                <li>Em caso de fusão, aquisição ou venda de ativos (com notificação prévia)</li>
              </ul>

              <h2 className="heading-3 mb-6">5. Segurança dos Dados</h2>
              <p className="text-slate-200 mb-4">
                Implementamos medidas de segurança rigorosas:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Criptografia AES-256 para dados em repouso</li>
                <li>TLS 1.3 para dados em trânsito</li>
                <li>Autenticação multi-fator para contas administrativas</li>
                <li>Auditorias de segurança regulares</li>
                <li>Monitoramento 24/7 de atividades suspeitas</li>
                <li>Backup seguro e recuperação de desastres</li>
              </ul>

              <h2 className="heading-3 mb-6">6. Retenção de Dados</h2>
              <p className="text-slate-200 mb-4">
                Mantemos seus dados pelo tempo necessário para:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li><strong>Dados de conta:</strong> Até 7 anos após fechamento da conta</li>
                <li><strong>Dados de transação:</strong> Conforme exigido por regulamentações (até 10 anos)</li>
                <li><strong>Logs de acesso:</strong> 2 anos</li>
                <li><strong>Dados de marketing:</strong> Até você cancelar o consentimento</li>
                <li><strong>Dados de KYC:</strong> Conforme exigido por lei</li>
              </ul>

              <h2 className="heading-3 mb-6">7. Seus Direitos</h2>
              <p className="text-slate-200 mb-4">
                Você tem os seguintes direitos sobre seus dados:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li><strong>Acesso:</strong> Solicitar cópia de seus dados pessoais</li>
                <li><strong>Retificação:</strong> Corrigir dados incorretos ou incompletos</li>
                <li><strong>Apagamento:</strong> Solicitar exclusão de dados (sujeito a obrigações legais)</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato legível por máquina</li>
                <li><strong>Objeção:</strong> Opor-se ao processamento baseado em interesse legítimo</li>
                <li><strong>Retirada de Consentimento:</strong> Cancelar permissões dadas anteriormente</li>
              </ul>

              <h2 className="heading-3 mb-6">8. Cookies e Tecnologias Similares</h2>
              <p className="text-slate-200 mb-4">
                Utilizamos cookies para:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Manter você conectado à plataforma</li>
                <li>Lembrar suas preferências</li>
                <li>Analisar o uso da plataforma</li>
                <li>Melhorar a experiência do usuário</li>
              </ul>
              <p className="text-slate-200 mb-6">
                Você pode gerenciar cookies através das configurações do seu navegador.
              </p>

              <h2 className="heading-3 mb-6">9. Transferências Internacionais</h2>
              <p className="text-slate-200 mb-6">
                Seus dados podem ser processados em países fora de sua jurisdição. 
                Garantimos proteção adequada através de cláusulas contratuais padrão 
                e certificações de privacidade.
              </p>

              <h2 className="heading-3 mb-6">10. Menores de Idade</h2>
              <p className="text-slate-200 mb-6">
                Nossa plataforma é destinada a maiores de 18 anos. Não coletamos 
                intencionalmente dados de menores. Se tomarmos conhecimento de dados 
                de menores, eles serão excluídos imediatamente.
              </p>

              <h2 className="heading-3 mb-6">11. Atualizações desta Política</h2>
              <p className="text-slate-200 mb-6">
                Podemos atualizar esta política ocasionalmente. Notificaremos sobre 
                mudanças significativas através da plataforma ou email. Recomendamos 
                revisar periodicamente esta página.
              </p>

              <h2 className="heading-3 mb-6">12. Contato</h2>
              <p className="text-slate-200 mb-4">
                Para questões sobre privacidade, entre em contato:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Email: privacy@lunes.io</li>
                <li>Data Protection Officer: dpo@lunes.io</li>
                <li>Discord: discord.gg/lunes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
