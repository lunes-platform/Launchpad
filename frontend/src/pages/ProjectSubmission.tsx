import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectSubmissionForm } from '../components/forms/ProjectSubmissionForm';
import { Button, Card, Alert } from '../../packages/shared-ui/src/components';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Shield, Zap } from 'lucide-react';

// Badge component inline
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${className}`}
    >
      {children}
    </span>
  );
};

// Toast notification function
const toast = {
  success: (title: string, options?: { description?: string }) => {
    console.log('Success:', title, options?.description);
    // Implementar notificação real posteriormente
  },
  error: (title: string, options?: { description?: string }) => {
    console.log('Error:', title, options?.description);
    // Implementar notificação real posteriormente
  }
};

// Tipos para os dados do formulário
interface ProjectSubmissionData {
  projectName: string;
  description: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  github?: string;
  whitepaper: string;
  roadmap: string;
  safeguardHash: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  tokenPrice: string;
  fundraisingGoal: string;
  listingFee: string;
}

// Simulação de dados de projetos existentes para demonstração
// Cenário: Usuário experiente com múltiplos projetos em diferentes fases
const existingProjects = [
  {
    id: 1,
    name: 'LunesSwap DEX',
    status: 'live',
    submittedAt: '2023-08-15',
    tokenSymbol: 'LSDX',
    fundraisingGoal: '750000',
    raisedAmount: '750000',
    investors: 1247,
    description: 'DEX descentralizada com AMM otimizado para a Rede Lunes',
    category: 'DeFi',
    phase: 'completed',
    progress: 100,
  },
  {
    id: 2,
    name: 'Lunes NFT Marketplace',
    status: 'approved',
    submittedAt: '2023-11-20',
    tokenSymbol: 'LNFT',
    fundraisingGoal: '500000',
    raisedAmount: '425000',
    investors: 892,
    description: 'Marketplace de NFTs com foco em arte digital brasileira',
    category: 'NFT',
    phase: 'sale',
    progress: 85,
  },
  {
    id: 3,
    name: 'GameFi Arena',
    status: 'under_review',
    submittedAt: '2024-01-10',
    tokenSymbol: 'GFA',
    fundraisingGoal: '1200000',
    description: 'Plataforma de jogos P2E com torneios e NFTs',
    category: 'Gaming',
    phase: 'preparation',
    progress: 0,
  },
  {
    id: 4,
    name: 'DeFi Lending Protocol',
    status: 'rejected',
    submittedAt: '2023-12-05',
    tokenSymbol: 'DLP',
    fundraisingGoal: '800000',
    description: 'Protocolo de empréstimos descentralizados',
    category: 'DeFi',
    phase: 'preparation',
    progress: 0,
    rejectionReason: 'Auditoria de segurança incompleta. Necessário apresentar relatório completo de auditoria por empresa certificada.',
  },
  {
    id: 5,
    name: 'Metaverse Land',
    status: 'draft',
    submittedAt: '2024-01-25',
    tokenSymbol: 'MLAND',
    fundraisingGoal: '2000000',
    description: 'Terrenos virtuais no metaverso Lunes',
    category: 'Metaverse',
    phase: 'preparation',
    progress: 0,
    isDraft: true,
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'live':
      return <Badge className="bg-emerald-100 text-emerald-800"><Zap className="w-3 h-3 mr-1" />Ativo</Badge>;
    case 'approved':
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Aprovado</Badge>;
    case 'under_review':
      return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Em Análise</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800">❌ Rejeitado</Badge>;
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800">📝 Rascunho</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Desconhecido</Badge>;
  }
};

export function ProjectSubmission() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitProject = async (data: ProjectSubmissionData) => {
    setIsSubmitting(true);
    
    try {
      // Simulação de envio para API
      console.log('Dados do projeto submetido:', data);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular validação do SafeGuard hash
      if (data.safeguardHash.length < 64) {
        throw new Error('Hash da garantia SafeGuard inválido');
      }
      
      // Sucesso
      toast.success('Projeto submetido com sucesso!', {
        description: 'Seu projeto foi enviado para análise. Você receberá uma resposta em até 48 horas.',
      });
      
      setShowForm(false);
      
    } catch (error) {
      console.error('Erro ao submeter projeto:', error);
      toast.error('Erro ao submeter projeto', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showForm) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setShowForm(false)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Lista
          </Button>
        </div>
        
        <ProjectSubmissionForm
          onSubmit={handleSubmitProject}
          isLoading={isSubmitting}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Submissão de Projetos
        </h1>
        <p className="text-gray-600 mb-6">
          Submeta seu projeto para ser listado no Lunes Launchpad e alcance milhares de investidores.
        </p>
        
        <Button
          onClick={() => setShowForm(true)}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Zap className="mr-2 h-5 w-5" />
          Submeter Novo Projeto
        </Button>
      </div>

      {/* Requisitos e Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Shield className="h-5 w-5 text-blue-600" />
              Garantias SafeGuard
            </h3>
            <p className="text-sm text-gray-600">
              Todos os projetos devem fornecer garantias através do sistema Lunes SafeGuard para proteção dos investidores.
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              Taxa de Listagem
            </h3>
            <p className="text-sm text-gray-600">
              Taxa mínima de 100 LUSD para processar a listagem do seu projeto na plataforma.
            </p>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Clock className="h-5 w-5 text-orange-600" />
              Tempo de Análise
            </h3>
            <p className="text-sm text-gray-600">
              Nossa equipe analisa cada projeto em até 48 horas após a submissão completa.
            </p>
          </div>
        </Card>
      </div>

      {/* Lista de Projetos Submetidos */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Meus Projetos ({existingProjects.length})
        </h2>
        
        <div className="space-y-4">
          {existingProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800">{project.tokenSymbol}</Badge>
                      {getStatusBadge(project.status)}
                      {project.category && (
                        <Badge className="bg-purple-100 text-purple-800">{project.category}</Badge>
                      )}
                    </div>
                    
                    {project.description && (
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Submetido:</span>
                        <div className="font-medium">{new Date(project.submittedAt).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Meta:</span>
                        <div className="font-medium">{Number(project.fundraisingGoal).toLocaleString('pt-BR')} LUSD</div>
                      </div>
                      {project.raisedAmount && (
                        <div>
                          <span className="text-gray-500">Captado:</span>
                          <div className="font-medium text-green-600">{Number(project.raisedAmount).toLocaleString('pt-BR')} LUSD</div>
                        </div>
                      )}
                      {project.investors && (
                        <div>
                          <span className="text-gray-500">Investidores:</span>
                          <div className="font-medium">{project.investors.toLocaleString('pt-BR')}</div>
                        </div>
                      )}
                    </div>
                    
                    {project.progress !== undefined && project.progress > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-500">Progresso da Captação</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {project.status === 'rejected' && project.rejectionReason && (
                      <Alert className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="text-sm text-red-800">
                          <strong>Motivo da rejeição:</strong> {project.rejectionReason}
                        </div>
                      </Alert>
                    )}
                    
                    {project.status === 'draft' && (
                      <Alert className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="text-sm text-yellow-800">
                          <strong>Rascunho:</strong> Complete as informações e submeta para análise.
                        </div>
                      </Alert>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                    {project.status === 'draft' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Continuar Edição
                      </Button>
                    )}
                    {project.status === 'rejected' && (
                      <Button size="sm" variant="outline" className="text-orange-600 border-orange-300 hover:bg-orange-50">
                        Resubmeter
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Informações Adicionais */}
      <Alert className="p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start gap-3">
          <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Importante:</strong> Certifique-se de ter sua garantia devidamente alocada no sistema SafeGuard antes de submeter seu projeto. 
            O hash da garantia é obrigatório e será validado durante o processo de análise.
          </div>
        </div>
      </Alert>
    </div>
  );
}