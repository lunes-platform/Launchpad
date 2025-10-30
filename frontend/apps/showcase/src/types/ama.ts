export const AMAStatus = {
  DRAFT: 'DRAFT',
  SCHEDULED: 'SCHEDULED',
  LIVE: 'LIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type AMAStatus = typeof AMAStatus[keyof typeof AMAStatus];

export interface AMAQuestion {
  id: string;
  userId: string;
  userName: string;
  question: string;
  timestamp: Date;
  isAnswered: boolean;
  lunesSpent: number; // 0.5 LUNES por pergunta
}

export interface AMAVote {
  id: string;
  userId: string;
  userName: string;
  timestamp: Date;
  lunesSpent: number; // 0.5 LUNES por voto
}

export interface AMA {
  id: string;
  projectId: string;
  title: string;
  description: string;
  scheduledDate: Date;
  duration: number; // em minutos
  status: AMAStatus;
  youtubeUrl?: string;
  price: number; // $200 para AMAs pagas, $0 para primeira gratuita
  moderatorId: string;
  createdAt: Date;
  updatedAt: Date;
  isFirstFree: boolean;
  questions: AMAQuestion[];
  votes: AMAVote[];
  viewerCount?: number;
  maxViewers?: number;
  rating?: number;
}

export interface CreateAMARequest {
  projectId: string;
  title: string;
  description: string;
  scheduledDate: Date;
  duration: number;
  price: number;
  isFirstFree: boolean;
}

export interface UpdateAMARequest {
  title?: string;
  description?: string;
  scheduledDate?: Date;
  duration?: number;
  youtubeUrl?: string;
  status?: AMAStatus;
}

export interface AMAStats {
  totalAMAs: number;
  scheduledAMAs: number;
  completedAMAs: number;
  totalRevenue: number;
  totalQuestions: number;
  totalVotes: number;
  averageRating: number;
}

export interface PublicAMA {
  id: string;
  projectId: string;
  projectName: string;
  projectLogo?: string;
  title: string;
  description: string;
  scheduledDate: Date;
  duration: number;
  status: AMAStatus;
  youtubeUrl?: string;
  moderatorName: string;
  viewerCount: number;
  questionsCount: number;
  votesCount: number;
  rating: number;
  isLive: boolean;
}

export interface AMAInteraction {
  type: 'question' | 'vote';
  cost: number; // em LUNES
  description: string;
}

export const AMA_INTERACTIONS: Record<string, AMAInteraction> = {
  question: {
    type: 'question',
    cost: 0.5,
    description: 'Fazer uma pergunta durante a AMA',
  },
  vote: {
    type: 'vote',
    cost: 0.5,
    description: 'Votar que gostou do projeto',
  },
};

export interface AMAPayment {
  id: string;
  amaId: string;
  userId: string;
  amount: number;
  currency: 'USD' | 'LUNES';
  type: 'ama_creation' | 'question' | 'vote';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}