import { ApiPromise } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import launchpadAbi from '../config/abi/launchpad.json';
import { lunesUtils } from '../config/lunes';

// TODO: Replace with actual contract address from environment or config
const DEFAULT_CONTRACT_ADDRESS = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'; // Alice address as placeholder

export class LaunchpoolService {
  private api: ApiPromise;
  private contract: ContractPromise;

  constructor(api: ApiPromise, contractAddress: string = DEFAULT_CONTRACT_ADDRESS) {
    this.api = api;
    // Cast api to any to avoid private property mismatch due to version differences
    this.contract = new ContractPromise(api as any, launchpadAbi, contractAddress);
  }

  /**
   * Stakes LUNES tokens into the launchpool.
   *
   * @param account The account making the transaction
   * @param amount The amount of LUNES to stake
   * @returns Transaction hash if successful
   */
  async stake(account: InjectedAccountWithMeta, amount: string): Promise<string> {
    const units = lunesUtils.toLunesUnits(amount);
    const value = BigInt(units);

    // Estimate gas
    // We use a high gas limit for estimation, or calculate it based on the call
    const gasLimit = this.api.registry.createType('WeightV2', {
      refTime: 10000000000,
      proofSize: 500000,
    }) as WeightV2;

    // Dry run to check for errors and estimate gas
    const { gasRequired, result, output } = await this.contract.query.stake(
        account.address,
        {
          gasLimit: gasLimit as any,
          storageDepositLimit: null,
          value // value to transfer
        }
    );

    // Check for dry-run errors
    if (result.isErr) {
      throw new Error(result.asErr.toString());
    }

    if (result.isOk && output) {
        // Check if the contract execution returned an Err result (Result<T, E>)
        const resultValue = output.toHuman();
        // The ABI defines Result as Ok/Err variant
        if (resultValue && typeof resultValue === 'object' && 'Err' in resultValue) {
             throw new Error(`Contract execution failed: ${JSON.stringify(resultValue)}`);
        }
    }

    // Get signer from extension
    const injector = await web3FromSource(account.meta.source);

    // Execute transaction
    return new Promise((resolve, reject) => {
      this.contract.tx
        .stake({
          gasLimit: gasRequired as any, // Use estimated gas
          storageDepositLimit: null,
          value
        })
        .signAndSend(account.address, { signer: injector.signer as any }, (result) => {
          if (result.status.isInBlock) {
            console.log('Transaction included in block');
          } else if (result.status.isFinalized) {
            console.log('Transaction finalized');
            resolve(result.txHash.toString());
          } else if (result.isError) {
             reject(new Error('Transaction failed'));
          }
        })
        .catch(reject);
    });
  }

   /**
   * Unstakes LUNES tokens from the launchpool.
   *
   * @param account The account making the transaction
   * @param amount The amount of LUNES to unstake
   * @returns Transaction hash if successful
   */
   async unstake(account: InjectedAccountWithMeta, amount: string): Promise<string> {
    const units = lunesUtils.toLunesUnits(amount);
    const value = BigInt(units);

    const gasLimit = this.api.registry.createType('WeightV2', {
      refTime: 10000000000,
      proofSize: 500000,
    }) as WeightV2;

    const { gasRequired, result, output } = await this.contract.query.unstake(
        account.address,
        {
          gasLimit: gasLimit as any,
          storageDepositLimit: null,
        },
        value // argument to unstake function
    );

    if (result.isErr) {
      throw new Error(result.asErr.toString());
    }

     if (result.isOk && output) {
        const resultValue = output.toHuman();
        if (resultValue && typeof resultValue === 'object' && 'Err' in resultValue) {
             throw new Error(`Contract execution failed: ${JSON.stringify(resultValue)}`);
        }
    }

    const injector = await web3FromSource(account.meta.source);

    return new Promise((resolve, reject) => {
      this.contract.tx
        .unstake(
          {
            gasLimit: gasRequired as any,
            storageDepositLimit: null,
          },
          value
        )
        .signAndSend(account.address, { signer: injector.signer as any }, (result) => {
          if (result.status.isInBlock) {
            console.log('Transaction included in block');
          } else if (result.status.isFinalized) {
            resolve(result.txHash.toString());
          } else if (result.isError) {
             reject(new Error('Transaction failed'));
          }
        })
        .catch(reject);
    });
  }
}
