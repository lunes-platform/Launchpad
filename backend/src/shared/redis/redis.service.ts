import Redis from 'ioredis';
import { envConfig } from '../../config/env.config';
import { logger } from '../logger';

class RedisService {
  private static instance: RedisService;
  private client: Redis;
  private isConnected = false;
  private subscriber!: Redis;
  private publisher!: Redis;

  private constructor() {
    this.client = new Redis({
      host: this.parseRedisUrl(envConfig.REDIS_URL).host,
      port: this.parseRedisUrl(envConfig.REDIS_URL).port,
      password: envConfig.REDIS_PASSWORD,
      db: 0,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.setupEventListeners();
    this.initializePubSub();
  }

  private parseRedisUrl(url: string): { host: string; port: number } {
    try {
      const parsed = new URL(url);
      return {
        host: parsed.hostname || 'localhost',
        port: parseInt(parsed.port) || 6379,
      };
    } catch {
      return {
        host: 'localhost',
        port: 6379,
      };
    }
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  private setupEventListeners(): void {
    this.client.on('connect', () => {
      this.isConnected = true;
      logger.info('Redis client conectado');
    });

    this.client.on('error', (error) => {
      this.isConnected = false;
      logger.error('Erro no Redis client', error);
    });

    this.client.on('close', () => {
      this.isConnected = false;
      logger.warn('Conexão Redis client fechada');
    });
  }

  private initializePubSub(): void {
    this.subscriber = new Redis({
      host: this.parseRedisUrl(envConfig.REDIS_URL).host,
      port: this.parseRedisUrl(envConfig.REDIS_URL).port,
      password: envConfig.REDIS_PASSWORD,
      db: 0,
      lazyConnect: true,
    });

    this.publisher = new Redis({
      host: this.parseRedisUrl(envConfig.REDIS_URL).host,
      port: this.parseRedisUrl(envConfig.REDIS_URL).port,
      password: envConfig.REDIS_PASSWORD,
      db: 0,
      lazyConnect: true,
    });
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      logger.info('Conexão Redis estabelecida');
    } catch (error) {
      logger.error('Erro ao conectar com Redis', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.disconnect();
      this.isConnected = false;
      logger.info('Conexão Redis fechada');
    } catch (error) {
      logger.error('Erro ao desconectar do Redis', error);
    }
  }

  public getClient(): Redis {
    return this.client;
  }

  // ===== MÉTODOS DE CACHE =====

  public async set(
    key: string,
    value: any,
    ttl?: number
  ): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (ttl) {
        await this.client.setex(key, ttl, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      logger.error(`Erro ao definir cache para chave ${key}`, error);
      throw error;
    }
  }

  public async get<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Erro ao obter cache para chave ${key}`, error);
      return null;
    }
  }

  public async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error(`Erro ao deletar cache para chave ${key}`, error);
      throw error;
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Erro ao verificar existência da chave ${key}`, error);
      return false;
    }
  }

  public async expire(key: string, ttl: number): Promise<void> {
    try {
      await this.client.expire(key, ttl);
    } catch (error) {
      logger.error(`Erro ao definir TTL para chave ${key}`, error);
      throw error;
    }
  }

  public async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      logger.error(`Erro ao obter TTL da chave ${key}`, error);
      return -1;
    }
  }

  // ===== MÉTODOS DE HASH =====

  public async hset(
    key: string,
    field: string,
    value: any
  ): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.client.hset(key, field, serializedValue);
    } catch (error) {
      logger.error(`Erro ao definir hash ${key}:${field}`, error);
      throw error;
    }
  }

  public async hget<T = any>(
    key: string,
    field: string
  ): Promise<T | null> {
    try {
      const value = await this.client.hget(key, field);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Erro ao obter hash ${key}:${field}`, error);
      return null;
    }
  }

  public async hgetall<T = Record<string, any>>(
    key: string
  ): Promise<T | null> {
    try {
      const hash = await this.client.hgetall(key);
      if (!hash || Object.keys(hash).length === 0) return null;

      const result: Record<string, any> = {};
      for (const [field, value] of Object.entries(hash)) {
        try {
          result[field] = JSON.parse(value);
        } catch {
          result[field] = value;
        }
      }
      return result as T;
    } catch (error) {
      logger.error(`Erro ao obter hash completo ${key}`, error);
      return null;
    }
  }

  public async hdel(key: string, field: string): Promise<void> {
    try {
      await this.client.hdel(key, field);
    } catch (error) {
      logger.error(`Erro ao deletar hash ${key}:${field}`, error);
      throw error;
    }
  }

  // ===== MÉTODOS DE LISTA =====

  public async lpush(key: string, ...values: any[]): Promise<number> {
    try {
      const serializedValues = values.map(v => JSON.stringify(v));
      return await this.client.lpush(key, ...serializedValues);
    } catch (error) {
      logger.error(`Erro ao adicionar à lista ${key}`, error);
      throw error;
    }
  }

  public async rpop<T = any>(key: string): Promise<T | null> {
    try {
      const value = await this.client.rpop(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Erro ao remover da lista ${key}`, error);
      return null;
    }
  }

  public async llen(key: string): Promise<number> {
    try {
      return await this.client.llen(key);
    } catch (error) {
      logger.error(`Erro ao obter tamanho da lista ${key}`, error);
      return 0;
    }
  }

  // ===== MÉTODOS DE PUB/SUB =====

  public async publish(channel: string, message: any): Promise<void> {
    try {
      const serializedMessage = JSON.stringify(message);
      await this.publisher.publish(channel, serializedMessage);
    } catch (error) {
      logger.error(`Erro ao publicar no canal ${channel}`, error);
      throw error;
    }
  }

  public async subscribe(
    channel: string,
    callback: (message: any) => void
  ): Promise<void> {
    try {
      await this.subscriber.subscribe(channel);
      this.subscriber.on('message', (receivedChannel, message) => {
        if (receivedChannel === channel) {
          try {
            const parsedMessage = JSON.parse(message);
            callback(parsedMessage);
          } catch (error) {
            logger.error(`Erro ao processar mensagem do canal ${channel}`, error);
          }
        }
      });
    } catch (error) {
      logger.error(`Erro ao se inscrever no canal ${channel}`, error);
      throw error;
    }
  }

  // ===== MÉTODOS UTILITÁRIOS =====

  public async healthCheck(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('Health check do Redis falhou', error);
      return false;
    }
  }

  public async flushdb(): Promise<void> {
    try {
      await this.client.flushdb();
      logger.warn('Redis database limpo');
    } catch (error) {
      logger.error('Erro ao limpar Redis database', error);
      throw error;
    }
  }

  public async keys(pattern: string): Promise<string[]> {
    try {
      return await this.client.keys(pattern);
    } catch (error) {
      logger.error(`Erro ao buscar chaves com padrão ${pattern}`, error);
      return [];
    }
  }
}

// Instância singleton
export const redisService = RedisService.getInstance();

// Função para inicializar Redis
export async function initializeRedis(): Promise<void> {
  await redisService.connect();
}

// Função para finalizar Redis
export async function closeRedis(): Promise<void> {
  await redisService.disconnect();
}

export default redisService;