import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  Link as LinkIcon,
  Shield,
  DollarSign,
  Info,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

// Wrappers para resolver compatibilidade de tipos React 19
const ArrowLeftIcon = ({ className, ...props }: { className?: string }) => {
  const IconComponent = ArrowLeft as React.ComponentType<{ className?: string }>;
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
 * Interface para os dados do formulário de criação de projeto
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
  
  // Documentação (alterado para links)
  whitepaperUrl: string;
  roadmapUrl: string;
  
  // Configuração de Token PSP22
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  fundraisingGoal: string;
  tokenPrice: string;
  tokenContractAddress: string; // Endereço do contrato do token
  
  // Sistema de Custódia
  escrowWalletAddress: string;
  tokenDepositConfirmed: boolean;
  escrowTermsAccepted: boolean;
  

  
  // Taxa de Listagem
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
    publicSale02: {
      enabled: boolean;
      startDate: string;
      endDate: string;
      tokenPrice: string;
      maxAllocation: string;
      minInvestment: string;
      maxInvestment: string;
    };
    publicSale03: {
      enabled: boolean;
      startDate: string;
      endDate: string;
      tokenPrice: string;
      maxAllocation: string;
      minInvestment: string;
      maxInvestment: string;
    };
  };

  // LaunchPool e Raffle
  launchPoolEnabled: boolean;
  launchPoolAllocation: string;
  launchPoolDuration: string; // em dias
  launchPoolMinStake: string;
  launchPoolRewards: string;
  
  raffleEnabled: boolean;
  raffleTicketPrice: string;
  raffleMaxTickets: string;
  rafflePrizePool: string;
  raffleDrawDate: string;

  // Arquivos
  logo: File | null;
  banner: File | null;
  tokenSymbolImage: File | null; // Símbolo do token (avatar)
  thumbnailImage: File | null;   // Thumbnail do projeto
  documents: File[];
}

/**
 * Interface para erros de validação
 */
interface FormErrors {
  [key: string]: string;
}

/**
 * Página de criação de novo projeto
 * Formulário completo com todos os campos obrigatórios para inscrição no launchpad
 */
export function CreateProjectPage() {
  const navigate = useNavigate();
  useAuth();
  const { showError, showSuccess } = useNotifications();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<ProjectFormData>({
    // Informações básicas
    name: '',
    description: '',
    category: '',
    
    // Links sociais
    website: '',
    twitter: '',
    discord: '',
    telegram: '',
    
    // Documentação
    whitepaperUrl: '',
    roadmapUrl: '',
    
    // Configuração de Token PSP22
    tokenName: '',
    tokenSymbol: '',
    totalSupply: '',
    fundraisingGoal: '',
    tokenPrice: '',
    tokenContractAddress: '',
    
    // Sistema de Custódia
    escrowWalletAddress: '',
    tokenDepositConfirmed: false,
    escrowTermsAccepted: false,
    

    
    // Taxa de Listagem
    listingFeeAmount: '100', // Taxa fixa de 100 LUSD
    listingFeePaymentMethod: 'wallet',
    listingFeeTransactionHash: '',
    listingFeeConfirmed: false,
    
    // Fases de Venda
    salePhases: {
      privateSale: {
        enabled: false,
        startDate: '',
        endDate: '',
        tokenPrice: '',
        maxAllocation: '',
        minInvestment: '',
        maxInvestment: ''
      },
      whitelist: {
        enabled: false,
        startDate: '',
        endDate: '',
        tokenPrice: '',
        maxAllocation: '',
        minInvestment: '',
        maxInvestment: '',
      },
      publicSale: {
        enabled: true, // Venda pública sempre habilitada por padrão
        startDate: '',
        endDate: '',
        tokenPrice: '',
        maxAllocation: '',
        minInvestment: '',
        maxInvestment: '',
      },
      publicSale02: {
        enabled: false,
        startDate: '',
        endDate: '',
        tokenPrice: '',
        maxAllocation: '',
        minInvestment: '',
        maxInvestment: '',
      },
      publicSale03: {
        enabled: false,
        startDate: '',
        endDate: '',
        tokenPrice: '',
        maxAllocation: '',
        minInvestment: '',
        maxInvestment: '',
      },
    },
    
    // LaunchPool e Raffle
    launchPoolEnabled: false,
    launchPoolAllocation: '',
    launchPoolDuration: '',
    launchPoolMinStake: '',
    launchPoolRewards: '',
    
    raffleEnabled: false,
    raffleTicketPrice: '',
    raffleMaxTickets: '',
    rafflePrizePool: '',
    raffleDrawDate: '',
    
    // Arquivos
    logo: null,
    banner: null,
    tokenSymbolImage: null, // Novo campo para símbolo do token
    thumbnailImage: null,   // Novo campo para thumbnail
    documents: [],
  });

  const totalSteps = 7;
  
  const stepLabels = [
    'Informações Básicas',
    'Documentação',
    'Configuração de Token',
    'Fases de Venda',
    'LaunchPool e Raffle',
    'Sistema de Custódia',
    'Finalização'
  ];

  /**
   * Atualiza um campo do formulário
   */
  const updateFormData = (field: keyof ProjectFormData, value: ProjectFormData[keyof ProjectFormData]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Remove erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  /**
   * Valida os campos obrigatórios do step atual
   */
  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {};

    switch (currentStep) {
      case 1: // Informações básicas
        if (!formData.name.trim()) newErrors.name = 'Nome do projeto é obrigatório';
        if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
        if (!formData.website.trim()) newErrors.website = 'Website é obrigatório';
        break;

      case 2: // Links sociais e documentação
        if (!formData.twitter.trim()) newErrors.twitter = 'Twitter é obrigatório';
        if (!formData.telegram.trim()) newErrors.telegram = 'Telegram é obrigatório';
        if (!formData.whitepaperUrl) newErrors.whitepaperUrl = 'Whitepaper é obrigatório';
        if (!formData.roadmapUrl) newErrors.roadmapUrl = 'Roadmap é obrigatório';
        break;

      case 3: // Configuração de token
        if (!formData.tokenSymbol.trim()) newErrors.tokenSymbol = 'Símbolo do token é obrigatório';
        if (!formData.tokenName.trim()) newErrors.tokenName = 'Nome do token é obrigatório';
        if (!formData.totalSupply.trim()) newErrors.totalSupply = 'Supply total é obrigatório';
        if (!formData.fundraisingGoal.trim()) newErrors.fundraisingGoal = 'Valor para captação é obrigatório';
        if (!formData.tokenPrice.trim()) newErrors.tokenPrice = 'Preço do token é obrigatório';
        if (!formData.tokenContractAddress.trim()) newErrors.tokenContractAddress = 'Endereço do contrato do token é obrigatório';
        break;

      case 4: // Fases de Venda
        if (formData.salePhases.privateSale.enabled) {
          if (!formData.salePhases.privateSale.startDate) newErrors['salePhases.privateSale.startDate'] = 'Data de início da venda fechada é obrigatória';
          if (!formData.salePhases.privateSale.endDate) newErrors['salePhases.privateSale.endDate'] = 'Data de fim da venda fechada é obrigatória';
          if (!formData.salePhases.privateSale.tokenPrice) newErrors['salePhases.privateSale.tokenPrice'] = 'Preço do token na venda fechada é obrigatório';
        }
        if (formData.salePhases.whitelist.enabled) {
          if (!formData.salePhases.whitelist.startDate) newErrors['salePhases.whitelist.startDate'] = 'Data de início da whitelist é obrigatória';
          if (!formData.salePhases.whitelist.endDate) newErrors['salePhases.whitelist.endDate'] = 'Data de fim da whitelist é obrigatória';
          if (!formData.salePhases.whitelist.tokenPrice) newErrors['salePhases.whitelist.tokenPrice'] = 'Preço do token na whitelist é obrigatório';
        }
        if (formData.salePhases.publicSale.enabled) {
          if (!formData.salePhases.publicSale.startDate) newErrors['salePhases.publicSale.startDate'] = 'Data de início da venda pública é obrigatória';
          if (!formData.salePhases.publicSale.endDate) newErrors['salePhases.publicSale.endDate'] = 'Data de fim da venda pública é obrigatória';
          if (!formData.salePhases.publicSale.tokenPrice) newErrors['salePhases.publicSale.tokenPrice'] = 'Preço do token na venda pública é obrigatório';
        }
        break;

      case 5: // Sistema de Custódia
         if (!formData.escrowWalletAddress.trim()) newErrors.escrowWalletAddress = 'Endereço da carteira é obrigatório';
         if (!formData.tokenDepositConfirmed) newErrors.tokenDepositConfirmed = 'Confirmação do depósito de tokens é obrigatória';
         if (!formData.escrowTermsAccepted) newErrors.escrowTermsAccepted = 'Aceitação dos termos de custódia é obrigatória';
         break;

       case 6: // LaunchPool e Raffle
          // Validações opcionais baseadas na habilitação dos recursos
          if (formData.launchPoolEnabled) {
            if (!formData.launchPoolAllocation.trim()) newErrors.launchPoolAllocation = 'Alocação do LaunchPool é obrigatória';
            if (!formData.launchPoolDuration.trim()) newErrors.launchPoolDuration = 'Duração do LaunchPool é obrigatória';
            if (!formData.launchPoolMinStake.trim()) newErrors.launchPoolMinStake = 'Stake mínimo é obrigatório';
            if (!formData.launchPoolRewards.trim()) newErrors.launchPoolRewards = 'Recompensas do LaunchPool são obrigatórias';
          }
          if (formData.raffleEnabled) {
            if (!formData.raffleTicketPrice.trim()) newErrors.raffleTicketPrice = 'Preço do ticket é obrigatório';
            if (!formData.raffleMaxTickets.trim()) newErrors.raffleMaxTickets = 'Número máximo de tickets é obrigatório';
            if (!formData.rafflePrizePool.trim()) newErrors.rafflePrizePool = 'Pool de prêmios é obrigatório';
            if (!formData.raffleDrawDate.trim()) newErrors.raffleDrawDate = 'Data do sorteio é obrigatória';
          }
          break;

       case 7: // Finalização
          if (!formData.listingFeeTransactionHash.trim()) newErrors.listingFeeTransactionHash = 'Hash da transação da taxa é obrigatório';
          if (!formData.listingFeeConfirmed) newErrors.listingFeeConfirmed = 'Confirmação do pagamento da taxa é obrigatória';
          break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Avança para o próximo step
   */
  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  /**
   * Volta para o step anterior
   */
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };



  /**
   * Submete o formulário
   */
  /**
   * Valida se todos os requisitos obrigatórios foram preenchidos
   */
  const validateAllRequirements = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Informações Básicas
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do projeto é obrigatório';
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
      isValid = false;
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
      isValid = false;
    }

    // Links Sociais (pelo menos um obrigatório)
    if (!formData.website.trim() && !formData.twitter.trim() && !formData.discord.trim() && !formData.telegram.trim()) {
      newErrors.website = 'Pelo menos um link social é obrigatório';
      isValid = false;
    }

    // Documentação
    if (!formData.whitepaperUrl) {
      newErrors.whitepaperUrl = 'Whitepaper é obrigatório';
      isValid = false;
    }
    if (!formData.roadmapUrl) {
      newErrors.roadmapUrl = 'Roadmap é obrigatório';
      isValid = false;
    }

    // Configuração de Token
    if (!formData.tokenName.trim()) {
      newErrors.tokenName = 'Nome do token é obrigatório';
      isValid = false;
    }
    if (!formData.tokenSymbol.trim()) {
      newErrors.tokenSymbol = 'Símbolo do token é obrigatório';
      isValid = false;
    }
    if (!formData.totalSupply.trim()) {
      newErrors.totalSupply = 'Supply total é obrigatório';
      isValid = false;
    }
    if (!formData.fundraisingGoal.trim()) {
      newErrors.fundraisingGoal = 'Meta de captação é obrigatória';
      isValid = false;
    }
    if (!formData.tokenPrice.trim()) {
      newErrors.tokenPrice = 'Preço do token é obrigatório';
      isValid = false;
    }

    // Fases de Venda (pelo menos uma deve estar habilitada)
    const { privateSale, whitelist, publicSale, publicSale02, publicSale03 } = formData.salePhases;
    if (!privateSale.enabled && !whitelist.enabled && !publicSale.enabled && !publicSale02.enabled && !publicSale03.enabled) {
      newErrors.salePhases = 'Pelo menos uma fase de venda deve estar habilitada';
      isValid = false;
    }

    // Sistema de Custódia
    if (!formData.escrowWalletAddress.trim()) {
      newErrors.escrowWalletAddress = 'Endereço da carteira de custódia é obrigatório';
      isValid = false;
    }
    if (!formData.tokenDepositConfirmed) {
      newErrors.tokenDepositConfirmed = 'Confirmação do depósito de tokens é obrigatória';
      isValid = false;
    }

    if (!formData.escrowTermsAccepted) {
      newErrors.escrowTermsAccepted = 'Aceitar os termos de custódia é obrigatório';
      isValid = false;
    }



    // Taxa de Listagem
    if (!formData.listingFeeTransactionHash.trim()) {
      newErrors.listingFeeTransactionHash = 'Hash da transação da taxa de listagem é obrigatório';
      isValid = false;
    }
    if (!formData.listingFeeConfirmed) {
      newErrors.listingFeeConfirmed = 'Confirmação do pagamento da taxa é obrigatória';
      isValid = false;
    }

    // LaunchPool (se habilitado)
    if (formData.launchPoolEnabled) {
      if (!formData.launchPoolAllocation.trim()) {
        newErrors.launchPoolAllocation = 'Alocação do LaunchPool é obrigatória';
        isValid = false;
      }
      if (!formData.launchPoolDuration.trim()) {
        newErrors.launchPoolDuration = 'Duração do LaunchPool é obrigatória';
        isValid = false;
      }
      if (!formData.launchPoolMinStake.trim()) {
        newErrors.launchPoolMinStake = 'Stake mínimo é obrigatório';
        isValid = false;
      }
      if (!formData.launchPoolRewards.trim()) {
        newErrors.launchPoolRewards = 'Recompensas do LaunchPool são obrigatórias';
        isValid = false;
      }
    }

    // Raffle (se habilitado)
    if (formData.raffleEnabled) {
      if (!formData.raffleTicketPrice.trim()) {
        newErrors.raffleTicketPrice = 'Preço do ticket é obrigatório';
        isValid = false;
      }
      if (!formData.raffleMaxTickets.trim()) {
        newErrors.raffleMaxTickets = 'Número máximo de tickets é obrigatório';
        isValid = false;
      }
      if (!formData.rafflePrizePool.trim()) {
        newErrors.rafflePrizePool = 'Pool de prêmios é obrigatório';
        isValid = false;
      }
      if (!formData.raffleDrawDate.trim()) {
        newErrors.raffleDrawDate = 'Data do sorteio é obrigatória';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    // Validar todos os requisitos antes de submeter
    if (!validateAllRequirements()) {
      showError(
        'Campos obrigatórios não preenchidos',
        {
          message: 'Por favor, preencha todos os campos obrigatórios antes de continuar.'
        }
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implementar chamada para API
      console.log('Dados do projeto:', formData);
      
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess(
        'Projeto criado com sucesso!',
        {
          message: 'Seu projeto foi submetido para análise e será listado em breve.'
        }
      );
      
      // Redirecionar para lista de projetos
      navigate('/listar-projeto');
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      showError(
        'Erro ao criar projeto',
        {
          message: 'Ocorreu um erro inesperado. Tente novamente.'
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };



  /**
   * Renderiza um campo de input com limite de caracteres
   */
  const renderInput = (
    field: keyof ProjectFormData,
    label: string,
    type: string = 'text',
    placeholder?: string,
    required: boolean = true,
    maxLength?: number
  ) => {
    const currentValue = formData[field] as string;
    const currentLength = currentValue?.length || 0;
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={type}
          value={currentValue}
          onChange={(e) => updateFormData(field, e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors ${
            errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-grafite-600'
          }`}
        />
        {maxLength && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentLength}/{maxLength} caracteres
            </span>
            {currentLength > maxLength * 0.9 && (
              <span className="text-xs text-laranja-500">
                Limite quase atingido
              </span>
            )}
          </div>
        )}
        {errors[field] && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircleIcon className="w-4 h-4 mr-1" />
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  /**
   * Renderiza um campo de textarea com limite de caracteres
   */
  const renderTextarea = (
    field: keyof ProjectFormData,
    label: string,
    placeholder?: string,
    rows: number = 4,
    required: boolean = true,
    maxLength?: number
  ) => {
    const currentValue = formData[field] as string;
    const currentLength = currentValue?.length || 0;
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          rows={rows}
          value={currentValue}
          onChange={(e) => updateFormData(field, e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-roxo-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors resize-none ${
            errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-grafite-600'
          }`}
        />
        {maxLength && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentLength}/{maxLength} caracteres
            </span>
            {currentLength > maxLength * 0.9 && (
              <span className="text-xs text-laranja-500">
                Limite quase atingido
              </span>
            )}
          </div>
        )}
        {errors[field] && (
          <p className="text-sm text-red-500 flex items-center">
            <AlertCircleIcon className="w-4 h-4 mr-1" />
            {errors[field]}
          </p>
        )}
      </div>
    );
  };

  /**
   * Renderiza um campo de upload de arquivo
   */
  /**
   * Renderiza campo de input para links de documentação
   */
  const renderLinkInput = (
    field: 'whitepaperUrl' | 'roadmapUrl',
    label: string,
    placeholder: string
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="relative">
        <LinkIconComponent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="url"
          value={formData[field]}
          onChange={(e) => updateFormData(field, e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-lunes-500 transition-colors ${
            errors[field]
              ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 dark:border-grafite-600 bg-white dark:bg-grafite-700 text-gray-900 dark:text-white'
          }`}
        />
      </div>
      {errors[field] && (
        <p className="text-sm text-red-500 flex items-center">
          <AlertCircleIcon className="w-4 h-4 mr-1" />
          {errors[field]}
        </p>
      )}
    </div>
  );

  /**
   * Renderiza campo de upload de arquivo
   */
  const renderFileUpload = (
    field: 'logo' | 'banner' | 'tokenSymbolImage' | 'thumbnailImage',
    label: string,
    description?: string,
    accept: string = 'image/*'
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      )}
      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        errors[field] 
          ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
          : 'border-gray-300 dark:border-grafite-600 hover:border-lunes-500 dark:hover:border-lunes-400'
      }`}>
        <input
          type="file"
          accept={accept}
          onChange={(e) => updateFormData(field, e.target.files?.[0] || null)}
          className="hidden"
          id={`upload-${field}`}
        />
        <label htmlFor={`upload-${field}`} className="cursor-pointer">
          <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          {formData[field] ? (
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                {(formData[field] as File).name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Clique para alterar o arquivo
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Clique para fazer upload
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {accept === 'image/*' ? 'PNG, JPG ou SVG até 5MB' : 'PDF, DOC ou DOCX até 10MB'}
              </p>
            </div>
          )}
        </label>
      </div>
      {errors[field] && (
        <p className="text-sm text-red-500 flex items-center">
          <AlertCircleIcon className="w-4 h-4 mr-1" />
          {errors[field]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-grafite-900">
      {/* Header */}
      <div className="bg-white dark:bg-grafite-800 border-b border-gray-200 dark:border-grafite-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/listar-projeto')}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Criar Novo Projeto
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Passo {currentStep} de {totalSteps}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-grafite-800 rounded-lg shadow-sm border border-gray-200 dark:border-grafite-700">
          <div className="p-8">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                {Array.from({ length: totalSteps }, (_, index) => {
                  const stepNumber = index + 1;
                  const isActive = stepNumber === currentStep;
                  const isCompleted = stepNumber < currentStep;
                  
                  return (
                    <React.Fragment key={stepNumber}>
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                        isCompleted 
                          ? 'bg-lunes-500 border-lunes-500 text-white'
                          : isActive 
                          ? 'border-lunes-500 text-lunes-500 bg-white dark:bg-grafite-800'
                          : 'border-gray-300 dark:border-grafite-600 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircleIcon className="w-5 h-5" />
                        ) : (
                          <span className="text-sm font-medium">{stepNumber}</span>
                        )}
                      </div>
                      {stepNumber < totalSteps && (
                        <div className={`w-16 h-0.5 mx-2 ${
                          stepNumber < currentStep ? 'bg-lunes-500' : 'bg-gray-300 dark:bg-grafite-600'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Etapa {currentStep} de {totalSteps}: {stepLabels[currentStep - 1]}
                </p>
              </div>
            </div>

            {/* Step 1: Informações Básicas */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Informações Básicas
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Conte-nos sobre seu projeto e sua visão
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {renderInput('name', 'Nome do Projeto', 'text', 'Ex: DeFi Protocol X', true, 100)}
                {renderTextarea('description', 'Descrição do Projeto', 'Descreva seu projeto, sua proposta de valor e objetivos...', 6, true, 500)}
                {renderInput('website', 'Website Oficial', 'url', 'https://seusite.com', true, 200)}
                </div>

                {/* Upload de Imagens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {renderFileUpload('tokenSymbolImage', 'Símbolo do Token', 'Imagem que será o avatar do projeto nos cards')}
                  {renderFileUpload('thumbnailImage', 'Thumbnail do Projeto', 'Imagem que aparecerá no topo da página de vendas')}
                </div>
              </motion.div>
            )}

            {/* Step 2: Links Sociais e Documentação */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Links Sociais e Documentação
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Conecte suas redes sociais e faça upload da documentação
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('twitter', 'Twitter', 'url', 'https://twitter.com/seuprojeto', true, 200)}
                {renderInput('telegram', 'Telegram', 'url', 'https://t.me/seuprojeto', true, 200)}
                {renderInput('discord', 'Discord', 'url', 'https://discord.gg/seuprojeto', false, 200)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  {renderLinkInput('whitepaperUrl', 'Whitepaper', 'https://exemplo.com/whitepaper.pdf')}
                {renderLinkInput('roadmapUrl', 'Roadmap', 'https://exemplo.com/roadmap.pdf')}
                </div>
              </motion.div>
            )}

            {/* Step 3: Configuração de Token */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Configuração de Token PSP22
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Configure os detalhes do seu token e estratégia de captação
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('tokenSymbol', 'Símbolo do Token', 'text', 'Ex: DPX', true, 10)}
                {renderInput('tokenName', 'Nome do Token', 'text', 'Ex: DeFi Protocol X Token', true, 50)}
                {renderInput('totalSupply', 'Supply Total', 'number', 'Ex: 1000000')}
                {renderInput('fundraisingGoal', 'Valor para Captação (LUSD)', 'number', 'Ex: 500000')}
                {renderInput('tokenPrice', 'Preço do Token (LUSD)', 'number', 'Ex: 0.50')}
                </div>

                {/* Endereço do Contrato do Token */}
                <div className="space-y-4">
                  {renderInput('tokenContractAddress', 'Endereço do Contrato do Token', 'text', '0x...', true, 42)}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Informe o endereço do contrato inteligente do seu token na blockchain.
                  </p>
                </div>

                <div className="bg-roxo-50 dark:bg-roxo-900/20 border border-roxo-200 dark:border-roxo-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <InfoIcon className="w-5 h-5 text-roxo-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-roxo-700 dark:text-roxo-300">
                      <p className="font-medium mb-1">Informações sobre Depósito em Custódia:</p>
                      <p>Os tokens para captação e airdrop devem ser depositados em custódia antes da publicação do projeto. Isso garante a segurança dos investidores.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Fases de Venda */}
             {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Fases de Venda
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Configure as diferentes fases de venda do seu token
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Venda Fechada (Private Sale) */}
                  <div className="border border-gray-200 dark:border-grafite-600 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="privateSaleEnabled"
                        checked={formData.salePhases.privateSale.enabled}
                        onChange={(e) => {
                          const newSalePhases = { ...formData.salePhases };
                          newSalePhases.privateSale.enabled = e.target.checked;
                          updateFormData('salePhases', newSalePhases);
                        }}
                        className="w-4 h-4 text-lunes-500 border-gray-300 rounded focus:ring-lunes-500"
                      />
                      <label htmlFor="privateSaleEnabled" className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                        Venda Fechada (Private Sale)
                      </label>
                    </div>
                    
                    {formData.salePhases.privateSale.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Data de Início *
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.salePhases.privateSale.startDate}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.privateSale.startDate = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Data de Fim *
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.salePhases.privateSale.endDate}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.privateSale.endDate = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Preço do Token (LUSD) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.salePhases.privateSale.tokenPrice}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.privateSale.tokenPrice = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 0.30"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Alocação Máxima
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.privateSale.maxAllocation}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.privateSale.maxAllocation = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 100000"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Investimento Mínimo (LUSD)
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.privateSale.minInvestment}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.privateSale.minInvestment = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 1000"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Investimento Máximo (LUSD)
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.privateSale.maxInvestment}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.privateSale.maxInvestment = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 50000"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Whitelist */}
                  <div className="border border-gray-200 dark:border-grafite-600 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="whitelistEnabled"
                        checked={formData.salePhases.whitelist.enabled}
                        onChange={(e) => {
                          const newSalePhases = { ...formData.salePhases };
                          newSalePhases.whitelist.enabled = e.target.checked;
                          updateFormData('salePhases', newSalePhases);
                        }}
                        className="w-4 h-4 text-lunes-500 border-gray-300 rounded focus:ring-lunes-500"
                      />
                      <label htmlFor="whitelistEnabled" className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                        Whitelist
                      </label>
                    </div>
                    
                    {formData.salePhases.whitelist.enabled && (
                      <div className="space-y-4 ml-7">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Data de Início *
                            </label>
                            <input
                              type="datetime-local"
                              value={formData.salePhases.whitelist.startDate}
                              onChange={(e) => {
                                const newSalePhases = { ...formData.salePhases };
                                newSalePhases.whitelist.startDate = e.target.value;
                                updateFormData('salePhases', newSalePhases);
                              }}
                              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Data de Fim *
                            </label>
                            <input
                              type="datetime-local"
                              value={formData.salePhases.whitelist.endDate}
                              onChange={(e) => {
                                const newSalePhases = { ...formData.salePhases };
                                newSalePhases.whitelist.endDate = e.target.value;
                                updateFormData('salePhases', newSalePhases);
                              }}
                              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Preço do Token (LUSD) *
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.salePhases.whitelist.tokenPrice}
                              onChange={(e) => {
                                const newSalePhases = { ...formData.salePhases };
                                newSalePhases.whitelist.tokenPrice = e.target.value;
                                updateFormData('salePhases', newSalePhases);
                              }}
                              placeholder="Ex: 0.40"
                              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Alocação Máxima
                            </label>
                            <input
                              type="number"
                              value={formData.salePhases.whitelist.maxAllocation}
                              onChange={(e) => {
                                const newSalePhases = { ...formData.salePhases };
                                newSalePhases.whitelist.maxAllocation = e.target.value;
                                updateFormData('salePhases', newSalePhases);
                              }}
                              placeholder="Ex: 200000"
                              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Investimento Mínimo (LUSD)
                            </label>
                            <input
                              type="number"
                              value={formData.salePhases.whitelist.minInvestment}
                              onChange={(e) => {
                                const newSalePhases = { ...formData.salePhases };
                                newSalePhases.whitelist.minInvestment = e.target.value;
                                updateFormData('salePhases', newSalePhases);
                              }}
                              placeholder="Ex: 100"
                              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Investimento Máximo (LUSD)
                            </label>
                            <input
                              type="number"
                              value={formData.salePhases.whitelist.maxInvestment}
                              onChange={(e) => {
                                const newSalePhases = { ...formData.salePhases };
                                newSalePhases.whitelist.maxInvestment = e.target.value;
                                updateFormData('salePhases', newSalePhases);
                              }}
                              placeholder="Ex: 10000"
                              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                            />
                          </div>
                        </div>

                      </div>
                    )}
                  </div>

                  {/* Venda Pública */}
                  <div className="border border-gray-200 dark:border-grafite-600 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="publicSaleEnabled"
                        checked={formData.salePhases.publicSale.enabled}
                        onChange={(e) => {
                          const newSalePhases = { ...formData.salePhases };
                          newSalePhases.publicSale.enabled = e.target.checked;
                          updateFormData('salePhases', newSalePhases);
                        }}
                        className="w-4 h-4 text-lunes-500 border-gray-300 rounded focus:ring-lunes-500"
                      />
                      <label htmlFor="publicSaleEnabled" className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                        Venda Pública
                      </label>
                    </div>
                    
                    {formData.salePhases.publicSale.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Data de Início *
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.salePhases.publicSale.startDate}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale.startDate = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Data de Fim *
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.salePhases.publicSale.endDate}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale.endDate = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Preço do Token (LUSD) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.salePhases.publicSale.tokenPrice}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale.tokenPrice = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 0.50"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Alocação Máxima
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.publicSale.maxAllocation}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale.maxAllocation = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 500000"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Investimento Mínimo (LUSD)
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.publicSale.minInvestment}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale.minInvestment = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 10"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Investimento Máximo (LUSD)
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.publicSale.maxInvestment}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale.maxInvestment = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 5000"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Venda Pública 02 */}
                  <div className="border border-gray-200 dark:border-grafite-600 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="publicSale02Enabled"
                        checked={formData.salePhases.publicSale02.enabled}
                        onChange={(e) => {
                          const newSalePhases = { ...formData.salePhases };
                          newSalePhases.publicSale02.enabled = e.target.checked;
                          updateFormData('salePhases', newSalePhases);
                        }}
                        className="w-4 h-4 text-lunes-500 border-gray-300 rounded focus:ring-lunes-500"
                      />
                      <label htmlFor="publicSale02Enabled" className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                        Venda Pública 02
                      </label>
                    </div>
                    
                    {formData.salePhases.publicSale02.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Data de Início *
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.salePhases.publicSale02.startDate}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale02.startDate = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Data de Fim *
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.salePhases.publicSale02.endDate}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale02.endDate = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Preço do Token (LUSD) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.salePhases.publicSale02.tokenPrice}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale02.tokenPrice = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 0.50"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Alocação Máxima
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.publicSale02.maxAllocation}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale02.maxAllocation = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 500000"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Investimento Mínimo (LUSD)
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.publicSale02.minInvestment}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale02.minInvestment = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 10"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Investimento Máximo (LUSD)
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.publicSale02.maxInvestment}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale02.maxInvestment = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 5000"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Venda Pública 03 */}
                  <div className="border border-gray-200 dark:border-grafite-600 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="publicSale03Enabled"
                        checked={formData.salePhases.publicSale03.enabled}
                        onChange={(e) => {
                          const newSalePhases = { ...formData.salePhases };
                          newSalePhases.publicSale03.enabled = e.target.checked;
                          updateFormData('salePhases', newSalePhases);
                        }}
                        className="w-4 h-4 text-lunes-500 border-gray-300 rounded focus:ring-lunes-500"
                      />
                      <label htmlFor="publicSale03Enabled" className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                        Venda Pública 03
                      </label>
                    </div>
                    
                    {formData.salePhases.publicSale03.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Data de Início *
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.salePhases.publicSale03.startDate}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale03.startDate = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Data de Fim *
                          </label>
                          <input
                            type="datetime-local"
                            value={formData.salePhases.publicSale03.endDate}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale03.endDate = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Preço do Token (LUSD) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.salePhases.publicSale03.tokenPrice}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale03.tokenPrice = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 0.50"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Alocação Máxima
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.publicSale03.maxAllocation}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale03.maxAllocation = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 500000"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Investimento Mínimo (LUSD)
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.publicSale03.minInvestment}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale03.minInvestment = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 10"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Investimento Máximo (LUSD)
                          </label>
                          <input
                            type="number"
                            value={formData.salePhases.publicSale03.maxInvestment}
                            onChange={(e) => {
                              const newSalePhases = { ...formData.salePhases };
                              newSalePhases.publicSale03.maxInvestment = e.target.value;
                              updateFormData('salePhases', newSalePhases);
                            }}
                            placeholder="Ex: 5000"
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-lunes-500 focus:border-transparent bg-white dark:bg-grafite-700 text-gray-900 dark:text-white transition-colors border-gray-300 dark:border-grafite-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-roxo-50 dark:bg-roxo-900/20 border border-roxo-200 dark:border-roxo-800 rounded-lg p-4">
                  <div className="flex items-start">
                    <InfoIcon className="w-5 h-5 text-roxo-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div className="text-sm text-roxo-700 dark:text-roxo-300">
                      <p className="font-medium mb-1">Informações sobre Fases de Venda:</p>
                        <p>Configure diferentes fases para maximizar sua captação. A venda fechada oferece preços menores para grandes investidores, a whitelist para comunidade engajada, e as vendas públicas para acesso geral com diferentes condições.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: LaunchPool e Raffle */}
             {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Sistema de Custódia
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Deposite os tokens em custódia para garantir a segurança dos investidores
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Endereço da Carteira de Custódia */}
                  {renderInput('escrowWalletAddress', 'Endereço da Carteira de Custódia', 'text', '0x...')}

                  {/* Informações sobre Depósitos */}
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start">
                      <AlertCircleIcon className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">
                        <p className="font-medium mb-2">Depósitos Obrigatórios:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Tokens para captação: {formData.fundraisingGoal || '0'} tokens</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Confirmações de Depósito */}
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="tokenDepositConfirmed"
                        checked={formData.tokenDepositConfirmed}
                        onChange={(e) => updateFormData('tokenDepositConfirmed', e.target.checked)}
                        className={`w-4 h-4 text-lunes-500 border-gray-300 rounded focus:ring-lunes-500 mt-1 ${
                          errors.tokenDepositConfirmed ? 'border-red-500' : ''
                        }`}
                      />
                      <div className="ml-3">
                        <label htmlFor="tokenDepositConfirmed" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confirmo que depositei os tokens para captação na carteira de custódia
                        </label>
                        {errors.tokenDepositConfirmed && (
                          <p className="text-sm text-red-500 mt-1 flex items-center">
                            <AlertCircleIcon className="w-4 h-4 mr-1" />
                            {errors.tokenDepositConfirmed}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="escrowTermsAccepted"
                        checked={formData.escrowTermsAccepted}
                        onChange={(e) => updateFormData('escrowTermsAccepted', e.target.checked)}
                        className={`w-4 h-4 text-lunes-500 border-gray-300 rounded focus:ring-lunes-500 mt-1 ${
                          errors.escrowTermsAccepted ? 'border-red-500' : ''
                        }`}
                      />
                      <div className="ml-3">
                        <label htmlFor="escrowTermsAccepted" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Aceito os termos e condições do sistema de custódia
                        </label>
                        {errors.escrowTermsAccepted && (
                          <p className="text-sm text-red-500 mt-1 flex items-center">
                            <AlertCircleIcon className="w-4 h-4 mr-1" />
                            {errors.escrowTermsAccepted}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informações de Segurança */}
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-start">
                      <ShieldIcon className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-green-700 dark:text-green-300">
                        <p className="font-medium mb-1">Segurança Garantida:</p>
                        <p>Os tokens depositados em custódia são protegidos por contratos inteligentes auditados e só podem ser liberados após o cumprimento das condições estabelecidas.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Sistema de Custódia */}
            {currentStep === 6 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    LaunchPool e Sistema de Raffle
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Configure recursos adicionais para engajamento da comunidade
                  </p>
                </div>

                <div className="space-y-6">
                  {/* LaunchPool Configuration */}
                  <div className="bg-gradient-to-r from-roxo-50 to-verde-50 dark:from-roxo-900/20 dark:to-verde-900/20 border border-roxo-200 dark:border-roxo-800 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="launchPoolEnabled"
                          checked={formData.launchPoolEnabled}
                          onChange={(e) => updateFormData('launchPoolEnabled', e.target.checked)}
                          className="w-4 h-4 text-lunes-500 border-gray-300 rounded focus:ring-lunes-500"
                        />
                        <label htmlFor="launchPoolEnabled" className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                          Habilitar LaunchPool
                        </label>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      O LaunchPool permite que usuários façam stake de tokens para ganhar recompensas do seu projeto.
                    </p>

                    {formData.launchPoolEnabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderInput('launchPoolAllocation', 'Alocação Total (%)', 'number', 'Ex: 10')}
                          {renderInput('launchPoolDuration', 'Duração (dias)', 'number', 'Ex: 30')}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderInput('launchPoolMinStake', 'Stake Mínimo', 'number', 'Ex: 100')}
                          {renderInput('launchPoolRewards', 'Recompensas Totais', 'number', 'Ex: 50000')}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Raffle Configuration */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="raffleEnabled"
                          checked={formData.raffleEnabled}
                          onChange={(e) => updateFormData('raffleEnabled', e.target.checked)}
                          className="w-4 h-4 text-lunes-500 border-gray-300 rounded focus:ring-lunes-500"
                        />
                        <label htmlFor="raffleEnabled" className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                          Habilitar Sistema de Raffle
                        </label>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      O sistema de raffle permite que usuários comprem tickets para concorrer a prêmios especiais.
                    </p>

                    {formData.raffleEnabled && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderInput('raffleTicketPrice', 'Preço do Ticket', 'number', 'Ex: 10')}
                          {renderInput('raffleMaxTickets', 'Máximo de Tickets', 'number', 'Ex: 1000')}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {renderInput('rafflePrizePool', 'Pool de Prêmios', 'number', 'Ex: 10000')}
                          {renderInput('raffleDrawDate', 'Data do Sorteio', 'datetime-local')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 7: Revisão e Finalização */}
             {currentStep === 7 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Revisão e Finalização
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Revise todas as informações antes de submeter seu projeto
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Taxa de Listagem */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <DollarSignIcon className="w-6 h-6 text-yellow-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Taxa de Listagem - 1000 Lunes + 100 LUSDT
                      </h3>
                    </div>
                    
                    <div className="mb-4 p-4 bg-white dark:bg-grafite-800 rounded-lg border border-gray-200 dark:border-grafite-600">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        Para listar seu projeto no Lunes Launchpad, é necessário pagar uma taxa de listagem de 1000 Lunes + 100 LUSDT.
                      </p>
                      <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                        <li>• Taxa única e não reembolsável</li>
                        <li>• Pagamento em Lunes e LUSDT (Lunes Dollar)</li>
                        <li>• Necessário para ativação do projeto</li>
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Método de Pagamento
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="listingFeePaymentMethod"
                              value="wallet"
                              checked={formData.listingFeePaymentMethod === 'wallet'}
                              onChange={(e) => updateFormData('listingFeePaymentMethod', e.target.value)}
                              className="w-4 h-4 text-lunes-500 border-gray-300 focus:ring-lunes-500"
                            />
                            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                              Pagamento direto da carteira
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="listingFeePaymentMethod"
                              value="custody"
                              checked={formData.listingFeePaymentMethod === 'custody'}
                              onChange={(e) => updateFormData('listingFeePaymentMethod', e.target.value)}
                              className="w-4 h-4 text-lunes-500 border-gray-300 focus:ring-lunes-500"
                            />
                            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                              Desconto da custódia (se houver saldo suficiente)
                            </span>
                          </label>
                        </div>
                      </div>

                      {renderInput(
                        'listingFeeTransactionHash',
                        'Hash da Transação de Pagamento',
                        'text',
                        'Ex: 0x1234567890abcdef...',
                        true
                      )}

                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="listingFeeConfirmed"
                          checked={formData.listingFeeConfirmed}
                          onChange={(e) => updateFormData('listingFeeConfirmed', e.target.checked)}
                          className={`w-4 h-4 text-lunes-500 border-gray-300 rounded focus:ring-lunes-500 mt-1 ${
                            errors.listingFeeConfirmed ? 'border-red-500' : ''
                          }`}
                        />
                        <div className="ml-3">
                          <label htmlFor="listingFeeConfirmed" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirmo que realizei o pagamento da taxa de listagem de 1000 Lunes + 100 LUSDT
                          </label>
                          {errors.listingFeeConfirmed && (
                            <p className="text-sm text-red-500 mt-1 flex items-center">
                              <AlertCircleIcon className="w-4 h-4 mr-1" />
                              {errors.listingFeeConfirmed}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Checklist de Validação */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Checklist de Validação
                      </h3>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Informações Básicas */}
                      <div className="flex items-center space-x-3">
                        {formData.name && formData.description && formData.category ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          formData.name && formData.description && formData.category
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          Informações básicas completas (nome, descrição, categoria)
                        </span>
                      </div>

                      {/* Links Sociais */}
                      <div className="flex items-center space-x-3">
                        {formData.website || formData.twitter || formData.discord || formData.telegram ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircleIcon className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          formData.website || formData.twitter || formData.discord || formData.telegram
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-yellow-700 dark:text-yellow-300'
                        }`}>
                          Pelo menos um link social configurado (recomendado)
                        </span>
                      </div>

                      {/* Documentação */}
                      <div className="flex items-center space-x-3">
                        {formData.whitepaperUrl && formData.roadmapUrl ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          formData.whitepaperUrl && formData.roadmapUrl
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          Documentação obrigatória (whitepaper e roadmap)
                        </span>
                      </div>

                      {/* Configuração de Token */}
                      <div className="flex items-center space-x-3">
                        {formData.tokenName && formData.tokenSymbol && formData.totalSupply && formData.fundraisingGoal && formData.tokenPrice ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          formData.tokenName && formData.tokenSymbol && formData.totalSupply && formData.fundraisingGoal && formData.tokenPrice
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          Configuração de token PSP22 completa
                        </span>
                      </div>

                      {/* Fases de Venda */}
                      <div className="flex items-center space-x-3">
                        {(formData.salePhases.privateSale.enabled || formData.salePhases.whitelist.enabled || formData.salePhases.publicSale.enabled) ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          (formData.salePhases.privateSale.enabled || formData.salePhases.whitelist.enabled || formData.salePhases.publicSale.enabled)
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          Pelo menos uma fase de venda configurada
                        </span>
                      </div>

                      {/* Sistema de Custódia */}
                      <div className="flex items-center space-x-3">
                        {formData.escrowWalletAddress && formData.tokenDepositConfirmed && formData.escrowTermsAccepted ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          formData.escrowWalletAddress && formData.tokenDepositConfirmed && formData.escrowTermsAccepted
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          Sistema de custódia configurado e tokens depositados
                        </span>
                      </div>



                      {/* Taxa de Listagem */}
                      <div className="flex items-center space-x-3">
                        {formData.listingFeeTransactionHash && formData.listingFeeConfirmed ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${
                          formData.listingFeeTransactionHash && formData.listingFeeConfirmed
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          Taxa de listagem paga e confirmada
                        </span>
                      </div>

                      {/* LaunchPool (se habilitado) */}
                      {formData.launchPoolEnabled && (
                        <div className="flex items-center space-x-3">
                          {formData.launchPoolAllocation && formData.launchPoolDuration && formData.launchPoolMinStake && formData.launchPoolRewards ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${
                            formData.launchPoolAllocation && formData.launchPoolDuration && formData.launchPoolMinStake && formData.launchPoolRewards
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-red-700 dark:text-red-300'
                          }`}>
                            LaunchPool configurado completamente
                          </span>
                        </div>
                      )}

                      {/* Raffle (se habilitado) */}
                      {formData.raffleEnabled && (
                        <div className="flex items-center space-x-3">
                          {formData.raffleTicketPrice && formData.raffleMaxTickets && formData.rafflePrizePool && formData.raffleDrawDate ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <AlertCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${
                            formData.raffleTicketPrice && formData.raffleMaxTickets && formData.rafflePrizePool && formData.raffleDrawDate
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-red-700 dark:text-red-300'
                          }`}>
                            Sistema de Raffle configurado completamente
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Resumo do Projeto */}
                  <div className="bg-gray-50 dark:bg-grafite-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo do Projeto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Nome:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{formData.name || 'Não informado'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Token:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{formData.tokenSymbol || 'Não informado'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Supply Total:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{formData.totalSupply || 'Não informado'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Meta de Captação:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{formData.fundraisingGoal || 'Não informado'} LUSD</span>
                      </div>

                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Taxa de Listagem:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{formData.listingFeeAmount} LUSD</span>
                      </div>
                      {formData.launchPoolEnabled && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">LaunchPool:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">Habilitado ({formData.launchPoolAllocation || 'N/A'} tokens)</span>
                        </div>
                      )}
                      {formData.raffleEnabled && (
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Raffle:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">Habilitado ({formData.rafflePrizePool || 'N/A'} LUSD)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-roxo-50 dark:bg-roxo-900/20 border border-roxo-200 dark:border-roxo-800 rounded-lg p-4">
                    <div className="flex items-start">
                      <InfoIcon className="w-5 h-5 text-roxo-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="text-sm text-roxo-700 dark:text-roxo-300">
                        <p className="font-medium mb-1">Próximos Passos:</p>
                        <p>Após submeter, seu projeto passará por análise da equipe Lunes. Você receberá um email com o resultado em até 5 dias úteis.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Botões de Navegação */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200 dark:border-grafite-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 dark:border-grafite-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-grafite-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </motion.button>

              {currentStep < totalSteps ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={nextStep}
                  className="px-6 py-3 bg-lunes-500 hover:bg-lunes-600 text-white font-medium rounded-lg transition-colors"
                >
                  Próximo
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-lunes-500 hover:bg-lunes-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando Projeto...
                    </>
                  ) : (
                    'Criar Projeto'
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateProjectPage;