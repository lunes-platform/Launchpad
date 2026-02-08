import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { blake2AsHex } from '@polkadot/util-crypto';
import { BN, bnToBn } from '@polkadot/util';
import { CONTRACTS } from '../config/contracts';
import { LAUNCHPAD_ABI } from '../config/abi/launchpad';

export class LaunchpoolService {
  private api: ApiPromise;
  private contractAddress: string;
  private contract: ContractPromise;

  constructor(api: ApiPromise, contractAddress: string = CONTRACTS.LAUNCHPAD) {
    this.api = api;
    this.contractAddress = contractAddress;

    try {
        this.contract = new ContractPromise(api, LAUNCHPAD_ABI, contractAddress);
    } catch (e) {
        console.error("Erro ao inicializar contrato Launchpad:", e);
        throw e;
    }
  }

  /**
   * Converte Balance para string legível (com 12 decimais)
   */
  private formatBalance(balance: any): string {
      const decimals = 12;
      const raw = balance.toString();
      if (raw === '0') return '0';

      const len = raw.length;
      if (len <= decimals) {
          return '0.' + '0'.repeat(decimals - len) + raw;
      }

      const integerPart = raw.slice(0, len - decimals);
      const decimalPart = raw.slice(len - decimals);
      return `${integerPart}.${decimalPart}`;
  }

  /**
   * Converte string ID para Hash (32 bytes hex)
   */
  private toContractId(id: string): string {
      // Se já for hex de 32 bytes (66 chars com 0x), retorna
      if (id.startsWith('0x') && id.length === 66) {
          return id;
      }
      // Caso contrário, faz hash do string
      return blake2AsHex(id, 256);
  }

  /**
   * Estima o gás necessário para uma transação
   */
  private async estimateGas(
      account: string,
      message: string,
      args: any[],
      value: string | number | BN = 0
  ): Promise<any> {
      const { gasRequired, storageDeposit, result } = await this.contract.query[message](
          account,
          { value: value },
          ...args
      );

      if (result.isErr) {
          throw new Error(`Gas estimation failed: ${result.asErr.toString()}`);
      }

      if (result.asOk.isErr) {
           throw new Error(`Contract execution would fail: ${JSON.stringify(result.asOk.asErr)}`);
      }

      // Adiciona uma margem de segurança ao gás estimado (ex: +20%)
      const gasLimit = this.api.registry.createType(
          'WeightV2',
          {
              refTime: gasRequired.refTime.toBn().muln(120).divn(100),
              proofSize: gasRequired.proofSize.toBn().muln(120).divn(100),
          }
      );

      return { gasLimit, storageDeposit };
  }

  /**
   * Obtém informações de stake do usuário
   */
  async getUserStakeInfo(address: string): Promise<{
    amount: string;
    lastStakeTime: Date;
    unlockTime: Date;
    isParticipating: boolean;
  } | null> {
    if (!this.contract) return null;

    try {
        const { result, output } = await this.contract.query.getStakeInfo(
            address,
            { gasLimit: -1 },
            address
        );

        if (result.isOk && output) {
             // O retorno é StakeInfo struct
             const data = output.toPrimitive() as any;

             // toPrimitive converte u128 para string/number dependendo do tamanho,
             // e u64 para number/string. É mais seguro que toHuman.

             const amount = data.amount ? data.amount.toString() : '0';
             // block timestamp em ms? Contracts usam ms geralmente
             const lastStakeTimeMs = Number(data.last_stake_time || 0);
             const unlockTimeMs = Number(data.unlock_time || 0);

             return {
                 amount: this.formatBalance(amount),
                 lastStakeTime: new Date(lastStakeTimeMs),
                 unlockTime: new Date(unlockTimeMs),
                 isParticipating: !!data.is_participating
             };
        }

        return null;
    } catch (error) {
        console.error("Erro ao buscar stake info:", error);
        return null;
    }
  }

  /**
   * Obtém recompensa pendente para um usuário em um pool específico
   */
  async getClaimableAmount(address: string, projectId: string, phaseType: number = 3): Promise<string> {
       if (!this.contract) return '0';

       try {
           const contractProjectId = this.toContractId(projectId);
           const { result, output } = await this.contract.query.getClaimableAmount(
               address,
               { gasLimit: -1 },
               address,
               contractProjectId,
               phaseType
           );

           if (result.isOk && output) {
               // Balance (u128)
               return this.formatBalance(output.toString());
           }
           return '0';
       } catch (error) {
           console.error("Erro ao buscar claimable amount:", error);
           return '0';
       }
  }

  /**
   * Realiza Stake de LUNES
   */
  async stake(account: any, amount: string): Promise<string> {
      const injector = await web3FromAddress(account.address);
      const units = BigInt(Math.floor(parseFloat(amount) * 1e12)).toString();

      // Estimar gás
      const { gasLimit } = await this.estimateGas(
          account.address,
          'stake',
          [],
          units
      );

      return new Promise(async (resolve, reject) => {
          try {
              await this.contract.tx.stake(
                  {
                      value: units,
                      gasLimit
                  }
              ).signAndSend(account.address, { signer: injector.signer }, (result) => {
                  if (result.status.isInBlock) {
                      console.log('Stake in block');
                  } else if (result.status.isFinalized) {
                      console.log('Stake finalized');
                      resolve(result.txHash.toString());
                  } else if (result.isError) {
                      reject(new Error('Transaction failed'));
                  }
              });
          } catch (err) {
              reject(err);
          }
      });
  }

  /**
   * Realiza Unstake de LUNES
   */
  async unstake(account: any, amount: string): Promise<string> {
      const injector = await web3FromAddress(account.address);
      const units = BigInt(Math.floor(parseFloat(amount) * 1e12)).toString();

      const { gasLimit } = await this.estimateGas(
          account.address,
          'unstake',
          [units]
      );

      return new Promise(async (resolve, reject) => {
          try {
               await this.contract.tx.unstake(
                  { gasLimit },
                  units
              ).signAndSend(account.address, { signer: injector.signer }, (result) => {
                  if (result.status.isFinalized) {
                      resolve(result.txHash.toString());
                  } else if (result.isError) {
                       reject(new Error('Transaction failed'));
                  }
              });
          } catch (err) {
              reject(err);
          }
      });
  }

  /**
   * Reivindica recompensas (Claim)
   */
  async claim(account: any, projectId: string, phaseType: number = 3): Promise<string> {
       const injector = await web3FromAddress(account.address);
       const contractProjectId = this.toContractId(projectId);

       const { gasLimit } = await this.estimateGas(
           account.address,
           'claimTokens',
           [contractProjectId, phaseType]
       );

       return new Promise(async (resolve, reject) => {
           try {
               await this.contract.tx.claimTokens(
                   { gasLimit },
                   contractProjectId,
                   phaseType
               ).signAndSend(account.address, { signer: injector.signer }, (result) => {
                   if (result.status.isFinalized) {
                       resolve(result.txHash.toString());
                   } else if (result.isError) {
                       reject(new Error('Transaction failed'));
                   }
               });
           } catch (err) {
               reject(err);
           }
       });
  }
}
