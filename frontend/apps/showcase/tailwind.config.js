/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilita modo escuro baseado em classe
  theme: {
    extend: {
      colors: {
        // === CORES PRINCIPAIS DO LAUNCHPAD LUNES ===
        // Paleta de cores moderna e acessível
        
        // Grafite - Cor neutra principal (#1A1A1A)
        grafite: {
          DEFAULT: '#1A1A1A',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#1A1A1A',
          950: '#0A0A0A',
        },
        
        // Roxo - Cor primária da marca (#6C38FF)
        roxo: {
          DEFAULT: '#6C38FF',
          50: '#F8F4FF',
          100: '#F1E8FF',
          200: '#E4D4FF',
          300: '#D1B3FF',
          400: '#B888FF',
          500: '#9F5CFF',
          600: '#6C38FF',
          700: '#5B2BE6',
          800: '#4A1FCC',
          900: '#3D1AA6',
          950: '#280F70',
        },
        
        // Verde - Cor de sucesso (#26D07C)
        verde: {
          DEFAULT: '#26D07C',
          50: '#F0FDF7',
          100: '#DCFCE8',
          200: '#BBF7D2',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#26D07C',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        
        // Laranja - Cor de atenção (#FE5F00)
        laranja: {
          DEFAULT: '#FE5F00',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FE5F00',
          600: '#E55100',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        
        // === CORES SEMÂNTICAS ===
        // Mapeamento semântico das cores para diferentes contextos
        
        // Cores primárias do sistema
        primary: {
          DEFAULT: '#6C38FF', // roxo.DEFAULT
          50: '#F8F4FF',
          100: '#F1E8FF',
          200: '#E4D4FF',
          300: '#D1B3FF',
          400: '#B888FF',
          500: '#9F5CFF',
          600: '#6C38FF',
          700: '#5B2BE6',
          800: '#4A1FCC',
          900: '#3D1AA6',
          950: '#280F70',
        },
        
        // Cores de sucesso
        success: {
          DEFAULT: '#26D07C', // verde.DEFAULT
          50: '#F0FDF7',
          100: '#DCFCE8',
          200: '#BBF7D2',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#26D07C',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        
        // Cores de aviso/atenção
        warning: {
          DEFAULT: '#FE5F00', // laranja.DEFAULT
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#FE5F00',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        
        // Cores de erro
        error: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A',
        },
        
        // Cores neutras modernas
        neutral: {
          DEFAULT: '#737373', // grafite.500
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#1A1A1A',
          950: '#0A0A0A',
        },
        
        // === CORES ESPECÍFICAS DO CONTEXTO ===
        
        // Cores para diferentes papéis de usuário
        admin: {
          DEFAULT: '#DC2626', // Vermelho para admin
          light: '#FEE2E2',
          dark: '#7F1D1D',
        },
        
        investor: {
          DEFAULT: '#6C38FF', // Roxo primário
          vip: '#F59E0B', // Dourado para VIP
          verified: '#26D07C', // Verde para verificado
        },
        
        project: {
          DEFAULT: '#0EA5E9', // Azul para projetos
          light: '#E0F2FE',
          dark: '#0C4A6E',
        },
        
        // Estados de fases do projeto
        phase: {
          upcoming: '#94A3B8', // Cinza para próximas
          whitelist: '#F59E0B', // Amarelo para whitelist
          presale: '#6366F1', // Índigo para pré-venda
          sale: '#26D07C', // Verde para venda ativa
          distribution: '#6C38FF', // Roxo para distribuição
          completed: '#6B7280', // Cinza para finalizado
        },
        
        // Cores para diferentes tipos de investimento
        investment: {
          low: '#10B981', // Verde claro
          medium: '#F59E0B', // Amarelo
          high: '#EF4444', // Vermelho
        },
        
        // === CORES LEGADAS (COMPATIBILIDADE) ===
        // Mantendo para não quebrar componentes existentes
        lunes: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        
        // Cores secundárias (mapeadas para neutral)
        secondary: {
          DEFAULT: '#737373', // neutral.500
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}