import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, ExternalLink, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

// Schema de validação para o formulário de inscrição
const projectSubmissionSchema = z.object({
  // Informações básicas do projeto
  projectName: z.string().min(3, 'Nome do projeto deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
  description: z.string().min(50, 'Descrição deve ter pelo menos 50 caracteres').max(1000, 'Descrição muito longa'),
  
  // Links sociais e documentação
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  twitter: z.string().url('URL do Twitter inválida').optional().or(z.literal('')),
  telegram: z.string().url('URL do Telegram inválida').optional().or(z.literal('')),
  discord: z.string().url('URL do Discord inválida').optional().or(z.literal('')),
  github: z.string().url('URL do GitHub inválida').optional().or(z.literal('')),
  
  // Documentação técnica
  whitepaper: z.string().url('URL do whitepaper inválida'),
  roadmap: z.string().url('URL do roadmap inválida'),
  
  // Lunes SafeGuard - Campo obrigatório
  safeguardHash: z.string().min(64, 'Hash da garantia SafeGuard deve ter pelo menos 64 caracteres').max(66, 'Hash inválido'),
  
  // Configuração de tokens PSP22
  tokenName: z.string().min(2, 'Nome do token deve ter pelo menos 2 caracteres'),
  tokenSymbol: z.string().min(2, 'Símbolo do token deve ter pelo menos 2 caracteres').max(10, 'Símbolo muito longo'),
  totalSupply: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Supply total deve ser um número positivo'),
  tokenPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Preço do token deve ser um número positivo'),
  
  // Configuração de captação
  fundraisingGoal: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Meta de captação deve ser um número positivo'),
  
  // Taxa de listagem em LUSD
  listingFee: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 100, 'Taxa mínima de listagem é 100 LUSD'),
});

type ProjectSubmissionFormData = z.infer<typeof projectSubmissionSchema>;

interface ProjectSubmissionFormProps {
  onSubmit: (data: ProjectSubmissionFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ProjectSubmissionForm({ onSubmit, isLoading = false }: ProjectSubmissionFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useForm<ProjectSubmissionFormData>({
    resolver: zodResolver(projectSubmissionSchema),
    mode: 'onChange',
    defaultValues: {
      listingFee: '100', // Taxa mínima padrão
    },
  });

  const watchedValues = watch();

  const handleNextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof ProjectSubmissionFormData)[] => {
    switch (step) {
      case 1:
        return ['projectName', 'description', 'website'];
      case 2:
        return ['twitter', 'telegram', 'discord', 'github', 'whitepaper', 'roadmap'];
      case 3:
        return ['tokenName', 'tokenSymbol', 'totalSupply', 'tokenPrice', 'fundraisingGoal'];
      case 4:
        return ['safeguardHash', 'listingFee'];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Nome do Projeto *</Label>
              <Input
                id="projectName"
                placeholder="Ex: Meu Projeto DeFi"
                {...register('projectName')}
                className={cn(errors.projectName && 'border-red-500')}
              />
              {errors.projectName && (
                <p className="text-sm text-red-500">{errors.projectName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Projeto *</Label>
              <Textarea
                id="description"
                placeholder="Descreva seu projeto, seus objetivos e como ele beneficiará a comunidade..."
                rows={4}
                {...register('description')}
                className={cn(errors.description && 'border-red-500')}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
              <p className="text-sm text-gray-500">
                {watchedValues.description?.length || 0}/1000 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://meusite.com"
                {...register('website')}
                className={cn(errors.website && 'border-red-500')}
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  type="url"
                  placeholder="https://twitter.com/meuprojeto"
                  {...register('twitter')}
                  className={cn(errors.twitter && 'border-red-500')}
                />
                {errors.twitter && (
                  <p className="text-sm text-red-500">{errors.twitter.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegram">Telegram</Label>
                <Input
                  id="telegram"
                  type="url"
                  placeholder="https://t.me/meuprojeto"
                  {...register('telegram')}
                  className={cn(errors.telegram && 'border-red-500')}
                />
                {errors.telegram && (
                  <p className="text-sm text-red-500">{errors.telegram.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord">Discord</Label>
                <Input
                  id="discord"
                  type="url"
                  placeholder="https://discord.gg/meuprojeto"
                  {...register('discord')}
                  className={cn(errors.discord && 'border-red-500')}
                />
                {errors.discord && (
                  <p className="text-sm text-red-500">{errors.discord.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  type="url"
                  placeholder="https://github.com/meuprojeto"
                  {...register('github')}
                  className={cn(errors.github && 'border-red-500')}
                />
                {errors.github && (
                  <p className="text-sm text-red-500">{errors.github.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whitepaper">Whitepaper *</Label>
                <Input
                  id="whitepaper"
                  type="url"
                  placeholder="https://docs.meuprojeto.com/whitepaper.pdf"
                  {...register('whitepaper')}
                  className={cn(errors.whitepaper && 'border-red-500')}
                />
                {errors.whitepaper && (
                  <p className="text-sm text-red-500">{errors.whitepaper.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roadmap">Roadmap *</Label>
                <Input
                  id="roadmap"
                  type="url"
                  placeholder="https://docs.meuprojeto.com/roadmap.pdf"
                  {...register('roadmap')}
                  className={cn(errors.roadmap && 'border-red-500')}
                />
                {errors.roadmap && (
                  <p className="text-sm text-red-500">{errors.roadmap.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tokenName">Nome do Token *</Label>
                <Input
                  id="tokenName"
                  placeholder="Ex: Meu Token"
                  {...register('tokenName')}
                  className={cn(errors.tokenName && 'border-red-500')}
                />
                {errors.tokenName && (
                  <p className="text-sm text-red-500">{errors.tokenName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenSymbol">Símbolo do Token *</Label>
                <Input
                  id="tokenSymbol"
                  placeholder="Ex: MTK"
                  {...register('tokenSymbol')}
                  className={cn(errors.tokenSymbol && 'border-red-500')}
                />
                {errors.tokenSymbol && (
                  <p className="text-sm text-red-500">{errors.tokenSymbol.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSupply">Supply Total *</Label>
                <Input
                  id="totalSupply"
                  type="number"
                  placeholder="1000000"
                  {...register('totalSupply')}
                  className={cn(errors.totalSupply && 'border-red-500')}
                />
                {errors.totalSupply && (
                  <p className="text-sm text-red-500">{errors.totalSupply.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tokenPrice">Preço do Token (LUSD) *</Label>
                <Input
                  id="tokenPrice"
                  type="number"
                  step="0.01"
                  placeholder="0.10"
                  {...register('tokenPrice')}
                  className={cn(errors.tokenPrice && 'border-red-500')}
                />
                {errors.tokenPrice && (
                  <p className="text-sm text-red-500">{errors.tokenPrice.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fundraisingGoal">Meta de Captação (LUSD) *</Label>
              <Input
                id="fundraisingGoal"
                type="number"
                placeholder="100000"
                {...register('fundraisingGoal')}
                className={cn(errors.fundraisingGoal && 'border-red-500')}
              />
              {errors.fundraisingGoal && (
                <p className="text-sm text-red-500">{errors.fundraisingGoal.message}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Lunes SafeGuard:</strong> Para garantir a segurança dos investidores, é obrigatório fornecer o hash da garantia alocada no sistema SafeGuard. <mcreference link="https://github.com/lunes-platform/lunes_safeguard" index="1">1</mcreference>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="safeguardHash">Hash da Garantia SafeGuard *</Label>
              <Input
                id="safeguardHash"
                placeholder="0x1234567890abcdef..."
                {...register('safeguardHash')}
                className={cn(errors.safeguardHash && 'border-red-500')}
              />
              {errors.safeguardHash && (
                <p className="text-sm text-red-500">{errors.safeguardHash.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Hash da transação de depósito da garantia no contrato SafeGuard
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="listingFee">Taxa de Listagem (LUSD) *</Label>
              <Input
                id="listingFee"
                type="number"
                min="100"
                {...register('listingFee')}
                className={cn(errors.listingFee && 'border-red-500')}
              />
              {errors.listingFee && (
                <p className="text-sm text-red-500">{errors.listingFee.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Taxa mínima: 100 LUSD. Esta taxa será cobrada para processar sua listagem.
              </p>
            </div>

            <Alert>
              <ExternalLink className="h-4 w-4" />
              <AlertDescription>
                Ao submeter este formulário, você concorda com nossos termos de serviço e confirma que todas as informações fornecidas são verdadeiras e precisas.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Informações Básicas';
      case 2:
        return 'Links Sociais e Documentação';
      case 3:
        return 'Configuração do Token';
      case 4:
        return 'Garantias e Pagamento';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Submissão de Projeto - {getStepTitle()}
        </CardTitle>
        <CardDescription>
          Passo {currentStep} de {totalSteps}: Complete todas as informações necessárias para submeter seu projeto ao Launchpad.
        </CardDescription>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>

            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Submeter Projeto'
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}