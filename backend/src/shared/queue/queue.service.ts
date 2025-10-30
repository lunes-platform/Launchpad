import { Queue, Worker, Job, QueueOptions, WorkerOptions } from 'bullmq';
import { logger } from '../logger';
import { redisService } from '../redis';

// Tipos de jobs
export interface EmailJob {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

export interface BlockchainJob {
  type: 'sync_transaction' | 'process_event' | 'update_balance';
  data: Record<string, any>;
}

export interface NotificationJob {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
}

export interface AnalyticsJob {
  type: 'calculate_metrics' | 'generate_report' | 'update_stats';
  data: Record<string, any>;
}

// Interface para processadores de jobs
export interface JobProcessor<T = any> {
  process(job: Job<T>): Promise<void>;
}

class QueueService {
  private static instance: QueueService;
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private defaultQueueOptions: QueueOptions;
  private defaultWorkerOptions: WorkerOptions;

  private constructor() {
    // Configuração padrão para filas
    this.defaultQueueOptions = {
      connection: redisService.getClient(),
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    };

    // Configuração padrão para workers
    this.defaultWorkerOptions = {
      connection: redisService.getClient(),
      concurrency: 5,
    };
  }

  public static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  // Criar uma nova fila
  public createQueue(
    name: string,
    options?: Partial<QueueOptions>
  ): Queue {
    if (this.queues.has(name)) {
      return this.queues.get(name)!;
    }

    const queueOptions = {
      ...this.defaultQueueOptions,
      ...options,
    };

    const queue = new Queue(name, queueOptions);

    // Event listeners para monitoramento
    queue.on('error', (error: Error) => {
      logger.error(`Erro na fila ${name}`, error);
    });

    queue.on('waiting', (job: Job) => {
      logger.info(`Job ${job.id} aguardando na fila ${name}`);
    });

    (queue as any).on('active', (job: Job) => {
      logger.info(`Job ${job.id} ativo na fila ${name}`);
    });

    (queue as any).on('completed', (job: Job) => {
      logger.info(`Job ${job.id} completado na fila ${name}`);
    });

    (queue as any).on('failed', (job: Job | undefined, error: Error) => {
      logger.error(`Job ${job?.id} falhou na fila ${name}`, error);
    });

    (queue as any).on('stalled', (job: Job) => {
      logger.warn(`Job ${job.id} travado na fila ${name}`);
    });

    this.queues.set(name, queue);
    logger.info(`Fila ${name} criada`);

    return queue;
  }

  public getQueue(name: string): Queue | undefined {
    return this.queues.get(name);
  }

  // Criar um worker para processar jobs
  public createWorker<T = any>(
    queueName: string,
    processor: JobProcessor<T>,
    options?: Partial<WorkerOptions>
  ): Worker<T> {
    if (this.workers.has(queueName)) {
      return this.workers.get(queueName) as Worker<T>;
    }

    const workerOptions = {
      ...this.defaultWorkerOptions,
      ...options,
    };

    const worker = new Worker<T>(
      queueName,
      async (job: Job<T>) => {
        try {
          await processor.process(job);
        } catch (error) {
          logger.error(`Erro ao processar job ${job.id}`, error);
          throw error;
        }
      },
      workerOptions
    );

    // Event listeners para monitoramento
    worker.on('completed', (job: Job<T>) => {
      logger.info(`Worker completou job ${job.id} da fila ${queueName}`);
    });

    worker.on('failed', (job: Job<T> | undefined, error: Error) => {
      logger.error(`Worker falhou job ${job?.id} da fila ${queueName}`, error);
    });

    worker.on('error', (error: Error) => {
      logger.error(`Erro no worker da fila ${queueName}`, error);
    });

    (worker as any).on('stalled', (jobId: string, prev: string) => {
      logger.warn(`Worker travado no job ${jobId} da fila ${queueName}, estado anterior: ${prev}`);
    });

    this.workers.set(queueName, worker);
    logger.info(`Worker criado para fila ${queueName}`);

    return worker;
  }

  public getWorker(queueName: string): Worker | undefined {
    return this.workers.get(queueName);
  }

  // Adicionar job à fila
  public async addJob<T = any>(
    queueName: string,
    jobName: string,
    data: T,
    options?: any
  ): Promise<Job<T>> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Fila ${queueName} não encontrada`);
    }

    return await queue.add(jobName, data, options);
  }

  public async addBulkJobs<T = any>(
    queueName: string,
    jobs: Array<{ name: string; data: T; opts?: any }>
  ): Promise<Job<T>[]> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Fila ${queueName} não encontrada`);
    }

    return await queue.addBulk(jobs);
  }

  // Métodos específicos para tipos de jobs
  public async addEmailJob(data: EmailJob): Promise<Job<EmailJob>> {
    return this.addJob('email', 'send-email', data);
  }

  public async addBlockchainJob(data: BlockchainJob): Promise<Job<BlockchainJob>> {
    return this.addJob('blockchain', data.type, data);
  }

  public async addNotificationJob(data: NotificationJob): Promise<Job<NotificationJob>> {
    return this.addJob('notification', 'send-notification', data);
  }

  public async addAnalyticsJob(data: AnalyticsJob): Promise<Job<AnalyticsJob>> {
    return this.addJob('analytics', data.type, data);
  }

  // Estatísticas da fila
  public async getQueueStats(queueName: string): Promise<any> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Fila ${queueName} não encontrada`);
    }

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ]);

    return {
      name: queueName,
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      delayed: delayed.length,
    };
  }

  public async getAllQueuesStats(): Promise<Record<string, any>> {
    const stats: Record<string, any> = {};

    for (const [name] of this.queues) {
      try {
        stats[name] = await this.getQueueStats(name);
      } catch (error) {
        logger.error(`Erro ao obter estatísticas da fila ${name}`, error);
        stats[name] = { error: 'Erro ao obter estatísticas' };
      }
    }

    return stats;
  }

  // Limpeza de filas
  public async cleanQueue(
    queueName: string,
    grace: number = 0,
    limit: number = 100
  ): Promise<void> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Fila ${queueName} não encontrada`);
    }

    await queue.clean(grace, limit, 'completed');
    await queue.clean(grace, limit, 'failed');
    logger.info(`Fila ${queueName} limpa`);
  }

  // Pausar fila
  public async pauseQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Fila ${queueName} não encontrada`);
    }

    await queue.pause();
    logger.info(`Fila ${queueName} pausada`);
  }

  // Retomar fila
  public async resumeQueue(queueName: string): Promise<void> {
    const queue = this.getQueue(queueName);
    if (!queue) {
      throw new Error(`Fila ${queueName} não encontrada`);
    }

    await queue.resume();
    logger.info(`Fila ${queueName} retomada`);
  }

  // Shutdown graceful
  public async shutdown(): Promise<void> {
    logger.info('Iniciando shutdown das filas...');

    // Fechar todos os workers
    for (const [name, worker] of this.workers) {
      try {
        await worker.close();
        logger.info(`Worker ${name} fechado`);
      } catch (error) {
        logger.error(`Erro ao fechar worker ${name}`, error);
      }
    }

    // Fechar todas as filas
    for (const [name, queue] of this.queues) {
      try {
        await queue.close();
        logger.info(`Fila ${name} fechada`);
      } catch (error) {
        logger.error(`Erro ao fechar fila ${name}`, error);
      }
    }

    this.workers.clear();
    this.queues.clear();
    logger.info('Shutdown das filas concluído');
  }
}

export const queueService = QueueService.getInstance();

// Função para inicializar filas padrão
export async function initializeQueues(): Promise<void> {
  // Criar filas padrão
  queueService.createQueue('email');
  queueService.createQueue('blockchain');
  queueService.createQueue('notification');
  queueService.createQueue('analytics');

  logger.info('Filas inicializadas');
}

export default queueService;