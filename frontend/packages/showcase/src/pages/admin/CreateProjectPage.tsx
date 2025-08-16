import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Save, Upload, Plus, X, Shield, AlertTriangle } from 'lucide-react'
import { PSP22ContractValidator } from '@/components/forms/PSP22ContractValidator'
import { 
  validateProjectCategory, 
  APPROVED_PROJECT_CATEGORIES,
  type PSP22ContractInfo 
} from '@/utils/lunesValidation'
import { 
  useProjectSubmission,
  type ProjectSubmissionData 
} from '@/hooks/useProjectSubmission'

export function CreateProjectPage() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    category: '',
    website: '',
    twitter: '',
    discord: '',
    whitepaper: '',
    logo: null as File | null,
    target: '',
    tokenPrice: '',
    maxInvestment: '',
    minInvestment: '',
    startDate: '',
    endDate: '',
    // Campos específicos da rede Lunes
    contractAddress: '',
    networkType: 'lunes', // Sempre rede Lunes
    tokenStandard: 'PSP22' // Sempre PSP22
  })

  const [contractValidation, setContractValidation] = useState<{
    contractInfo: PSP22ContractInfo | null
    isValid: boolean
  }>({
    contractInfo: null,
    isValid: false
  })

  const [showCategoryRequirements, setShowCategoryRequirements] = useState(false)

  // Hook para submission com validação de backend
  const { isSubmitting, submissionResult, submitProject, validateProjectData } = useProjectSubmission()

  const [phases, setPhases] = useState([
    { name: 'Whitelist', discount: '50', duration: '7', allocation: '20' },
    { name: 'Pré-venda', discount: '25', duration: '14', allocation: '30' },
    { name: 'Venda Pública', discount: '0', duration: '30', allocation: '50' }
  ])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, logo: file }))
  }

  const handlePhaseChange = (index: number, field: string, value: string) => {
    setPhases(prev => 
      prev.map((phase, i) => 
        i === index ? { ...phase, [field]: value } : phase
      )
    )
  }

  const addPhase = () => {
    setPhases(prev => [...prev, { name: '', discount: '', duration: '', allocation: '' }])
  }

  const removePhase = (index: number) => {
    setPhases(prev => prev.filter((_, i) => i !== index))
  }

  const handleContractValidation = (contractInfo: PSP22ContractInfo, isValid: boolean) => {
    setContractValidation({ contractInfo, isValid })
    
    // Auto-preencher dados do contrato se válido
    if (isValid && contractInfo) {
      setFormData(prev => ({
        ...prev,
        contractAddress: contractInfo.address,
        name: contractInfo.name || prev.name,
        symbol: contractInfo.symbol || prev.symbol
      }))
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value
    setFormData(prev => ({ ...prev, category }))
    setShowCategoryRequirements(!!category)
  }

  const canSubmit = () => {
    const requiredFields = ['name', 'symbol', 'description', 'category', 'website', 'whitepaper', 'target', 'tokenPrice', 'minInvestment', 'maxInvestment', 'startDate', 'endDate']
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData])
    
    return hasRequiredFields && contractValidation.isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canSubmit()) {
      alert('Por favor, preencha todos os campos obrigatórios e valide o contrato PSP22.')
      return
    }

    if (!contractValidation.contractInfo) {
      alert('Erro: informações do contrato não encontradas.')
      return
    }
    
    // Preparar dados para submission
    const submissionData: ProjectSubmissionData = {
      ...formData,
      contractValidation: contractValidation.contractInfo,
      networkValidated: true,
      psp22Validated: contractValidation.isValid,
      networkType: 'lunes',
      tokenStandard: 'PSP22',
      phases
    }
    
    // Enviar para backend com validação completa
    const result = await submitProject(submissionData)
    
    if (result.isValid && result.projectId) {
      // Sucesso - redirecionar ou mostrar próximos passos
      console.log('Projeto criado com ID:', result.projectId)
    } else {
      // Mostrar erros de validação
      console.log('Erros de validação:', result.errors)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/admin/projetos" className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="heading-2">Criar Novo Projeto</h1>
            <p className="text-slate-200">Configure todos os detalhes do lançamento</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Validação de Contrato PSP22 - OBRIGATÓRIO */}
          <div className="card border-primary/30 bg-primary/5">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="heading-4 text-primary">Validação do Contrato PSP22</h2>
            </div>
            
            <div className="bg-slate-800/50 rounded-card p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1" />
                <div>
                  <p className="font-medium text-yellow-400 mb-1">Apenas Rede Lunes PSP22</p>
                  <p className="text-sm text-slate-200">
                    Este launchpad aceita exclusivamente tokens que implementam o padrão PSP22 
                    e estão implantados na rede Lunes. Verifique se seu contrato atende aos requisitos.
                  </p>
                </div>
              </div>
            </div>

            <PSP22ContractValidator 
              onValidation={handleContractValidation}
              initialAddress={formData.contractAddress}
            />
          </div>

          {/* Basic Information */}
          <div className="card">
            <h2 className="heading-4 mb-6">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Projeto *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Ex: DeFi Protocol"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Símbolo do Token *</label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="Ex: DFP"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Descrição *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input w-full h-32 resize-none"
                  placeholder="Descreva o projeto, sua proposta de valor e principais funcionalidades..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Categoria *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="input w-full"
                  required
                >
                  <option value="">Selecionar categoria</option>
                  {APPROVED_PROJECT_CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                {/* Mostrar requisitos da categoria selecionada */}
                {showCategoryRequirements && formData.category && (() => {
                  const categoryValidation = validateProjectCategory(formData.category)
                  return categoryValidation.isApproved && categoryValidation.requirements ? (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-button">
                      <p className="text-xs font-medium text-slate-300 mb-2">Requisitos para {formData.category}:</p>
                      <ul className="text-xs text-slate-400 space-y-1">
                        <li>• Liquidez mínima: ${categoryValidation.requirements.minLiquidity.toLocaleString()}</li>
                        <li>• Auditoria: {categoryValidation.requirements.minAuditRequired ? 'Obrigatória' : 'Recomendada'}</li>
                        <li>• Docs adicionais: {categoryValidation.requirements.additionalDocs.join(', ')}</li>
                      </ul>
                    </div>
                  ) : null
                })()}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Logo do Projeto</label>
                <div className="input flex items-center space-x-2 cursor-pointer">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400">Escolher arquivo</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                {formData.logo && (
                  <p className="text-sm text-success mt-1">
                    Arquivo selecionado: {formData.logo.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Links and Social */}
          <div className="card">
            <h2 className="heading-4 mb-6">Links e Redes Sociais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Website *</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="https://projeto.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Whitepaper *</label>
                <input
                  type="url"
                  name="whitepaper"
                  value={formData.whitepaper}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="https://projeto.com/whitepaper.pdf"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Twitter</label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="https://twitter.com/projeto"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Discord</label>
                <input
                  type="url"
                  name="discord"
                  value={formData.discord}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="https://discord.gg/projeto"
                />
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="card">
            <h2 className="heading-4 mb-6">Detalhes Financeiros</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Meta de Arrecadação (USD) *</label>
                <input
                  type="number"
                  name="target"
                  value={formData.target}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="5000000"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Preço do Token (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="tokenPrice"
                  value={formData.tokenPrice}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="0.08"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Investimento Mínimo (USD) *</label>
                <input
                  type="number"
                  name="minInvestment"
                  value={formData.minInvestment}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Investimento Máximo (USD) *</label>
                <input
                  type="number"
                  name="maxInvestment"
                  value={formData.maxInvestment}
                  onChange={handleInputChange}
                  className="input w-full"
                  placeholder="10000"
                  required
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="card">
            <h2 className="heading-4 mb-6">Cronograma</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Data de Início *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Data de Término *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="input w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Phases Configuration */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-4">Configuração de Fases</h2>
              <button
                type="button"
                onClick={addPhase}
                className="btn-outline btn-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Fase
              </button>
            </div>
            
            <div className="space-y-4">
              {phases.map((phase, index) => (
                <div key={index} className="bg-slate-800/50 rounded-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Fase {index + 1}</h3>
                    {phases.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhase(index)}
                        className="text-error hover:bg-error/10 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome</label>
                      <input
                        type="text"
                        value={phase.name}
                        onChange={(e) => handlePhaseChange(index, 'name', e.target.value)}
                        className="input w-full"
                        placeholder="Ex: Whitelist"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Desconto (%)</label>
                      <input
                        type="number"
                        value={phase.discount}
                        onChange={(e) => handlePhaseChange(index, 'discount', e.target.value)}
                        className="input w-full"
                        placeholder="50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Duração (dias)</label>
                      <input
                        type="number"
                        value={phase.duration}
                        onChange={(e) => handlePhaseChange(index, 'duration', e.target.value)}
                        className="input w-full"
                        placeholder="7"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Alocação (%)</label>
                      <input
                        type="number"
                        value={phase.allocation}
                        onChange={(e) => handlePhaseChange(index, 'allocation', e.target.value)}
                        className="input w-full"
                        placeholder="20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link to="/admin/projetos" className="btn-outline">
              Cancelar
            </Link>
            <button 
              type="submit" 
              className={`btn-primary ${(!canSubmit() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canSubmit() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Validando Projeto...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {contractValidation.isValid ? 'Criar Projeto' : 'Valide o Contrato PSP22'}
                </>
              )}
            </button>
          </div>

          {/* Status de Validação */}
          {!contractValidation.isValid && (
            <div className="card border-yellow-500/30 bg-yellow-500/5">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="font-medium text-yellow-400">Validação Pendente</p>
                  <p className="text-sm text-slate-200">
                    É necessário validar um contrato PSP22 válido na rede Lunes antes de continuar.
                  </p>
                </div>
              </div>
            </div>
          )}

          {contractValidation.isValid && contractValidation.contractInfo && !submissionResult && (
            <div className="card border-green-500/30 bg-green-500/5">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <div>
                  <p className="font-medium text-green-400">Contrato Validado</p>
                  <p className="text-sm text-slate-200">
                    Token {contractValidation.contractInfo.symbol} ({contractValidation.contractInfo.name}) 
                    validado com sucesso na rede Lunes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Resultado da Submission */}
          {submissionResult && (
            <div className={`card border-2 ${
              submissionResult.isValid 
                ? 'border-green-500/50 bg-green-500/10' 
                : 'border-red-500/50 bg-red-500/10'
            }`}>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  {submissionResult.isValid ? (
                    <Shield className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <h3 className={`font-semibold ${
                      submissionResult.isValid ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {submissionResult.isValid ? 'Projeto Enviado com Sucesso!' : 'Erro na Validação'}
                    </h3>
                    <p className="text-sm text-slate-200">
                      {submissionResult.isValid 
                        ? `Projeto ID: ${submissionResult.projectId} - Status: ${submissionResult.status}`
                        : 'Corrija os problemas abaixo e tente novamente'
                      }
                    </p>
                  </div>
                </div>

                {/* Erros */}
                {submissionResult.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-400 mb-2">Erros encontrados:</h4>
                    <ul className="space-y-1">
                      {submissionResult.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-300 flex items-start space-x-2">
                          <span className="text-red-400 mt-1">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Avisos */}
                {submissionResult.warnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-yellow-400 mb-2">Avisos importantes:</h4>
                    <ul className="space-y-1">
                      {submissionResult.warnings.map((warning, index) => (
                        <li key={index} className="text-sm text-yellow-300 flex items-start space-x-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Próximos passos se sucesso */}
                {submissionResult.isValid && (
                  <div className="bg-slate-800/50 rounded-button p-4">
                    <h4 className="font-medium text-green-400 mb-2">Próximos Passos:</h4>
                    <ul className="text-sm text-slate-200 space-y-1">
                      <li>• Nossa equipe analisará o projeto em 3-5 dias úteis</li>
                      <li>• Você receberá um email com o resultado da análise</li>
                      <li>• Se aprovado, entraremos em contato para definir os detalhes do lançamento</li>
                      <li>• Você pode acompanhar o status na área administrativa</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
