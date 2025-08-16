/**
 * Utilitários de validação específicos para a rede Lunes e tokens PSP22
 */

// Configurações da rede Lunes
export const LUNES_NETWORK_CONFIG = {
  name: 'Lunes Network',
  chainId: 'lunes', // ID específico da rede Lunes
  rpcEndpoint: 'wss://rpc.lunes.network', // RPC da rede Lunes
  explorerUrl: 'https://explorer.lunes.network',
  nativeCurrency: {
    name: 'LUNES',
    symbol: 'LUNES',
    decimals: 12
  }
} as const

// Padrão de endereço PSP22 na rede Lunes (ajustar conforme necessário)
export const PSP22_ADDRESS_PATTERN = /^5[A-Za-z0-9]{47}$/

// Interface para contrato PSP22
export interface PSP22ContractInfo {
  address: string
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  isValid: boolean
  auditStatus?: 'pending' | 'approved' | 'rejected'
}

// Interface para dados do projeto na rede Lunes
export interface LunesProjectData {
  contractAddress: string
  networkValidated: boolean
  psp22Validated: boolean
  auditCompleted: boolean
  complianceChecked: boolean
}

/**
 * Valida se um endereço é válido para a rede Lunes
 */
export function isValidLunesAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false
  
  // Validação básica do formato do endereço
  return PSP22_ADDRESS_PATTERN.test(address)
}

/**
 * Valida se um contrato é PSP22 válido
 */
export async function validatePSP22Contract(contractAddress: string): Promise<PSP22ContractInfo> {
  // Validação inicial do endereço
  if (!isValidLunesAddress(contractAddress)) {
    return {
      address: contractAddress,
      name: '',
      symbol: '',
      decimals: 0,
      totalSupply: '0',
      isValid: false
    }
  }

  try {
    // Em produção, isso seria uma chamada real para o contrato PSP22
    // Por enquanto, vamos simular a validação
    const mockValidation = await simulatePSP22Validation(contractAddress)
    
    return {
      address: contractAddress,
      name: mockValidation.name,
      symbol: mockValidation.symbol,
      decimals: mockValidation.decimals,
      totalSupply: mockValidation.totalSupply,
      isValid: true,
      auditStatus: mockValidation.auditStatus
    }
  } catch (error) {
    console.error('Erro ao validar contrato PSP22:', error)
    return {
      address: contractAddress,
      name: '',
      symbol: '',
      decimals: 0,
      totalSupply: '0',
      isValid: false
    }
  }
}

/**
 * Simula a validação de um contrato PSP22 (para desenvolvimento)
 */
async function simulatePSP22Validation(address: string): Promise<{
  name: string
  symbol: string
  decimals: number
  totalSupply: string
  auditStatus: 'pending' | 'approved' | 'rejected'
}> {
  // Simula delay de rede
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simula dados de contrato válido
  return {
    name: 'Mock Token',
    symbol: 'MOCK',
    decimals: 12,
    totalSupply: '1000000000000000000000',
    auditStatus: Math.random() > 0.5 ? 'approved' : 'pending'
  }
}

/**
 * Valida os requisitos mínimos para um projeto na rede Lunes
 */
export function validateLunesProjectRequirements(projectData: Partial<LunesProjectData>): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Validações obrigatórias
  if (!projectData.contractAddress) {
    errors.push('Endereço do contrato PSP22 é obrigatório')
  } else if (!isValidLunesAddress(projectData.contractAddress)) {
    errors.push('Endereço do contrato PSP22 inválido para a rede Lunes')
  }

  if (!projectData.networkValidated) {
    errors.push('Projeto deve estar implantado na rede Lunes')
  }

  if (!projectData.psp22Validated) {
    errors.push('Contrato deve implementar o padrão PSP22')
  }

  // Validações de recomendação
  if (!projectData.auditCompleted) {
    warnings.push('Recomendamos que o contrato seja auditado antes do lançamento')
  }

  if (!projectData.complianceChecked) {
    warnings.push('Verificação de conformidade regulatória pendente')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Lista de categorias aprovadas para projetos na rede Lunes
 */
export const APPROVED_PROJECT_CATEGORIES = [
  'DeFi',
  'Gaming',
  'NFT',
  'Infrastructure',
  'AI',
  'Social',
  'Utilities',
  'DAO',
  'Cross-Chain'
] as const

/**
 * Requisitos específicos por categoria
 */
export const CATEGORY_REQUIREMENTS = {
  DeFi: {
    minAuditRequired: true,
    minLiquidity: 100000, // USD
    additionalDocs: ['Tokenomics', 'Risk Assessment']
  },
  Gaming: {
    minAuditRequired: true,
    minLiquidity: 50000,
    additionalDocs: ['Game Design Document', 'Economy Model']
  },
  NFT: {
    minAuditRequired: false,
    minLiquidity: 25000,
    additionalDocs: ['Collection Roadmap', 'Utility Description']
  },
  Infrastructure: {
    minAuditRequired: true,
    minLiquidity: 200000,
    additionalDocs: ['Technical Specification', 'Scalability Plan']
  },
  AI: {
    minAuditRequired: true,
    minLiquidity: 150000,
    additionalDocs: ['AI Model Documentation', 'Data Privacy Policy']
  },
  Social: {
    minAuditRequired: false,
    minLiquidity: 30000,
    additionalDocs: ['Community Guidelines', 'Moderation Policy']
  },
  Utilities: {
    minAuditRequired: true,
    minLiquidity: 75000,
    additionalDocs: ['Service Specification', 'Integration Guide']
  },
  DAO: {
    minAuditRequired: true,
    minLiquidity: 100000,
    additionalDocs: ['Governance Framework', 'Voting Mechanism']
  },
  'Cross-Chain': {
    minAuditRequired: true,
    minLiquidity: 300000,
    additionalDocs: ['Bridge Security Audit', 'Interoperability Documentation']
  }
} as const

/**
 * Valida se uma categoria é aprovada e retorna os requisitos
 */
export function validateProjectCategory(category: string): {
  isApproved: boolean
  requirements?: typeof CATEGORY_REQUIREMENTS[keyof typeof CATEGORY_REQUIREMENTS]
} {
  const approvedCategory = APPROVED_PROJECT_CATEGORIES.find(c => c === category)
  
  if (!approvedCategory) {
    return { isApproved: false }
  }

  return {
    isApproved: true,
    requirements: CATEGORY_REQUIREMENTS[approvedCategory]
  }
}

/**
 * Formata um endereço para exibição
 */
export function formatLunesAddress(address: string, length: number = 8): string {
  if (!address || address.length < length * 2) return address
  
  return `${address.substring(0, length)}...${address.substring(address.length - length)}`
}

/**
 * Gera um resumo de validação do projeto
 */
export function generateProjectValidationSummary(
  contractInfo: PSP22ContractInfo,
  projectData: LunesProjectData
): {
  overallStatus: 'valid' | 'warning' | 'invalid'
  summary: string
  details: Array<{
    check: string
    status: 'pass' | 'warning' | 'fail'
    message: string
  }>
} {
  const details = [
    {
      check: 'Rede Lunes',
      status: projectData.networkValidated ? 'pass' as const : 'fail' as const,
      message: projectData.networkValidated 
        ? 'Projeto está na rede Lunes' 
        : 'Projeto deve estar implantado na rede Lunes'
    },
    {
      check: 'Padrão PSP22',
      status: contractInfo.isValid ? 'pass' as const : 'fail' as const,
      message: contractInfo.isValid 
        ? `Token ${contractInfo.symbol} implementa PSP22 corretamente` 
        : 'Contrato não implementa o padrão PSP22'
    },
    {
      check: 'Auditoria',
      status: projectData.auditCompleted ? 'pass' as const : 'warning' as const,
      message: projectData.auditCompleted 
        ? 'Contrato auditado' 
        : 'Auditoria recomendada para maior segurança'
    },
    {
      check: 'Conformidade',
      status: projectData.complianceChecked ? 'pass' as const : 'warning' as const,
      message: projectData.complianceChecked 
        ? 'Conformidade verificada' 
        : 'Verificação de conformidade pendente'
    }
  ]

  const failCount = details.filter(d => d.status === 'fail').length
  const warningCount = details.filter(d => d.status === 'warning').length

  let overallStatus: 'valid' | 'warning' | 'invalid'
  let summary: string

  if (failCount > 0) {
    overallStatus = 'invalid'
    summary = `${failCount} requisito(s) obrigatório(s) não atendido(s)`
  } else if (warningCount > 0) {
    overallStatus = 'warning'
    summary = `Projeto válido com ${warningCount} recomendação(ões)`
  } else {
    overallStatus = 'valid'
    summary = 'Projeto atende todos os requisitos da rede Lunes'
  }

  return {
    overallStatus,
    summary,
    details
  }
}
