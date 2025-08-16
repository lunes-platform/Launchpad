import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2, 
  Search,
  ExternalLink,
  Shield,
  Network,
  FileText
} from 'lucide-react'
import { 
  validatePSP22Contract, 
  isValidLunesAddress,
  formatLunesAddress,
  generateProjectValidationSummary,
  LUNES_NETWORK_CONFIG,
  type PSP22ContractInfo,
  type LunesProjectData
} from '@/utils/lunesValidation'

interface PSP22ContractValidatorProps {
  onValidation: (contractInfo: PSP22ContractInfo, isValid: boolean) => void
  initialAddress?: string
}

export function PSP22ContractValidator({ onValidation, initialAddress = '' }: PSP22ContractValidatorProps) {
  const [contractAddress, setContractAddress] = useState(initialAddress)
  const [isValidating, setIsValidating] = useState(false)
  const [contractInfo, setContractInfo] = useState<PSP22ContractInfo | null>(null)
  const [validationStatus, setValidationStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle')
  const [showDetails, setShowDetails] = useState(false)

  // Mock data para demonstração de projeto validado
  const mockProjectData: LunesProjectData = {
    contractAddress,
    networkValidated: true,
    psp22Validated: contractInfo?.isValid || false,
    auditCompleted: false,
    complianceChecked: true
  }

  const validateContract = async () => {
    if (!contractAddress.trim()) return

    setIsValidating(true)
    setValidationStatus('validating')

    try {
      const info = await validatePSP22Contract(contractAddress)
      setContractInfo(info)
      setValidationStatus(info.isValid ? 'success' : 'error')
      onValidation(info, info.isValid)
    } catch (error) {
      console.error('Erro na validação:', error)
      setValidationStatus('error')
    } finally {
      setIsValidating(false)
    }
  }

  useEffect(() => {
    if (contractAddress && isValidLunesAddress(contractAddress)) {
      const timeoutId = setTimeout(() => {
        validateContract()
      }, 500) // Debounce de 500ms

      return () => clearTimeout(timeoutId)
    } else {
      setContractInfo(null)
      setValidationStatus('idle')
    }
  }, [contractAddress])

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'validating':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <Search className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusMessage = () => {
    switch (validationStatus) {
      case 'validating':
        return 'Validando contrato PSP22...'
      case 'success':
        return contractInfo ? `Token ${contractInfo.symbol} validado com sucesso` : 'Contrato válido'
      case 'error':
        return 'Contrato inválido ou não encontrado'
      default:
        return 'Digite o endereço do contrato PSP22'
    }
  }

  const validationSummary = contractInfo 
    ? generateProjectValidationSummary(contractInfo, mockProjectData)
    : null

  return (
    <div className="space-y-6">
      {/* Input de Endereço do Contrato */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Endereço do Contrato PSP22 na Rede Lunes *
        </label>
        <div className="relative">
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className={`input w-full pr-12 ${
              validationStatus === 'success' ? 'border-green-500 focus:border-green-500' :
              validationStatus === 'error' ? 'border-red-500 focus:border-red-500' : ''
            }`}
            placeholder="5ABC...XYZ (endereço do contrato PSP22)"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getStatusIcon()}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <p className={`text-sm ${
            validationStatus === 'success' ? 'text-green-400' :
            validationStatus === 'error' ? 'text-red-400' : 'text-slate-400'
          }`}>
            {getStatusMessage()}
          </p>
          
          {contractAddress && (
            <a
              href={`${LUNES_NETWORK_CONFIG.explorerUrl}/address/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primaryLight text-sm flex items-center space-x-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Ver no Explorer</span>
            </a>
          )}
        </div>
      </div>

      {/* Informações do Contrato Validado */}
      {contractInfo && validationStatus === 'success' && (
        <div className="card border-green-500/30 bg-green-500/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-green-400 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Contrato PSP22 Válido</span>
            </h3>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-slate-400 hover:text-white"
            >
              {showDetails ? 'Ocultar' : 'Ver'} Detalhes
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-slate-400">Nome do Token</p>
              <p className="font-medium">{contractInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Símbolo</p>
              <p className="font-medium">{contractInfo.symbol}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Decimais</p>
              <p className="font-medium">{contractInfo.decimals}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Endereço</p>
              <p className="font-medium font-mono text-sm">
                {formatLunesAddress(contractInfo.address)}
              </p>
            </div>
          </div>

          {/* Status de Auditoria */}
          {contractInfo.auditStatus && (
            <div className="flex items-center space-x-2 mb-4">
              <Shield className={`w-4 h-4 ${
                contractInfo.auditStatus === 'approved' ? 'text-green-400' :
                contractInfo.auditStatus === 'pending' ? 'text-yellow-400' : 'text-red-400'
              }`} />
              <span className="text-sm">
                Auditoria: {
                  contractInfo.auditStatus === 'approved' ? 'Aprovada' :
                  contractInfo.auditStatus === 'pending' ? 'Pendente' : 'Rejeitada'
                }
              </span>
            </div>
          )}

          {/* Detalhes de Validação */}
          {showDetails && validationSummary && (
            <div className="border-t border-slate-600 pt-4 mt-4">
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Resumo de Validação</span>
              </h4>
              
              <div className="space-y-3">
                {validationSummary.details.map((detail, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {detail.status === 'pass' && <CheckCircle className="w-4 h-4 text-green-400" />}
                    {detail.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                    {detail.status === 'fail' && <XCircle className="w-4 h-4 text-red-400" />}
                    <div>
                      <p className="text-sm font-medium">{detail.check}</p>
                      <p className="text-xs text-slate-400">{detail.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`mt-4 p-3 rounded-button ${
                validationSummary.overallStatus === 'valid' ? 'bg-green-500/10 border border-green-500/30' :
                validationSummary.overallStatus === 'warning' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                'bg-red-500/10 border border-red-500/30'
              }`}>
                <p className={`text-sm font-medium ${
                  validationSummary.overallStatus === 'valid' ? 'text-green-400' :
                  validationSummary.overallStatus === 'warning' ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {validationSummary.summary}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Erro de Validação */}
      {validationStatus === 'error' && (
        <div className="card border-red-500/30 bg-red-500/5">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-red-400">Contrato Inválido</h3>
          </div>
          <p className="text-sm text-slate-200 mb-4">
            O contrato fornecido não é válido ou não implementa o padrão PSP22 na rede Lunes.
          </p>
          <div className="bg-slate-800 rounded-button p-3">
            <p className="text-xs text-slate-400 mb-2">Verifique se:</p>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• O endereço está correto</li>
              <li>• O contrato está implantado na rede Lunes</li>
              <li>• O contrato implementa o padrão PSP22</li>
              <li>• O contrato está ativo e funcionando</li>
            </ul>
          </div>
        </div>
      )}

      {/* Informações da Rede Lunes */}
      <div className="card bg-primary/5 border-primary/20">
        <div className="flex items-center space-x-2 mb-3">
          <Network className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-primary">Rede Lunes</h3>
        </div>
        <p className="text-sm text-slate-200 mb-3">
          Apenas tokens PSP22 implantados na rede Lunes são aceitos no Launchpad.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            Chain ID: {LUNES_NETWORK_CONFIG.chainId}
          </span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            Padrão: PSP22
          </span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
            Rede: {LUNES_NETWORK_CONFIG.name}
          </span>
        </div>
      </div>
    </div>
  )
}
