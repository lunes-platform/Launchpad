/**
 * Utilitários de formatação para a aplicação
 */

/**
 * Formata números como moeda
 */
const formatCurrency = (value: number | string, decimals: number = 2): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
};

/**
 * Formata um valor de token com símbolo
 */
const formatTokenAmount = (amount: number | string, symbol: string, decimals: number = 4): string => {
  const formattedAmount = formatCurrency(amount, decimals);
  return `${formattedAmount} ${symbol}`;
};

/**
 * Formata números grandes com sufixos (K, M, B)
 */
const formatCompactNumber = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0';
  
  return new Intl.NumberFormat('pt-BR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(numValue);
};

/**
 * Formata porcentagem
 */
const formatPercentage = (value: number | string, decimals: number = 2): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) return '0%';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue / 100);
};

/**
 * Formata data
 */
const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Data inválida';
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Formata data e hora
 */
const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Data inválida';
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Trunca texto com ellipsis
 */
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Formata endereço de carteira
 */
const formatAddress = (address: string, startChars: number = 6, endChars: number = 4): string => {
  if (!address || address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

/**
 * Formata hash de transação
 */
const formatTxHash = (hash: string): string => {
  return formatAddress(hash, 8, 8);
};

/**
 * Formata tempo relativo (ex: "há 2 horas")
 */
const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'agora';
  if (diffMinutes < 60) return `há ${diffMinutes} min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays < 7) return `há ${diffDays} dias`;
  
  return formatDate(dateObj);
};

/**
 * Objeto com todas as funções de formatação
 */
export const formatUtils = {
  currency: formatCurrency,
  tokenAmount: formatTokenAmount,
  compactNumber: formatCompactNumber,
  percentage: formatPercentage,
  date: formatDate,
  dateTime: formatDateTime,
  truncateText,
  address: formatAddress,
  txHash: formatTxHash,
  relativeTime: formatRelativeTime,
};

export default formatUtils;