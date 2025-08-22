import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  FileText,
  Shield,
  DollarSign,
  Info,
  AlertCircle,
  CheckCircle,
  Save,
  Loader2,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

// Wrappers para resolver compatibilidade de tipos React 19
const ArrowLeftIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = ArrowLeft as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const SaveIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Save as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const Loader2Icon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Loader2 as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const UploadIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Upload as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const LinkIconComponent = ({ className, ...props }: { className?: string }) => {
  const IconComponent = LinkIcon as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const FileTextIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = FileText as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const ShieldIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Shield as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const DollarSignIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = DollarSign as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const InfoIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = Info as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const AlertCircleIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = AlertCircle as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

const CheckCircleIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = CheckCircle as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} {...props} />;
};

/**
 * Interface para os dados do formulário de edição de projeto
 */
interface ProjectFormData {
  // Informações básicas
  name: string;
  description: string;
  category: string;
  
  // Links sociais
  website: string;
  twitter: string;
  discord: string;
  telegram: string;
  
  // Documentos
  whitepaper: File | null;
  roadmap: File | null;
  
  // Tokenomics
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  fundraisingGoal: string;
  tokenPrice: string;
  
  // Vesting
  vestingEnabled: boolean;
  vestingCliff: string; // em meses
  vestingDuration: string; // em meses
  vestingReleasePercentage: string;
  
  // Airdrop
  airdropEnabled: boolean;
  airdropAmount: string;
  airdropPercentage: string;
  
  // Escrow
  escrowWalletAddress: string;
  tokenDepositConfirmed: boolean;
  airdropDepositConfirmed: boolean;
  escrowTermsAccepted: boolean;
  
  // SafeGuard
  safeguardHash: string;
  safeguardAmount: string;
  safeguardTermsAccepted: boolean;
  
  // Taxa de listagem
  listingFeeAmount: string;
  listingFeePaymentMethod: 'wallet' | 'custody';
  listingFeeTransactionHash: string;
  listingFeeConfirmed: boolean;
  
  // Fases de venda
  salePhases: {
    privateSale: {
      enabled: boolean;
      startDate: string;
      endDate: string;
      tokenPrice: string;
      maxAllocation: string;
      minInvestment: string;
      maxInvestment: string;
    };
    whitelist: {
      enabled: boolean;
      startDate: string;
      endDate: string;
      tokenPrice: string;
      maxAllocation: string;
      minInvestment: string;
      maxInvestment: string;
      whitelistRequirements: string;
    };
    publicSale: {
      enabled: boolean;
      startDate: string;
      endDate: string;
      tokenPrice: string;
      maxAllocation: string;
      minInvestment: string;
      maxInvestment: string;
    };
  };
  
  // LaunchPool
  launchPoolEnabled: boolean;
  launchPoolAllocation: string;
  launchPoolDuration: string; // em dias
  launchPoolMinStake: string;
  launchPoolRewards: string;
  
  // Raffle
  raffleEnabled: boolean;
  raffleTicketPrice: string;
  raffleMaxTickets: string;
  rafflePrizePool: string;
  raffleDrawDate: string;
  
  // Arquivos
  logo: File | null;
  banner: File | null;
  documents: File[];
}

/**
 * Interface para erros de validação do formulário
 */
interface FormErrors {
  [key: string]: string;
}

/**
 * Dados mock para simular um projeto existente
 */
const mockProjectData: ProjectFormData = {
  name: 'LunesSwap Protocol',
  description: 'Protocolo DeFi descentralizado para troca de tokens na rede Lunes',
  category: 'DeFi',
  website: 'https://lunesswap.io',
  twitter: 'https://twitter.com/lunesswap',
  discord: 'https://discord.gg/lunesswap',
  telegram: 'https://t.me/lunesswap',
  whitepaper: null,
  roadmap: null,
  tokenName: 'LunesSwap Token',
  tokenSymbol: 'LSP',
  totalSupply: '1000000000',
  fundraisingGoal: '500000',
  tokenPrice: '0.05',
  vestingEnabled: true,
  vestingCliff: '6',
  vestingDuration: '24',
  vestingReleasePercentage: '25',
  airdropEnabled: true,
  airdropAmount: '50000000',
  airdropPercentage: '5',
  escrowWalletAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
  tokenDepositConfirmed: true,
  airdropDepositConfirmed: true,
  escrowTermsAccepted: true,
  safeguardHash: '0xabc123def456...',
  safeguardAmount: '25000',
  safeguardTermsAccepted: true,
  listingFeeAmount: '1000',
  listingFeePaymentMethod: 'wallet',
  listingFeeTransactionHash: '0x123abc456def...',
  listingFeeConfirmed: true,
  salePhases: {
    privateSale: {
      enabled: true,
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      tokenPrice: '0.03',
      maxAllocation: '100000000',
      minInvestment: '1000',
      maxInvestment: '50000',
    },
    whitelist: {
      enabled: true,
      startDate: '2024-02-16',
      endDate: '2024-02-28',
      tokenPrice: '0.04',
      maxAllocation: '150000000',
      minInvestment: '500',
      maxInvestment: '25000',
      whitelistRequirements: 'KYC verificado e stake mínimo de 1000 LUNES',
    },
    publicSale: {
      enabled: true,
      startDate: '2024-03-01',
      endDate: '2024-03-15',
      tokenPrice: '0.05',
      maxAllocation: '200000000',
      minInvestment: '100',
      maxInvestment: '10000',
    },
  },
  launchPoolEnabled: true,
  launchPoolAllocation: '100000000',
  launchPoolDuration: '30',
  launchPoolMinStake: '1000',
  launchPoolRewards: '10',
  raffleEnabled: true,
  raffleTicketPrice: '10',
  raffleMaxTickets: '1000',
  rafflePrizePool: '50000',
  raffleDrawDate: '2024-03-20',
  logo: null,
  banner: null,
  documents: [],
};

/**
 * Página de edição de projeto
 * Permite editar informações de um projeto existente
 */
export function EditProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState<ProjectFormData>(mockProjectData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Carregar dados do projeto ao montar o componente
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // Simular carregamento dos dados do projeto
      setTimeout(() => {
        setFormData(mockProjectData);
        setIsLoading(false);
      }, 1000);
    }
  }, [id]);
  
  // Detectar mudanças não salvas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);
  
  /**
   * Atualiza um campo do formulário
   */
  const updateFormData = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    
    // Limpar erro do campo se existir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  
  /**
   * Valida os dados do formulário
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validações básicas
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do projeto é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.tokenSymbol.trim()) {
      newErrors.tokenSymbol = 'Símbolo do token é obrigatório';
    }
    
    if (!formData.totalSupply || parseFloat(formData.totalSupply) <= 0) {
      newErrors.totalSupply = 'Supply total deve ser maior que zero';
    }
    
    if (!formData.fundraisingGoal || parseFloat(formData.fundraisingGoal) <= 0) {
      newErrors.fundraisingGoal = 'Meta de arrecadação deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  /**
   * Salva as alterações do projeto
   */
  const handleSave = async () => {
    if (!validateForm()) {
      addNotification({
        type: 'error',
        title: 'Erro de validação',
        message: 'Por favor, corrija os erros antes de salvar.',
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addNotification({
        type: 'success',
        title: 'Projeto atualizado',
        message: 'As alterações foram salvas com sucesso.',
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Erro ao salvar',
        message: 'Ocorreu um erro ao salvar as alterações. Tente novamente.',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  /**
   * Volta para a listagem de projetos
   */
  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'Você tem alterações não salvas. Deseja realmente sair?'
      );
      if (!confirmLeave) return;
    }
    
    navigate('/listar-projeto');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-grafite-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2Icon className="w-8 h-8 text-roxo-500 animate-spin mx-auto mb-4" />
          <p className="text-grafite-300">Carregando dados do projeto...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-grafite-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-grafite-300 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Voltar para listagem
            </button>
            
            <div className="flex items-center gap-4">
              {hasUnsavedChanges && (
                <span className="text-yellow-400 text-sm flex items-center gap-1">
                  <AlertCircleIcon className="w-4 h-4" />
                  Alterações não salvas
                </span>
              )}
              
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-roxo-600 hover:bg-roxo-700 disabled:bg-roxo-800 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isSaving ? (
                  <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                  <SaveIcon className="w-4 h-4" />
                )}
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Editar Projeto: {formData.name}
            </h1>
            <p className="text-grafite-300">
              Atualize as informações do seu projeto. As alterações serão revisadas pela equipe.
            </p>
          </div>
        </div>
        
        {/* Formulário */}
        <div className="bg-grafite-800 rounded-lg border border-grafite-600 p-6">
          <div className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <InfoIcon className="w-5 h-5 text-roxo-500" />
                Informações Básicas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Nome do Projeto *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className={`w-full px-3 py-2 bg-grafite-700 border rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-grafite-600'
                    }`}
                    placeholder="Nome do seu projeto"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData('category', e.target.value)}
                    className="w-full px-3 py-2 bg-grafite-700 border border-grafite-600 rounded-lg text-white focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="DeFi">DeFi</option>
                    <option value="NFT">NFT</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Social">Social</option>
                    <option value="Metaverse">Metaverse</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Privacy">Privacy</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-grafite-300 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  rows={4}
                  className={`w-full px-3 py-2 bg-grafite-700 border rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent resize-none ${
                    errors.description ? 'border-red-500' : 'border-grafite-600'
                  }`}
                  placeholder="Descreva seu projeto, seus objetivos e diferenciais..."
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                )}
              </div>
            </div>
            
            {/* Tokenomics */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <DollarSignIcon className="w-5 h-5 text-roxo-500" />
                Tokenomics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Nome do Token
                  </label>
                  <input
                    type="text"
                    value={formData.tokenName}
                    onChange={(e) => updateFormData('tokenName', e.target.value)}
                    className="w-full px-3 py-2 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                    placeholder="Ex: LunesSwap Token"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Símbolo *
                  </label>
                  <input
                    type="text"
                    value={formData.tokenSymbol}
                    onChange={(e) => updateFormData('tokenSymbol', e.target.value.toUpperCase())}
                    className={`w-full px-3 py-2 bg-grafite-700 border rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent ${
                      errors.tokenSymbol ? 'border-red-500' : 'border-grafite-600'
                    }`}
                    placeholder="Ex: LSP"
                    maxLength={10}
                  />
                  {errors.tokenSymbol && (
                    <p className="text-red-400 text-sm mt-1">{errors.tokenSymbol}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Supply Total *
                  </label>
                  <input
                    type="number"
                    value={formData.totalSupply}
                    onChange={(e) => updateFormData('totalSupply', e.target.value)}
                    className={`w-full px-3 py-2 bg-grafite-700 border rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent ${
                      errors.totalSupply ? 'border-red-500' : 'border-grafite-600'
                    }`}
                    placeholder="1000000000"
                    min="1"
                  />
                  {errors.totalSupply && (
                    <p className="text-red-400 text-sm mt-1">{errors.totalSupply}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Meta de Arrecadação (LUNES) *
                  </label>
                  <input
                    type="number"
                    value={formData.fundraisingGoal}
                    onChange={(e) => updateFormData('fundraisingGoal', e.target.value)}
                    className={`w-full px-3 py-2 bg-grafite-700 border rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent ${
                      errors.fundraisingGoal ? 'border-red-500' : 'border-grafite-600'
                    }`}
                    placeholder="500000"
                    min="1"
                    step="0.01"
                  />
                  {errors.fundraisingGoal && (
                    <p className="text-red-400 text-sm mt-1">{errors.fundraisingGoal}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Preço do Token (LUNES)
                  </label>
                  <input
                    type="number"
                    value={formData.tokenPrice}
                    onChange={(e) => updateFormData('tokenPrice', e.target.value)}
                    className="w-full px-3 py-2 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                    placeholder="0.05"
                    min="0.001"
                    step="0.001"
                  />
                </div>
              </div>
            </div>
            
            {/* Links Sociais */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <LinkIconComponent className="w-5 h-5 text-roxo-500" />
                Links Sociais
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    className="w-full px-3 py-2 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                    placeholder="https://seusite.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => updateFormData('twitter', e.target.value)}
                    className="w-full px-3 py-2 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                    placeholder="https://twitter.com/seuprojeto"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Discord
                  </label>
                  <input
                    type="url"
                    value={formData.discord}
                    onChange={(e) => updateFormData('discord', e.target.value)}
                    className="w-full px-3 py-2 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                    placeholder="https://discord.gg/seuprojeto"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-grafite-300 mb-2">
                    Telegram
                  </label>
                  <input
                    type="url"
                    value={formData.telegram}
                    onChange={(e) => updateFormData('telegram', e.target.value)}
                    className="w-full px-3 py-2 bg-grafite-700 border border-grafite-600 rounded-lg text-white placeholder-grafite-400 focus:ring-2 focus:ring-roxo-500 focus:border-transparent"
                    placeholder="https://t.me/seuprojeto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Botões de Ação */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-2 border border-grafite-600 text-grafite-300 rounded-lg hover:bg-grafite-700 transition-colors"
          >
            Cancelar
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-roxo-600 hover:bg-roxo-700 disabled:bg-roxo-800 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {isSaving ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <SaveIcon className="w-4 h-4" />
            )}
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditProjectPage;