import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Tipos para o sistema de Raffles
 */
export interface RafflePrize {
  id: string;
  name: string;
  description: string;
  value: number;
  currency: 'LUNES' | 'LUSDT';
  imageUrl?: string;
  position: number; // 1º, 2º, 3º lugar, etc.
}

export interface RaffleParticipant {
  id: string;
  userId: string;
  userName: string;
  ticketCount: number;
  joinDate: Date;
  isVip: boolean;
}

export interface RaffleTicket {
  id: string;
  raffleId: string;
  userId: string;
  ticketNumber: number;
  purchaseDate: Date;
  status: 'active' | 'used' | 'refunded';
  transactionHash?: string;
}

export interface Raffle {
  id: string;
  projectId: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'upcoming' | 'active' | 'drawing' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  drawDate: Date;
  
  // Configurações de tickets
  ticketPrice: number;
  ticketCurrency: 'LUNES' | 'LUSDT';
  maxTickets: number;
  soldTickets: number;
  maxTicketsPerUser: number;
  
  // Prêmios e participantes
  prizes: RafflePrize[];
  participants: RaffleParticipant[];
  totalPrizePool: number;
  
  // Configurações especiais
  vipOnly: boolean;
  requiresKyc: boolean;
  
  // Resultados (após sorteio)
  winners?: {
    prizeId: string;
    userId: string;
    userName: string;
    ticketNumber: number;
  }[];
}

/**
 * Estado do store
 */
interface RaffleState {
  // Dados
  raffles: Raffle[];
  userTickets: RaffleTicket[];
  
  // Estados de carregamento
  loading: {
    raffles: boolean;
    tickets: boolean;
    purchase: boolean;
    claim: boolean;
  };
  
  // Filtros e paginação
  filters: {
    status: 'all' | 'upcoming' | 'active' | 'drawing' | 'completed' | 'cancelled';
    currency: 'all' | 'LUNES' | 'LUSDT';
    vipOnly: boolean | null;
    projectId: string | null;
  };
  
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  
  // Erro
  error: string | null;
}

/**
 * Ações do store
 */
interface RaffleActions {
  // Buscar dados
  fetchRaffles: (filters?: Partial<RaffleState['filters']>) => Promise<void>;
  fetchRaffleById: (id: string) => Promise<Raffle | null>;
  fetchUserTickets: (raffleId?: string) => Promise<void>;
  
  // Ações do usuário
  purchaseTickets: (raffleId: string, quantity: number) => Promise<boolean>;
  claimPrize: (raffleId: string, prizeId: string) => Promise<boolean>;
  
  // Configurações
  setFilters: (filters: Partial<RaffleState['filters']>) => void;
  setPagination: (pagination: Partial<RaffleState['pagination']>) => void;
  
  // Utilitários
  calculateWinningChance: (raffleId: string, ticketCount: number) => number;
  getUserTicketsForRaffle: (raffleId: string) => RaffleTicket[];
  canPurchaseTickets: (raffleId: string, quantity: number) => boolean;
}

type RaffleStore = RaffleState & RaffleActions;

/**
 * Estado inicial
 */
const initialState: RaffleState = {
  raffles: [],
  userTickets: [],
  loading: {
    raffles: false,
    tickets: false,
    purchase: false,
    claim: false,
  },
  filters: {
    status: 'active',
    currency: 'all',
    vipOnly: null,
    projectId: null,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  error: null,
};

/**
 * Dados mock para desenvolvimento
 */
const mockRaffles: Raffle[] = [
  {
    id: '1',
    projectId: 'proj1',
    title: 'Raffle Projeto Alpha',
    description: 'Participe do sorteio e ganhe tokens exclusivos do Projeto Alpha',
    imageUrl: '/images/raffle-alpha.jpg',
    status: 'active',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    drawDate: new Date('2024-02-16'),
    ticketPrice: 10,
    ticketCurrency: 'LUNES',
    maxTickets: 1000,
    soldTickets: 750,
    maxTicketsPerUser: 50,
    prizes: [
      {
        id: 'p1',
        name: '1º Lugar - 1000 ALPHA',
        description: '1000 tokens ALPHA + NFT exclusivo',
        value: 1000,
        currency: 'LUNES',
        position: 1,
      },
      {
        id: 'p2',
        name: '2º Lugar - 500 ALPHA',
        description: '500 tokens ALPHA',
        value: 500,
        currency: 'LUNES',
        position: 2,
      },
    ],
    participants: [],
    totalPrizePool: 1500,
    vipOnly: false,
    requiresKyc: true,
  },
  {
    id: '2',
    projectId: 'proj2',
    title: 'Raffle VIP Beta',
    description: 'Sorteio exclusivo para membros VIP',
    imageUrl: '/images/raffle-beta.jpg',
    status: 'upcoming',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-28'),
    drawDate: new Date('2024-03-01'),
    ticketPrice: 25,
    ticketCurrency: 'LUSDT',
    maxTickets: 500,
    soldTickets: 0,
    maxTicketsPerUser: 25,
    prizes: [
      {
        id: 'p3',
        name: '1º Lugar - 2000 BETA',
        description: '2000 tokens BETA + Acesso antecipado',
        value: 2000,
        currency: 'LUSDT',
        position: 1,
      },
    ],
    participants: [],
    totalPrizePool: 2000,
    vipOnly: true,
    requiresKyc: true,
  },
];

/**
 * Store Zustand para gerenciamento de Raffles
 */
export const useRaffleStore = create<RaffleStore>()(devtools(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Buscar raffles com filtros
      fetchRaffles: async (filters) => {
        set((state) => ({
          ...state,
          loading: { ...state.loading, raffles: true },
          error: null,
        }));
        
        try {
          // TODO: Substituir por chamada real da API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          let filteredRaffles = [...mockRaffles];
          
          // Aplicar filtros
          if (filters?.status && filters.status !== 'all') {
            filteredRaffles = filteredRaffles.filter(r => r.status === filters.status);
          }
          
          if (filters?.currency && filters.currency !== 'all') {
            filteredRaffles = filteredRaffles.filter(r => r.ticketCurrency === filters.currency);
          }
          
          if (filters?.vipOnly !== null && filters?.vipOnly !== undefined) {
            filteredRaffles = filteredRaffles.filter(r => r.vipOnly === filters.vipOnly);
          }
          
          if (filters?.projectId) {
            filteredRaffles = filteredRaffles.filter(r => r.projectId === filters.projectId);
          }
          
          set((state) => ({
            ...state,
            raffles: filteredRaffles,
            loading: { ...state.loading, raffles: false },
            pagination: { ...state.pagination, total: filteredRaffles.length },
            filters: { ...state.filters, ...filters },
          }));
        } catch (error) {
          set((state) => ({
            ...state,
            loading: { ...state.loading, raffles: false },
            error: 'Erro ao carregar raffles',
          }));
        }
      },
      
      // Buscar raffle por ID
      fetchRaffleById: async (id) => {
        try {
          // TODO: Substituir por chamada real da API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const raffle = mockRaffles.find(r => r.id === id);
          return raffle || null;
        } catch (error) {
          set((state) => ({ ...state, error: 'Erro ao carregar raffle' }));
          return null;
        }
      },
      
      // Buscar tickets do usuário
      fetchUserTickets: async (raffleId) => {
        set((state) => ({
          ...state,
          loading: { ...state.loading, tickets: true },
          error: null,
        }));
        
        try {
          // TODO: Substituir por chamada real da API
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Mock de tickets do usuário
          const mockTickets: RaffleTicket[] = [
            {
              id: 't1',
              raffleId: '1',
              userId: 'user1',
              ticketNumber: 123,
              purchaseDate: new Date('2024-01-20'),
              status: 'active',
              transactionHash: '0x1234567890abcdef',
            },
            {
              id: 't2',
              raffleId: '1',
              userId: 'user1',
              ticketNumber: 456,
              purchaseDate: new Date('2024-01-22'),
              status: 'active',
            },
          ];
          
          const filteredTickets = raffleId 
            ? mockTickets.filter(t => t.raffleId === raffleId)
            : mockTickets;
          
          set((state) => ({
            ...state,
            userTickets: filteredTickets,
            loading: { ...state.loading, tickets: false },
          }));
        } catch (error) {
          set((state) => ({
            ...state,
            loading: { ...state.loading, tickets: false },
            error: 'Erro ao carregar tickets',
          }));
        }
      },
      
      // Comprar tickets
      purchaseTickets: async (raffleId, quantity) => {
        set((state) => ({
          ...state,
          loading: { ...state.loading, purchase: true },
          error: null,
        }));
        
        try {
          const state = get();
          
          if (!state.canPurchaseTickets(raffleId, quantity)) {
            throw new Error('Não é possível comprar essa quantidade de tickets');
          }
          
          // TODO: Substituir por chamada real da API
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Simular sucesso
          const success = Math.random() > 0.1; // 90% de sucesso
          
          if (!success) {
            throw new Error('Falha na transação. Tente novamente.');
          }
          
          // Atualizar estado local
          set((state) => {
            const updatedRaffles = state.raffles.map(raffle => {
              if (raffle.id === raffleId) {
                return {
                  ...raffle,
                  soldTickets: raffle.soldTickets + quantity,
                };
              }
              return raffle;
            });
            
            return {
              ...state,
              raffles: updatedRaffles,
              loading: { ...state.loading, purchase: false },
            };
          });
          
          return true;
        } catch (error) {
          set((state) => ({
            ...state,
            loading: { ...state.loading, purchase: false },
            error: error instanceof Error ? error.message : 'Erro ao comprar tickets',
          }));
          return false;
        }
      },
      
      // Resgatar prêmio
      claimPrize: async (raffleId, prizeId) => {
        set((state) => ({
          ...state,
          loading: { ...state.loading, claim: true },
          error: null,
        }));
        
        try {
          // TODO: Substituir por chamada real da API
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Simular sucesso
          const success = Math.random() > 0.05; // 95% de sucesso
          
          if (!success) {
            throw new Error('Falha ao resgatar prêmio. Tente novamente.');
          }
          
          set((state) => ({
            ...state,
            loading: { ...state.loading, claim: false },
          }));
          
          return true;
        } catch (error) {
          set((state) => ({
            ...state,
            loading: { ...state.loading, claim: false },
            error: error instanceof Error ? error.message : 'Erro ao resgatar prêmio',
          }));
          return false;
        }
      },
      
      // Definir filtros
      setFilters: (filters) => {
        set((state) => ({
          ...state,
          filters: { ...state.filters, ...filters },
          pagination: { ...state.pagination, page: 1 },
        }));
      },
      
      // Definir paginação
      setPagination: (pagination) => {
        set((state) => ({
          ...state,
          pagination: { ...state.pagination, ...pagination },
        }));
      },
      
      // Calcular chance de vitória
      calculateWinningChance: (raffleId, ticketCount) => {
        const { raffles } = get();
        const raffle = raffles.find(r => r.id === raffleId);
        
        if (!raffle || raffle.soldTickets === 0) return 0;
        
        return (ticketCount / raffle.soldTickets) * 100;
      },
      
      // Obter tickets do usuário para um raffle
      getUserTicketsForRaffle: (raffleId) => {
        const { userTickets } = get();
        return userTickets.filter(t => t.raffleId === raffleId);
      },
      
      // Verificar se pode comprar tickets
      canPurchaseTickets: (raffleId, quantity) => {
        const { raffles, userTickets } = get();
        const raffle = raffles.find(r => r.id === raffleId);
        
        if (!raffle || raffle.status !== 'active') return false;
        
        const currentUserTickets = userTickets.filter(t => t.raffleId === raffleId).length;
        
        // Verificar limite por usuário
        if (currentUserTickets + quantity > raffle.maxTicketsPerUser) return false;
        
        // Verificar limite total do raffle
        if (raffle.soldTickets + quantity > raffle.maxTickets) return false;
        
        return true;
      },
    }),
    {
      name: 'raffle-store',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination,
      }),
    }
  ),
  {
    name: 'raffle-store',
  }
));

export default useRaffleStore;