import { PrismaClient, Prisma } from '@prisma/client';
import { Logger } from '../logger';

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
      errorFormat: 'pretty',
    });

    // Configurar logs do Prisma
    this.setupLogging();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  private setupLogging(): void {
    (this.prisma as any).$on('query', (e: Prisma.QueryEvent) => {
      Logger.database(`Query: ${e.query}`, {
        params: e.params,
        duration: `${e.duration}ms`,
        target: e.target,
      });
    });

    (this.prisma as any).$on('error', (e: Prisma.LogEvent) => {
      Logger.error(`Database error: ${e.message}`, {
        target: e.target,
        timestamp: e.timestamp,
      });
    });

    (this.prisma as any).$on('info', (e: Prisma.LogEvent) => {
      Logger.database(`Info: ${e.message}`, {
        target: e.target,
        timestamp: e.timestamp,
      });
    });

    (this.prisma as any).$on('warn', (e: Prisma.LogEvent) => {
      Logger.warn(`Database warning: ${e.message}`, {
        target: e.target,
        timestamp: e.timestamp,
      });
    });
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      Logger.database('Conectado ao banco de dados PostgreSQL');
    } catch (error) {
      Logger.error('Erro ao conectar com o banco de dados', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      Logger.database('Desconectado do banco de dados');
    } catch (error) {
      Logger.error('Erro ao desconectar do banco de dados', error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      Logger.error('Health check do banco falhou', error);
      return false;
    }
  }

  // Método para executar transações
  public async transaction<T>(
    fn: (prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  // Método para executar queries raw
  public async queryRaw<T = unknown>(
    query: string,
    ...values: any[]
  ): Promise<T> {
    return this.prisma.$queryRawUnsafe(query, ...values) as Promise<T>;
  }

  // Método para executar comandos raw
  public async executeRaw(
    query: string,
    ...values: any[]
  ): Promise<number> {
    return this.prisma.$executeRawUnsafe(query, ...values);
  }
}

// Instância singleton
export const databaseService = DatabaseService.getInstance();
export const prisma = databaseService.getClient();

// Função para inicializar a conexão
export async function initializeDatabase(): Promise<void> {
  await databaseService.connect();
}

// Função para finalizar a conexão
export async function closeDatabase(): Promise<void> {
  await databaseService.disconnect();
}

export default databaseService;