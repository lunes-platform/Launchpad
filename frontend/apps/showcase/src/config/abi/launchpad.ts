// ABI parcial para os métodos que precisamos
export const LAUNCHPAD_ABI = {
  source: {
    hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
    language: 'ink! 4.0.0',
    compiler: 'rustc 1.70.0',
    wasm: '0x'
  },
  contract: {
    name: 'complete_launchpad',
    version: '1.0.0',
    authors: ['Lunes Team']
  },
  spec: {
    constructors: [],
    docs: [],
    events: [],
    lang_error: {
      name: 'LangError',
      type: 0
    },
    messages: [
      {
        args: [
          {
            label: 'user',
            type: 1 // AccountId
          }
        ],
        docs: ['Ver informações de stake do usuário'],
        label: 'get_stake_info',
        mutates: false,
        payable: false,
        returnType: 2 // StakeInfo
      },
      {
        args: [
          {
            label: 'user',
            type: 1 // AccountId
          },
          {
            label: 'project_id',
            type: 6 // Hash
          }
        ],
        docs: ['Ver alocação do usuário em um projeto'],
        label: 'get_user_launchpool_allocation',
        mutates: false,
        payable: false,
        returnType: 7 // Option<UserAllocation>
      },
      {
        args: [
          {
            label: 'user',
            type: 1 // AccountId
          },
          {
             label: 'project_id',
             type: 6 // Hash
          },
          {
            label: 'phase_type',
            type: 8 // PhaseType
          }
        ],
        docs: ['Get claimable amount'],
        label: 'get_claimable_amount',
        mutates: false,
        payable: false,
        returnType: 3 // Balance
      },
       {
        args: [],
        docs: ['Stake LUNES'],
        label: 'stake',
        mutates: true,
        payable: true,
        returnType: 9 // Result<(), Error>
      },
      {
        args: [
           {
            label: 'amount',
            type: 3 // Balance
          }
        ],
        docs: ['Unstake LUNES'],
        label: 'unstake',
        mutates: true,
        payable: false,
        returnType: 9 // Result<(), Error>
      },
      {
        args: [
             {
            label: 'project_id',
            type: 6 // Hash
          },
           {
            label: 'phase_type',
            type: 8 // PhaseType
          }
        ],
        docs: ['Claim Tokens'],
        label: 'claim_tokens',
        mutates: true,
        payable: false,
        returnType: 10 // Result<Balance, Error>
      }
    ]
  },
  types: [
    {
      id: 0,
      type: {
        def: {
          variant: {
            variants: [
              { index: 0, name: 'CouldNotReadInput' }
            ]
          }
        }
      }
    },
    {
      id: 1,
      type: {
        def: {
          composite: {
            fields: [
              { type: 4, typeName: '[u8; 32]' }
            ]
          }
        },
        path: ['ink_primitives', 'types', 'AccountId']
      }
    },
    {
      id: 2,
      type: {
        def: {
          composite: {
            fields: [
              { name: 'amount', type: 3, typeName: 'u128' },
              { name: 'last_stake_time', type: 5, typeName: 'u64' },
              { name: 'unlock_time', type: 5, typeName: 'u64' },
              { name: 'is_participating', type: 11, typeName: 'bool' }
            ]
          }
        },
        path: ['launchpool_system', 'StakeInfo']
      }
    },
    {
      id: 3,
      type: {
        def: {
          primitive: 'u128'
        }
      }
    },
    {
      id: 4,
      type: {
        def: {
          array: { len: 32, type: 12 }
        }
      }
    },
    {
      id: 5,
      type: {
        def: {
          primitive: 'u64'
        }
      }
    },
    {
       id: 6,
       type: {
         def: {
           composite: {
             fields: [
               { type: 4, typeName: '[u8; 32]' }
             ]
           }
         },
         path: ['ink_primitives', 'types', 'Hash']
       }
    },
    {
      id: 7,
      type: {
        def: {
          variant: {
            variants: [
              { index: 0, name: 'None' },
              { index: 1, name: 'Some', fields: [{ type: 13 }] }
            ]
          }
        }
      }
    },
     {
      id: 8,
      type: {
        def: {
           variant: {
            variants: [
              { index: 0, name: 'Whitelist' },
              { index: 1, name: 'PreSale' },
              { index: 2, name: 'PublicSale' },
              { index: 3, name: 'Launchpool' },
              { index: 4, name: 'Raffle' },
            ]
          }
        }
      }
    },
    {
      id: 9,
      type: {
        def: {
          variant: {
            variants: [
              { index: 0, name: 'Ok', fields: [{ type: 14 }] },
              { index: 1, name: 'Err', fields: [{ type: 15 }] }
            ]
          }
        }
      }
    },
    {
       id: 10,
      type: {
        def: {
          variant: {
            variants: [
              { index: 0, name: 'Ok', fields: [{ type: 3 }] },
              { index: 1, name: 'Err', fields: [{ type: 15 }] }
            ]
          }
        }
      }
    },
    {
      id: 11,
      type: {
        def: {
          primitive: 'bool'
        }
      }
    },
    {
      id: 12,
      type: {
        def: {
          primitive: 'u8'
        }
      }
    },
    {
      id: 13,
      type: {
        def: {
          composite: {
            fields: [
              { name: 'max_allocation', type: 3, typeName: 'u128' },
              { name: 'purchased_amount', type: 3, typeName: 'u128' },
              { name: 'staking_power', type: 16, typeName: 'u32' },
              { name: 'is_calculated', type: 11, typeName: 'bool' }
            ]
          }
        }
      }
    },
    {
      id: 14,
      type: {
        def: {
          tuple: []
        }
      }
    },
    {
      id: 15,
      type: {
        def: {
           variant: {
            variants: [
                { index: 0, name: 'NotAuthorized' },
                { index: 1, name: 'Paused' },
                // ... outros erros
            ]
           }
        }
      }
    },
    {
      id: 16,
      type: {
        def: {
          primitive: 'u32'
        }
      }
    }
  ]
};
