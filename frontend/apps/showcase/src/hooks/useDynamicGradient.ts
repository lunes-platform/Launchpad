import { useState, useEffect } from 'react';

// Definindo os 5 tipos de degradês baseados nas cores da marca
const gradientVariations = [
  // Degradê Azul Oceano (Madrugada - 0h às 5h)
  'bg-gradient-to-br from-azul-900 via-grafite-900 to-grafite-800',
  
  // Degradê Verde Natureza (Manhã - 5h às 10h)
  'bg-gradient-to-br from-verde-900 via-grafite-900 to-grafite-800',
  
  // Degradê Roxo Profundo (Tarde - 10h às 15h)
  'bg-gradient-to-br from-roxo-900 via-grafite-900 to-grafite-800',
  
  // Degradê Laranja Vibrante (Entardecer - 15h às 20h)
  'bg-gradient-to-br from-laranja-900 via-grafite-900 to-grafite-800',
  
  // Degradê Grafite Elegante (Noite - 20h às 0h)
  'bg-gradient-to-br from-grafite-900 via-grafite-800 to-grafite-700'
];

// Nomes descritivos para cada período
const gradientNames = [
  'Azul Oceano',
  'Verde Natureza', 
  'Roxo Profundo',
  'Laranja Vibrante',
  'Grafite Elegante'
];

/**
 * Hook personalizado para gerenciar degradês dinâmicos baseados no horário
 * Alterna entre 5 variações de degradê durante o dia
 */
export const useDynamicGradient = () => {
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0);
  const [gradientName, setGradientName] = useState(gradientNames[0]);

  // Função para calcular o índice do degradê baseado no horário atual
  const calculateGradientIndex = () => {
    const now = new Date();
    const hour = now.getHours();
    
    // Mapeamento dos horários para os índices dos degradês
    if (hour >= 0 && hour < 5) return 0;   // Madrugada - Azul Oceano
    if (hour >= 5 && hour < 10) return 1;  // Manhã - Verde Natureza
    if (hour >= 10 && hour < 15) return 2; // Tarde - Roxo Profundo
    if (hour >= 15 && hour < 20) return 3; // Entardecer - Laranja Vibrante
    return 4; // Noite - Grafite Elegante (20h às 0h)
  };

  // Atualizar o degradê baseado no horário
  useEffect(() => {
    const updateGradient = () => {
      const newIndex = calculateGradientIndex();
      setCurrentGradientIndex(newIndex);
      setGradientName(gradientNames[newIndex]);
    };

    // Atualizar imediatamente
    updateGradient();

    // Configurar intervalo para verificar mudanças a cada minuto
    const interval = setInterval(updateGradient, 60000);

    return () => clearInterval(interval);
  }, []);

  // Função para forçar um degradê específico (útil para testes)
  const setGradient = (index: number) => {
    if (index >= 0 && index < gradientVariations.length) {
      setCurrentGradientIndex(index);
      setGradientName(gradientNames[index]);
    }
  };

  // Função para obter o próximo degradê na sequência
  const nextGradient = () => {
    const nextIndex = (currentGradientIndex + 1) % gradientVariations.length;
    setGradient(nextIndex);
  };

  // Função para obter o degradê anterior na sequência
  const previousGradient = () => {
    const prevIndex = currentGradientIndex === 0 
      ? gradientVariations.length - 1 
      : currentGradientIndex - 1;
    setGradient(prevIndex);
  };

  return {
    currentGradient: gradientVariations[currentGradientIndex],
    gradientName,
    currentIndex: currentGradientIndex,
    allGradients: gradientVariations,
    allNames: gradientNames,
    setGradient,
    nextGradient,
    previousGradient,
    calculateGradientIndex
  };
};

export default useDynamicGradient;