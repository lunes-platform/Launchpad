import { useState } from 'react'
import { PSP22ContractInfo } from '@/utils/lunesValidation'
import toast from 'react-hot-toast'

export interface ProjectSubmissionData {
  // Dados básicos do projeto
  name: string
  symbol: string
  description: string
  category: string
  website: string
  twitter?: string
  discord?: string
  whitepaper: string
  logo?: File | null
  
  // Dados financeiros
  target: string
  tokenPrice: string
  maxInvestment: string
  minInvestment: string
  startDate: string
  endDate: string
  
  // Dados específicos da rede Lunes
  contractAddress: string
  networkType: 'lunes'
  tokenStandard: 'PSP22'
  
  // Validação e compliance
  contractValidation: PSP22ContractInfo
  networkValidated: boolean
  psp22Validated: boolean
  
  // Fases do projeto
  phases: Array<{
    name: string
    discount: string
    duration: string
    allocation: string
  }>
}

export interface BackendValidationResponse {
  isValid: boolean
  errors: string[]
  warnings: string[]
  projectId?: string
  status: 'pending_review' | 'approved' | 'rejected'
}

/**
 * Hook para submission de projetos com validação completa de backend
 */
export function useProjectSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResult, setSubmissionResult] = useState<BackendValidationResponse | null>(null)

  /**
   * Valida dados do projeto antes de enviar para o backend
   */
  const validateProjectData = (data: ProjectSubmissionData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    // Validações obrigatórias específicas do backend
    if (!data.contractValidation || !data.psp22Validated) {
      errors.push('Contrato PSP22 deve ser validado')
    }

    if (data.networkType !== 'lunes') {
      errors.push('Apenas projetos da rede Lunes são aceitos')
    }

    if (data.tokenStandard !== 'PSP22') {
      errors.push('Apenas tokens PSP22 são aceitos')
    }

    // Validação de valores financeiros
    const target = parseFloat(data.target)
    const tokenPrice = parseFloat(data.tokenPrice)
    const minInvestment = parseFloat(data.minInvestment)
    const maxInvestment = parseFloat(data.maxInvestment)

    if (target < 10000) {
      errors.push('Meta de arrecadação deve ser de pelo menos $10,000')
    }

    if (tokenPrice <= 0) {
      errors.push('Preço do token deve ser maior que zero')
    }

    if (minInvestment < 10) {
      errors.push('Investimento mínimo deve ser de pelo menos $10')
    }

    if (maxInvestment <= minInvestment) {
      errors.push('Investimento máximo deve ser maior que o mínimo')
    }

    // Validação de datas
    const startDate = new Date(data.startDate)
    const endDate = new Date(data.endDate)
    const now = new Date()

    if (startDate <= now) {
      errors.push('Data de início deve ser no futuro')
    }

    if (endDate <= startDate) {
      errors.push('Data de término deve ser posterior à data de início')
    }

    // Validação de fases
    if (data.phases.length === 0) {
      errors.push('Pelo menos uma fase deve ser configurada')
    }

    const totalAllocation = data.phases.reduce((sum, phase) => sum + parseFloat(phase.allocation || '0'), 0)
    if (Math.abs(totalAllocation - 100) > 0.01) {
      errors.push('A soma das alocações das fases deve ser 100%')
    }

    // Validação de URLs
    const urlPattern = /^https?:\/\/.+/
    if (!urlPattern.test(data.website)) {
      errors.push('Website deve ser uma URL válida (https://)')
    }

    if (!urlPattern.test(data.whitepaper)) {
      errors.push('Whitepaper deve ser uma URL válida (https://)')
    }

    if (data.twitter && !urlPattern.test(data.twitter)) {
      errors.push('Link do Twitter deve ser uma URL válida')
    }

    if (data.discord && !urlPattern.test(data.discord)) {
      errors.push('Link do Discord deve ser uma URL válida')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Simula envio para o backend com validações
   */
  const submitProject = async (data: ProjectSubmissionData): Promise<BackendValidationResponse> => {
    setIsSubmitting(true)
    
    try {
      // Validação local primeiro
      const validation = validateProjectData(data)
      if (!validation.isValid) {
        return {
          isValid: false,
          errors: validation.errors,
          warnings: [],
          status: 'rejected'
        }
      }

      // Simula delay de rede e processamento do backend
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simula validações adicionais do backend
      const backendValidation = await simulateBackendValidation(data)
      
      setSubmissionResult(backendValidation)
      
      if (backendValidation.isValid) {
        toast.success('Projeto enviado com sucesso! Aguardando análise da equipe.')
      } else {
        toast.error('Erro na validação do projeto. Verifique os campos e tente novamente.')
      }

      return backendValidation

    } catch (error) {
      console.error('Erro ao enviar projeto:', error)
      const errorResponse: BackendValidationResponse = {
        isValid: false,
        errors: ['Erro interno do servidor. Tente novamente mais tarde.'],
        warnings: [],
        status: 'rejected'
      }
      setSubmissionResult(errorResponse)
      toast.error('Erro ao enviar projeto. Tente novamente.')
      return errorResponse
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Simula validações específicas do backend
   */
  const simulateBackendValidation = async (data: ProjectSubmissionData): Promise<BackendValidationResponse> => {
    const warnings: string[] = []
    const errors: string[] = []

    // Simula verificação de duplicação de contrato
    if (Math.random() < 0.1) { // 10% chance de contrato duplicado
      errors.push('Este contrato já está registrado na plataforma')
    }

    // Simula verificação de conformidade regulatória
    if (data.category === 'DeFi' && parseFloat(data.target) > 1000000) {
      warnings.push('Projetos DeFi com meta acima de $1M podem precisar de documentação regulatória adicional')
    }

    // Simula verificação de auditoria para certas categorias
    if (['DeFi', 'Infrastructure', 'Cross-Chain'].includes(data.category)) {
      if (!data.contractValidation.auditStatus || data.contractValidation.auditStatus !== 'approved') {
        warnings.push(`Projetos da categoria ${data.category} requerem auditoria de segurança`)
      }
    }

    // Simula verificação de liquidez inicial
    const target = parseFloat(data.target)
    if (target < 50000) {
      warnings.push('Metas abaixo de $50k podem ter menor alcance de marketing')
    }

    // Simula verificação de redes sociais
    if (!data.twitter && !data.discord) {
      warnings.push('Presença em redes sociais recomendada para maior engajamento')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      projectId: errors.length === 0 ? `lunes_${Date.now()}` : undefined,
      status: errors.length === 0 ? 'pending_review' : 'rejected'
    }
  }

  /**
   * Limpa o resultado da submission
   */
  const clearSubmissionResult = () => {
    setSubmissionResult(null)
  }

  return {
    isSubmitting,
    submissionResult,
    submitProject,
    validateProjectData,
    clearSubmissionResult
  }
}

/**
 * Hook para buscar status de projetos submetidos
 */
export function useProjectStatus() {
  const [isLoading, setIsLoading] = useState(false)
  const [projectStatus, setProjectStatus] = useState<{
    id: string
    status: 'pending_review' | 'approved' | 'rejected'
    feedback?: string
    submittedAt: Date
    reviewedAt?: Date
  } | null>(null)

  const checkProjectStatus = async (projectId: string) => {
    setIsLoading(true)
    
    try {
      // Simula consulta ao backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simula dados de status
      setProjectStatus({
        id: projectId,
        status: 'pending_review',
        submittedAt: new Date(),
        feedback: 'Projeto em análise pela equipe técnica. Prazo estimado: 3-5 dias úteis.'
      })
      
    } catch (error) {
      console.error('Erro ao buscar status:', error)
      toast.error('Erro ao consultar status do projeto')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    projectStatus,
    checkProjectStatus
  }
}
