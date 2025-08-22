import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Card, Button } from '@launchpad/shared-ui';
import { Badge } from './Badge';

/**
 * Interface para dados de preço dos tokens
 */
interface TokenPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  lastUpdated: Date;
}

/**
 * Interface para o resultado da conversão
 */
interface ConversionResult {
  fromAmount: number;
  toAmount: number;
  rate: number;
  fees: number;
  total: number;
}

/**
 * Props do componente ConversionCalculator
 */
interface ConversionCalculatorProps {
  className?: string;
  defaultFromToken?: 'LUNES' | 'LUSDT';
  defaultToToken?: 'LUNES' | 'LUSDT';
  onConvert?: (result: ConversionResult) => void;
  showAdvanced?: boolean;
}

/**
 * Componente de Calculadora de Conversão LUNES/LUSDT
 * Permite aos usuários calcular conversões entre tokens com dados de preço em tempo real
 */
export const ConversionCalculator: React.FC<ConversionCalculatorProps> = ({
  className = '',
  defaultFromToken = 'LUNES',
  defaultToToken = 'LUSDT',
  onConvert,
  showAdvanced = false
}) => {
  // Estados do componente
  const [fromToken, setFromToken] = useState<'LUNES' | 'LUSDT'>(defaultFromToken);
  const [toToken, setToToken] = useState<'LUNES' | 'LUSDT'>(defaultToToken);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Mock de dados de preço (TODO: integrar com oracle de preços)
  const [tokenPrices, setTokenPrices] = useState<Record<string, TokenPrice>>({
    LUNES: {
      symbol: 'LUNES',
      price: 0.85,
      change24h: 2.34,
      volume24h: 1250000,
      lastUpdated: new Date()
    },
    LUSDT: {
      symbol: 'LUSDT',
      price: 1.00,
      change24h: 0.02,
      volume24h: 850000,
      lastUpdated: new Date()
    }
  });
  
  // Taxa de conversão (0.3% padrão)
  const CONVERSION_FEE_RATE = 0.003;
  
  /**
   * Calcula a taxa de conversão entre os tokens
   */
  const conversionRate = useMemo(() => {
    const fromPrice = tokenPrices[fromToken]?.price || 0;
    const toPrice = tokenPrices[toToken]?.price || 0;
    
    if (fromPrice === 0 || toPrice === 0) return 0;
    
    return fromPrice / toPrice;
  }, [fromToken, toToken, tokenPrices]);
  
  /**
   * Calcula o resultado da conversão
   */
  const calculateConversion = useMemo((): ConversionResult | null => {
    const amount = parseFloat(fromAmount);
    
    if (isNaN(amount) || amount <= 0 || conversionRate === 0) {
      return null;
    }
    
    const convertedAmount = amount * conversionRate;
    const fees = convertedAmount * CONVERSION_FEE_RATE;
    const finalAmount = convertedAmount - fees;
    
    return {
      fromAmount: amount,
      toAmount: finalAmount,
      rate: conversionRate,
      fees,
      total: finalAmount
    };
  }, [fromAmount, conversionRate]);
  
  /**
   * Atualiza os preços dos tokens (simula chamada para oracle)
   */
  const updatePrices = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Integrar com oracle de preços real
      // Simular variação de preço para demonstração
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTokenPrices(prev => ({
        LUNES: {
          ...prev.LUNES,
          price: prev.LUNES.price * (0.98 + Math.random() * 0.04), // ±2% variação
          change24h: -2 + Math.random() * 4, // ±2% mudança
          lastUpdated: new Date()
        },
        LUSDT: {
          ...prev.LUSDT,
          price: 1.00 + (Math.random() - 0.5) * 0.02, // ±1% variação para stablecoin
          change24h: -0.1 + Math.random() * 0.2,
          lastUpdated: new Date()
        }
      }));
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Erro ao atualizar preços:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Inverte os tokens de origem e destino
   */
  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount('');
  };
  
  /**
   * Atualiza o valor de destino quando o valor de origem muda
   */
  useEffect(() => {
    if (calculateConversion) {
      setToAmount(calculateConversion.toAmount.toFixed(6));
    } else {
      setToAmount('');
    }
  }, [calculateConversion]);
  
  /**
   * Executa a conversão
   */
  const handleConvert = () => {
    if (calculateConversion && onConvert) {
      onConvert(calculateConversion);
    }
  };
  
  /**
   * Formata números para exibição
   */
  const formatNumber = (num: number, decimals: number = 6) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals
    }).format(num);
  };
  
  /**
   * Formata porcentagem de mudança
   */
  const formatChange = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`flex items-center gap-1 text-sm ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {Math.abs(change).toFixed(2)}%
      </span>
    );
  };
  
  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Calculadora de Conversão
            </h3>
            <p className="text-sm text-gray-600">
              Converta entre LUNES e LUSDT com taxas em tempo real
            </p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={updatePrices}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Atualizar
          </Button>
        </div>
        
        {/* Preços atuais */}
        <div className="grid grid-cols-2 gap-4">
          {Object.values(tokenPrices).map(token => (
            <div key={token.symbol} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{token.symbol}</span>
                {formatChange(token.change24h)}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                ${formatNumber(token.price, 4)}
              </div>
              <div className="text-sm text-gray-600">
                Vol: ${formatNumber(token.volume24h, 0)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Calculadora */}
        <div className="space-y-4">
          {/* Token de origem */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              De
            </label>
            <div className="flex gap-3">
              <select
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value as 'LUNES' | 'LUSDT')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="LUNES">LUNES</option>
                <option value="LUSDT">LUSDT</option>
              </select>
              
              <input
                type="number"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                placeholder="0.000000"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                step="0.000001"
                min="0"
              />
            </div>
          </div>
          
          {/* Botão de troca */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={swapTokens}
              className="p-2 rounded-full"
            >
              <ArrowUpDown size={16} />
            </Button>
          </div>
          
          {/* Token de destino */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Para
            </label>
            <div className="flex gap-3">
              <select
                value={toToken}
                onChange={(e) => setToToken(e.target.value as 'LUNES' | 'LUSDT')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="LUNES">LUNES</option>
                <option value="LUSDT">LUSDT</option>
              </select>
              
              <input
                type="text"
                value={toAmount}
                readOnly
                placeholder="0.000000"
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-700"
              />
            </div>
          </div>
        </div>
        
        {/* Informações da conversão */}
        {calculateConversion && (
          <div className="bg-blue-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxa de conversão:</span>
              <span className="font-medium">
                1 {fromToken} = {formatNumber(conversionRate, 6)} {toToken}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taxa de conversão (0.3%):</span>
              <span className="font-medium">
                {formatNumber(calculateConversion.fees)} {toToken}
              </span>
            </div>
            
            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-sm font-medium text-gray-900">Você receberá:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatNumber(calculateConversion.total)} {toToken}
              </span>
            </div>
          </div>
        )}
        
        {/* Informações avançadas */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-medium text-gray-900">Informações Avançadas</h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Slippage máximo:</span>
                <div className="font-medium">0.5%</div>
              </div>
              
              <div>
                <span className="text-gray-600">Tempo estimado:</span>
                <div className="font-medium">~15 segundos</div>
              </div>
              
              <div>
                <span className="text-gray-600">Liquidez disponível:</span>
                <div className="font-medium">$2.1M</div>
              </div>
              
              <div>
                <span className="text-gray-600">Última atualização:</span>
                <div className="font-medium">
                  {lastUpdated.toLocaleTimeString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Botão de conversão */}
        {onConvert && (
          <Button
            onClick={handleConvert}
            disabled={!calculateConversion || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Atualizando...' : 'Converter Agora'}
          </Button>
        )}
        
        {/* Aviso */}
        <div className="text-xs text-gray-500 text-center">
          <Badge variant="secondary" className="mb-2">
            Beta
          </Badge>
          <p>
            Os preços são atualizados a cada 30 segundos. 
            Taxas podem variar baseadas na liquidez disponível.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ConversionCalculator;