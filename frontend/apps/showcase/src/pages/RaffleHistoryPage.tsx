import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RaffleHistoryModal } from '../components/modals/RaffleHistoryModal';
import { Button } from '@launchpad/shared-ui';
import { History, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Página dedicada para exibir o histórico completo de raffles do usuário
 * Utiliza o RaffleHistoryModal em modo fullscreen para melhor experiência
 */
export function RaffleHistoryPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(true);

  // Redireciona para home se modal for fechado
  const handleCloseModal = () => {
    setShowModal(false);
    // Pequeno delay para permitir animação de fechamento
    setTimeout(() => {
      window.history.back();
    }, 200);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <History className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="mb-6">Você precisa estar logado para ver seu histórico de raffles.</p>
          </div>
          <Link to="/">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header da página */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-white flex items-center">
                <History className="w-5 h-5 mr-2" />
                Histórico de Raffles
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Visualize todas as suas transações e participações em raffles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal em modo fullscreen */}
      <div className="relative">
        <RaffleHistoryModal
          isOpen={showModal}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}

export default RaffleHistoryPage;