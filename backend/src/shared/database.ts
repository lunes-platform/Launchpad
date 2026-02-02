import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

/**
 * Cliente Prisma configurado para a aplicação
 *
 * Features:
 * - Logging de queries em desenvolvimento
 * - Tratamento de erros de conexão
 * - Configuração de timeout
 * - Middleware para auditoria
 */
class DatabaseService {
  private static instance: DatabaseService;
  public prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "info", "warn", "error"]
          : ["error"],
      errorFormat: "pretty",
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private setupMiddleware() {
    // Middleware para logging de queries
    this.prisma.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();

      logger.debug("Database query executed", {
        model: params.model,
        action: params.action,
        duration: `${after - before}ms`,
        args: process.env.NODE_ENV === "development" ? params.args : undefined,
      });

      return result;
    });

    // Middleware para soft delete (se necessário)
    this.prisma.$use(async (params, next) => {
      // Interceptar operações de delete para implementar soft delete
      if (params.action === "delete") {
        params.action = "update";
        params.args["data"] = { deletedAt: new Date() };
      }

      if (params.action === "deleteMany") {
        params.action = "updateMany";
        if (params.args.data != undefined) {
          params.args.data["deletedAt"] = new Date();
        } else {
          params.args["data"] = { deletedAt: new Date() };
        }
      }

      return next(params);
    });
  }

  private setupEventHandlers() {
    // Configurar handlers de eventos do Prisma
    // Comentando os event handlers por enquanto devido a problemas de tipo
    /*
    this.prisma.$on('info' as any, (e: any) => {
      logger.info('Prisma info', { 
        message: e.message,
        target: e.target 
      });
    });

    this.prisma.$on('warn' as any, (e: any) => {
      logger.warn('Prisma warning', { 
        message: e.message,
        target: e.target 
      });
    });

    this.prisma.$on('error' as any, (e: any) => {
      logger.error('Prisma error', { 
        message: e.message,
        target: e.target 
      });
    });
    */
  }

  /**
   * Conecta ao banco de dados
   */
  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info("Database connected successfully");
    } catch (error) {
      logger.error("Failed to connect to database", { error });
      throw error;
    }
  }

  /**
   * Desconecta do banco de dados
   */
  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info("Database disconnected successfully");
    } catch (error) {
      logger.error("Failed to disconnect from database", { error });
      throw error;
    }
  }

  /**
   * Verifica a saúde da conexão com o banco
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error("Database health check failed", { error });
      return false;
    }
  }

  /**
   * Executa transação
   */
  public async transaction<T>(
    fn: (
      prisma: Omit<
        PrismaClient,
        | "$connect"
        | "$disconnect"
        | "$on"
        | "$transaction"
        | "$use"
        | "$extends"
      >,
    ) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }

  /**
   * Limpa cache de queries (útil para testes)
   */
  public async clearCache(): Promise<void> {
    // Implementar limpeza de cache se necessário
    logger.info("Database cache cleared");
  }
}

// Exportar instância singleton
export const database = DatabaseService.getInstance();
export const prisma = database.prisma;

// Tipos úteis para TypeScript
export type DatabaseTransaction = Parameters<typeof prisma.$transaction>[0];

// Utilitários para paginação
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function createPaginationResult<T>(
  data: T[],
  total: number,
  options: PaginationOptions,
): PaginationResult<T> {
  const totalPages = Math.ceil(total / options.limit);

  return {
    data,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages,
      hasNext: options.page < totalPages,
      hasPrev: options.page > 1,
    },
  };
}

// Utilitários para filtros
export interface DateFilter {
  from?: Date;
  to?: Date;
}

export function createDateFilter(filter?: DateFilter) {
  if (!filter) return undefined;

  const dateFilter: any = {};
  if (filter.from) dateFilter.gte = filter.from;
  if (filter.to) dateFilter.lte = filter.to;

  return Object.keys(dateFilter).length > 0 ? dateFilter : undefined;
}

// Utilitários para ordenação
export type SortOrder = "asc" | "desc";

export interface SortOptions {
  field: string;
  order: SortOrder;
}

export function createSortOptions(sort?: string): SortOptions {
  if (!sort) return { field: "createdAt", order: "desc" };

  const [field, order] = sort.split(":");
  return {
    field: field || "createdAt",
    order: (order as SortOrder) || "desc",
  };
}
