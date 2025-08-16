import { useState } from 'react'
import { ChevronDown, ChevronUp, Search, MessageCircle, Mail } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: 'Geral',
    question: 'O que é o Launchpad Lunes?',
    answer: 'O Launchpad Lunes é uma plataforma descentralizada para lançamento de tokens que oferece múltiplas formas de participação: Whitelist, Pré-venda, Venda Pública, Launchpool e Rifas. Nossa missão é conectar projetos inovadores com investidores de forma segura e transparente.'
  },
  {
    category: 'Geral',
    question: 'Como posso participar dos lançamentos?',
    answer: 'Primeiro, conecte sua carteira compatible (SubWallet, Polkadot.js). Depois, escolha a fase que deseja participar: Whitelist para descontos máximos, Pré-venda para early access, Venda Pública para acesso geral, Launchpool para farming, ou Rifas para sorteios.'
  },
  {
    category: 'Segurança',
    question: 'Como vocês garantem a segurança dos projetos?',
    answer: 'Todos os projetos passam por rigorosa auditoria técnica, due diligence da equipe, análise de tokenomics e verificação de parcerias. Só aprovamos projetos com código auditado, equipe doxxed e fundamentos sólidos.'
  },
  {
    category: 'Investimento',
    question: 'Quais são os limites de investimento?',
    answer: 'Os limites variam por fase: Whitelist (min: $500, max: $10.000), Pré-venda (min: $250, max: $5.000), Venda Pública (min: $100, max: $2.500). Usuários KYC verificados têm limites aumentados.'
  },
  {
    category: 'Investimento',
    question: 'Quais moedas posso usar para investir?',
    answer: 'Aceitamos LUNES (token nativo), USDT-TON e USDT-Solana. Estamos expandindo para mais criptomoedas em breve.'
  },
  {
    category: 'Whitelist',
    question: 'Como posso entrar na Whitelist?',
    answer: 'A Whitelist é limitada e baseada em critérios como: engagement na comunidade, histórico de investimentos, completar tarefas sociais e ter tokens LUNES em staking. Anunciamos vagas em nossos canais oficiais.'
  },
  {
    category: 'Vesting',
    question: 'Como funciona o sistema de vesting?',
    answer: 'O vesting protege os investidores e o projeto: Whitelist (6-12 meses), Pré-venda (3-6 meses), Venda Pública (0-3 meses). Os tokens são liberados gradualmente conforme cronograma definido.'
  },
  {
    category: 'Launchpool',
    question: 'O que é o Launchpool?',
    answer: 'No Launchpool, você faz staking de tokens LUNES para ganhar tokens de novos projetos gratuitamente. Quanto mais LUNES você stakear e por mais tempo, mais tokens do projeto você receberá.'
  },
  {
    category: 'Rifas',
    question: 'Como funcionam as Rifas?',
    answer: 'As rifas são sorteios diários automáticos onde participantes ganham tokens de projetos. A participação é baseada em critérios como staking de LUNES, atividade na plataforma e completar tarefas.'
  },
  {
    category: 'Tokens',
    question: 'Quando recebo meus tokens?',
    answer: 'Os tokens são distribuídos conforme o cronograma de vesting de cada projeto. Você pode acompanhar e reivindicar seus tokens na seção "Tokens a Reivindicar" do seu dashboard.'
  }
]

const categories = ['Todos', 'Geral', 'Segurança', 'Investimento', 'Whitelist', 'Vesting', 'Launchpool', 'Rifas', 'Tokens']

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [openItems, setOpenItems] = useState<number[]>([])

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary/10 via-background to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-badge px-4 py-2 mb-6">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Central de Ajuda</span>
          </div>

          <h1 className="heading-1 mb-6">
            Perguntas <span className="text-gradient">Frequentes</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto">
            Encontre respostas para as principais dúvidas sobre o Launchpad Lunes
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar perguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full pl-10"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-badge text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-800Hover'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="heading-4 text-slate-400 mb-2">Nenhuma pergunta encontrada</h3>
                <p className="text-slate-400">Tente ajustar sua busca ou categoria</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((item, index) => (
                  <div key={index} className="card-hover">
                    <button
                      onClick={() => toggleItem(index)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="badge-primary">{item.category}</span>
                        </div>
                        <h3 className="heading-5 text-white">{item.question}</h3>
                      </div>
                      {openItems.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    
                    {openItems.includes(index) && (
                      <div className="mt-4 pt-4 border-t border-slate-600">
                        <p className="text-slate-200 leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-custom text-center">
          <h2 className="heading-2 mb-4">
            Não encontrou sua <span className="text-gradient">resposta</span>?
          </h2>
          <p className="text-slate-200 text-lg mb-8 max-w-2xl mx-auto">
            Nossa equipe de suporte está pronta para ajudar você
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:suporte@lunes.io" className="btn-primary">
              <Mail className="w-4 h-4 mr-2" />
              Enviar Email
            </a>
            <a href="https://discord.gg/lunes" target="_blank" rel="noopener noreferrer" className="btn-outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Discord Community
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
