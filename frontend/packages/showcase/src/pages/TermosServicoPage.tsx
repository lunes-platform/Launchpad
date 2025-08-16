import { FileText, Calendar, AlertTriangle } from 'lucide-react'

export default function TermosServicoPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
        <div className="container-custom text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-badge px-4 py-2 mb-6">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Documento Legal</span>
          </div>

          <h1 className="heading-1 mb-6">
            Termos de <span className="text-gradient">Serviço</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Leia atentamente nossos termos e condições de uso da plataforma
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>Última atualização: 15 de janeiro de 2024</span>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Warning Notice */}
            <div className="card mb-8 border-warning/30 bg-warning/10">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-warning mb-2">Aviso Importante</h3>
                  <p className="text-slate-200">
                    Este documento constitui um acordo legal entre você e o Launchpad Lunes. 
                    Ao usar nossa plataforma, você concorda com todos os termos aqui descritos.
                  </p>
                </div>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h2 className="heading-3 mb-6">1. Aceitação dos Termos</h2>
              <p className="text-slate-200 mb-6">
                Ao acessar e usar o Launchpad Lunes, você aceita e concorda em cumprir estes 
                Termos de Serviço. Se você não concordar com qualquer parte destes termos, 
                não deve usar nossa plataforma.
              </p>

              <h2 className="heading-3 mb-6">2. Descrição do Serviço</h2>
              <p className="text-slate-200 mb-4">
                O Launchpad Lunes é uma plataforma descentralizada que oferece:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Participação em lançamentos de tokens através de múltiplas fases</li>
                <li>Staking de tokens LUNES para rewards</li>
                <li>Sistema de rifas e sorteios</li>
                <li>Acesso a projetos auditados e verificados</li>
                <li>Dashboard para gerenciamento de investimentos</li>
              </ul>

              <h2 className="heading-3 mb-6">3. Elegibilidade e Registro</h2>
              <p className="text-slate-200 mb-4">
                Para usar nossa plataforma, você deve:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Ter pelo menos 18 anos de idade</li>
                <li>Possuir capacidade legal para celebrar contratos</li>
                <li>Não estar localizado em jurisdições onde os serviços são proibidos</li>
                <li>Conectar uma carteira compatível (SubWallet, Polkadot.js)</li>
                <li>Completar verificação KYC quando solicitado</li>
              </ul>

              <h2 className="heading-3 mb-6">4. Riscos de Investimento</h2>
              <p className="text-slate-200 mb-4">
                <strong>IMPORTANTE:</strong> Investimentos em criptomoedas envolvem riscos significativos:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Volatilidade extrema de preços</li>
                <li>Possibilidade de perda total do capital investido</li>
                <li>Projetos podem falhar ou não entregar conforme prometido</li>
                <li>Regulamentações podem mudar</li>
                <li>Riscos técnicos de smart contracts</li>
              </ul>

              <h2 className="heading-3 mb-6">5. Responsabilidades do Usuário</h2>
              <p className="text-slate-200 mb-4">
                Como usuário da plataforma, você é responsável por:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Manter a segurança de suas chaves privadas e carteira</li>
                <li>Verificar todos os detalhes antes de investir</li>
                <li>Fazer sua própria pesquisa sobre os projetos</li>
                <li>Cumprir as leis de sua jurisdição</li>
                <li>Não compartilhar sua conta com terceiros</li>
                <li>Reportar qualquer atividade suspeita</li>
              </ul>

              <h2 className="heading-3 mb-6">6. Limitação de Responsabilidade</h2>
              <p className="text-slate-200 mb-6">
                O Launchpad Lunes atua como facilitador entre projetos e investidores. 
                Não somos responsáveis pelo desempenho dos projetos, perda de fundos devido 
                a falhas de projetos, ou decisões de investimento dos usuários. Nossa 
                responsabilidade é limitada ao valor das taxas pagas por você.
              </p>

              <h2 className="heading-3 mb-6">7. Taxas e Pagamentos</h2>
              <p className="text-slate-200 mb-4">
                Nossa plataforma cobra as seguintes taxas:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Taxa de participação: 2% sobre investimentos</li>
                <li>Taxa de transação: Conforme rede blockchain</li>
                <li>Taxa de saque: Variável conforme token</li>
              </ul>

              <h2 className="heading-3 mb-6">8. Propriedade Intelectual</h2>
              <p className="text-slate-200 mb-6">
                Todo o conteúdo da plataforma, incluindo textos, gráficos, logos e software, 
                é propriedade do Launchpad Lunes e protegido por leis de direitos autorais. 
                Você não pode reproduzir, distribuir ou modificar qualquer conteúdo sem 
                autorização expressa.
              </p>

              <h2 className="heading-3 mb-6">9. Suspensão e Encerramento</h2>
              <p className="text-slate-200 mb-6">
                Reservamos o direito de suspender ou encerrar sua conta se você violar 
                estes termos, se envolver em atividades fraudulentas, ou se considerarmos 
                necessário para proteger nossa plataforma e usuários.
              </p>

              <h2 className="heading-3 mb-6">10. Modificações dos Termos</h2>
              <p className="text-slate-200 mb-6">
                Podemos modificar estes termos a qualquer momento. Notificaremos sobre 
                mudanças significativas através da plataforma ou email. O uso continuado 
                após as modificações constitui aceitação dos novos termos.
              </p>

              <h2 className="heading-3 mb-6">11. Lei Aplicável</h2>
              <p className="text-slate-200 mb-6">
                Estes termos são regidos pelas leis da jurisdição onde nossa empresa está 
                registrada. Qualquer disputa será resolvida nos tribunais competentes dessa 
                jurisdição.
              </p>

              <h2 className="heading-3 mb-6">12. Contato</h2>
              <p className="text-slate-200 mb-4">
                Para questões sobre estes termos, entre em contato:
              </p>
              <ul className="list-disc list-inside text-slate-200 mb-6 space-y-2">
                <li>Email: legal@lunes.io</li>
                <li>Discord: discord.gg/lunes</li>
                <li>Endereço: [Endereço da empresa]</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
