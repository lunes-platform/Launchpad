import React, { useState } from 'react';
import { Copy, ExternalLink, Clock, CheckCircle, AlertCircle, Loader2, TrendingUp, ArrowUpRight, ArrowDownLeft, Unlock } from 'lucide-react';
import { Modal } from '@launchpad/shared-ui';
import type { UserInvestment } from '../types';
import { formatUtils } from '../utils/format';
import { TokenClaimService } from '../services/tokenClaimService';
import { TransactionHistoryService, type TransactionHistoryItem } from '../services/transactionHistoryService';

interface InvestmentDetailsModalProps {
  investment: UserInvestment;
  isOpen: boolean;
  onClose: () => void;
}

export const InvestmentDetailsModal: React.FC<InvestmentDetailsModalProps> = ({
  investment,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vesting' | 'history'>('overview');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isProcessingClaim, setIsProcessingClaim] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  
  // Estados para histórico de transações
  const [transactionHistory] = useState<TransactionHistoryItem[]>(() => 
    TransactionHistoryService.generateTransactionHistory(investment)
  );
  const [transactionStats] = useState(() => 
    TransactionHistoryService.calculateTransactionStats(transactionHistory)
  );
  const [historyFilter, setHistoryFilter] = useState<'all' | 'investment' | 'claim' | 'vesting_unlock'>('all');

  // Função para copiar texto para clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(type);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Erro ao copiar para clipboard:', err);
    }
  };

  if (!isOpen) return null;

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleClaimTokens = async () => {
    try {
      setIsProcessingClaim(true);
      setClaimError(null);

      // Validar se o resgate é possível
      const validation = TokenClaimService.validateClaim(investment);
      
      if (!validation.isValid) {
        setClaimError(validation.errors.join(', '));
        return;
      }

      // Processar o resgate
      const result = await TokenClaimService.processTokenClaim(investment);
      
      if (result.success) {
        console.log('Tokens resgatados com sucesso:', result.txHash);
        // Aqui você pode atualizar o estado global ou recarregar os dados
        // onClaimSuccess?.(result);
      } else {
         setClaimError(result.message || 'Erro desconhecido no resgate');
       }
    } catch (error) {
      console.error('Erro no resgate de tokens:', error);
      setClaimError('Falha na comunicação com a rede. Tente novamente.');
    } finally {
      setIsProcessingClaim(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500 bg-green-50';
      case 'pending':
        return 'text-yellow-500 bg-yellow-50';
      case 'failed':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="lg"
      title={investment.projectName}
    >
      {/* Cabeçalho com descrição */}
      <div className="mb-3">
        <p className="text-sm text-grafite-600 dark:text-grafite-400">
          Investment Details
        </p>
      </div>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'vesting', label: 'Vesting Schedule' },
            { id: 'history', label: 'Transaction History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="pt-4 overflow-y-auto max-h-[50vh]">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Investment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-base font-medium text-gray-900">Investment Summary</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment Amount:</span>
                      <span className="font-medium">
                        {formatUtils.tokenAmount(investment.amount, investment.token)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Tokens:</span>
                      <span className="font-medium">
                        {formatUtils.tokenAmount(investment.totalTokens, investment.tokenSymbol)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Claimable Amount:</span>
                      <span className="font-medium text-green-600">
                        {formatUtils.tokenAmount(investment.claimableAmount, investment.tokenSymbol)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investment.status)}`}>
                        {getStatusIcon(investment.status)}
                        {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Investment Date:</span>
                      <span className="font-medium">
                        {formatUtils.date(investment.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Transaction Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Transaction Hash:</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded flex-1">
                          {formatUtils.txHash(investment.txHash || '')}
                        </code>
                        <button
                          onClick={() => handleCopy(investment.txHash || '', 'txHash')}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Copy transaction hash"
                        >
                          {copiedField === 'txHash' ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() => window.open(`https://explorer.example.com/tx/${investment.txHash}`, '_blank')}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="View on explorer"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {parseFloat(investment.claimableAmount) > 0 && (
                <div className="pt-4 border-t space-y-3">
                  {claimError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <p className="text-sm text-red-700">{claimError}</p>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleClaimTokens}
                    disabled={isProcessingClaim}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessingClaim ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      `Resgatar ${formatUtils.tokenAmount(investment.claimableAmount, investment.tokenSymbol)}`
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vesting' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Vesting Schedule</h3>
              
              {investment.vestingSchedule && investment.vestingSchedule.length > 0 ? (
                <div className="space-y-3">
                  {investment.vestingSchedule.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        item.claimed
                          ? 'bg-green-50 border-green-200'
                          : item.claimable
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            item.claimed
                              ? 'bg-green-500'
                              : item.claimable
                              ? 'bg-blue-500'
                              : 'bg-gray-300'
                          }`} />
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatUtils.date(item.date)}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.percentage}% of total allocation
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {formatUtils.tokenAmount(item.amount, investment.tokenSymbol)}
                          </p>
                          <p className={`text-sm ${
                            item.claimed
                              ? 'text-green-600'
                              : item.claimable
                              ? 'text-blue-600'
                              : 'text-gray-500'
                          }`}>
                            {item.claimed ? 'Claimed' : item.claimable ? 'Claimable' : 'Locked'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No vesting schedule available
                </p>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Header com estatísticas */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Transações</h3>
                
                {/* Estatísticas resumidas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Total Investido</p>
                    <p className="text-lg font-semibold text-blue-900">
                      {formatUtils.currency(transactionStats.totalInvested)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Total Resgatado</p>
                    <p className="text-lg font-semibold text-green-900">
                      {formatUtils.currency(transactionStats.totalClaimed)}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-600 font-medium">Pendentes</p>
                    <p className="text-lg font-semibold text-yellow-900">
                      {transactionStats.pendingClaims}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Taxa Sucesso</p>
                    <p className="text-lg font-semibold text-purple-900">
                      {transactionStats.successRate}%
                    </p>
                  </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { key: 'all', label: 'Todas' },
                    { key: 'investment', label: 'Investimentos' },
                    { key: 'claim', label: 'Resgates' },
                    { key: 'vesting_unlock', label: 'Desbloqueios' }
                  ].map(filter => (
                    <button
                      key={filter.key}
                      onClick={() => setHistoryFilter(filter.key as any)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        historyFilter === filter.key
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Lista de transações */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactionHistory
                  .filter(tx => historyFilter === 'all' || tx.type === historyFilter)
                  .map((transaction) => {
                    const typeInfo = TransactionHistoryService.getTransactionTypeInfo(transaction.type);
                    const statusInfo = TransactionHistoryService.getStatusInfo(transaction.status);
                    
                    return (
                      <div key={transaction.id} className={`p-4 rounded-lg border ${
                        transaction.status === 'confirmed' ? 'bg-white' :
                        transaction.status === 'pending' ? 'bg-yellow-50 border-yellow-200' :
                        transaction.status === 'failed' ? 'bg-red-50 border-red-200' :
                        'bg-gray-50'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${typeInfo.bgColor}`}>
                              {transaction.type === 'investment' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                              {transaction.type === 'claim' && <CheckCircle className="w-5 h-5 text-green-600" />}
                              {transaction.type === 'vesting_unlock' && <Unlock className="w-5 h-5 text-yellow-600" />}
                              {transaction.type === 'transfer' && <ArrowUpRight className="w-5 h-5 text-purple-600" />}
                              {transaction.type === 'refund' && <ArrowDownLeft className="w-5 h-5 text-orange-600" />}
                              {transaction.type === 'penalty' && <AlertCircle className="w-5 h-5 text-red-600" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{transaction.description}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.color} bg-opacity-10`}>
                                  {statusInfo.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-1">
                                <p className="text-sm text-gray-600">
                                  {formatUtils.dateTime(transaction.timestamp)}
                                </p>
                                {transaction.txHash && (
                                  <button
                                    onClick={() => copyToClipboard(transaction.txHash!, 'txHash')}
                                    className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    {transaction.txHash.slice(0, 8)}...{transaction.txHash.slice(-6)}
                                  </button>
                                )}
                                {transaction.confirmations !== undefined && (
                                  <span className="text-xs text-gray-500">
                                    {transaction.confirmations} confirmações
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'claim' || transaction.type === 'vesting_unlock' ? 'text-green-600' :
                              transaction.type === 'investment' ? 'text-blue-600' :
                              transaction.type === 'penalty' ? 'text-red-600' :
                              'text-gray-900'
                            }`}>
                              {transaction.type === 'claim' || transaction.type === 'vesting_unlock' ? '+' : ''}
                              {formatUtils.tokenAmount(transaction.amount, transaction.tokenSymbol)}
                            </p>
                            {transaction.fee && (
                              <p className="text-xs text-gray-500">
                                Taxa: {transaction.fee} ETH
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                
                {transactionHistory.filter(tx => historyFilter === 'all' || tx.type === historyFilter).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhuma transação encontrada para este filtro.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
    </Modal>
  );
};

export default InvestmentDetailsModal;