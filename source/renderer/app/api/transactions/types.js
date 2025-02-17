// @flow
import BigNumber from 'bignumber.js';
import { WalletTransaction } from '../../domains/WalletTransaction';
import { WalletUnits } from '../../domains/Wallet';
import type { DelegationAction } from '../../types/stakingTypes';
import type { AssetItems } from '../assets/types';
import type { TransactionMetadata } from '../../types/TransactionMetadata';

export type TransactionAmount = {
  quantity: number,
  unit: WalletUnits.LOVELACE,
};

export type TransactionDepth = {
  quantity: number,
  unit: 'block',
};

export type TransactionInsertionBlock = {
  slot_number: number,
  epoch_number: number,
};

export type Transaction = {
  id: string,
  amount: TransactionAmount,
  fee: {
    quantity: number,
    unit: WalletUnits.LOVELACE,
  },
  deposit: {
    quantity: number,
    unit: WalletUnits.LOVELACE,
  },
  inserted_at?: {
    time: Date,
    block: TransactionInsertionBlock,
  },
  pending_since?: {
    time: Date,
    block: {
      ...TransactionInsertionBlock,
      height: {
        quantity: number,
        unit: string,
      },
    },
  },
  depth: TransactionDepth,
  direction: 'outgoing' | 'incoming',
  inputs: Array<TransactionInputs>,
  outputs: Array<TransactionOutputs>,
  withdrawals: Array<TransactionWithdrawals>,
  status: TransactionState,
  metadata?: TransactionMetadata,
};

export type Transactions = Array<Transaction>;

export type TransactionInputs = {
  address: string,
  amount?: TransactionAmount,
  assets?: AssetItems,
  id: string,
  index: number,
};

export type TransactionOutputs = {
  address: string,
  amount: TransactionAmount,
  assets?: AssetItems,
};

export type TransactionWithdrawals = {
  stake_address: string,
  amount: TransactionAmount,
};
export type TransactionWithdrawalType = 'self' | Array<string>;

export type TransactionState = 'pending' | 'in_ledger' | 'expired';

export type TransactionAddresses = {
  from: Array<?string>,
  to: Array<string>,
  withdrawals: Array<string>,
};

export type TransactionType = 'card' | 'expend' | 'income' | 'exchange';

// Req / Res Transaction Types
export type GetTransactionsRequest = {
  walletId: string,
  order?: 'ascending' | 'descending',
  fromDate: ?string,
  toDate: ?string,
  isLegacy: boolean,
  isHardwareWallet?: boolean,
  // @API TODO - Params "pending" for V2
  // searchTerm: string,
  // skip: number,
  // limit: number,
  // isFirstLoad: boolean,
  // isRestoreActive: boolean,
  // isRestoreCompleted: boolean,
  // cachedTransactions: Array<WalletTransaction>,
};

export type GetTransactionRequest = {
  walletId: string,
  transactionId: string,
};

export type GetTransactionFeeRequest = {
  walletId: string,
  address: string,
  amount: number,
  assets?: AssetItems,
  walletBalance: BigNumber,
  availableBalance: BigNumber,
  rewardsBalance: BigNumber,
  isLegacy: boolean,
  withdrawal?: 'self' | Array<string>,
};

export type GetTransactionFeeResponse = {
  fee: BigNumber,
  minimumAda: BigNumber,
};

export type CreateTransactionRequest = {
  walletId: string,
  address: string,
  amount: number,
  passphrase: string,
  isLegacy: boolean,
  assets?: AssetItems,
  withdrawal?: 'self' | Array<string>,
};

export type DeleteTransactionRequest = {
  walletId: string,
  transactionId: string,
  isLegacy: boolean,
};

export type GetTransactionsResponse = {
  transactions: Array<WalletTransaction>,
  total: number,
};

export type TransactionParams = {
  walletId: string,
  data: {
    payments: Array<TransactionPaymentData>,
    passphrase: string,
  },
};

export type TransactionFeeAmount = {
  quantity: number,
  unit: WalletUnits.LOVELACE,
};

export type GetTransactionFeeParams = {
  walletId: string,
  data: {
    payments: Array<TransactionPaymentData>,
  },
};

export type TransactionPaymentData = {
  address: string,
  amount: TransactionFeeAmount,
  assets?: AssetItems,
};

export type TransactionFee = {
  estimated_min: TransactionFeeAmount,
  estimated_max: TransactionFeeAmount,
  deposit: TransactionFeeAmount,
  minimum_coins: Array<TransactionFeeAmount>,
};

export type CoinSelectionAmount = {
  quantity: number,
  unit: WalletUnits.LOVELACE,
};

export type CoinSelectionInput = {
  address: string,
  amount: CoinSelectionAmount,
  id: string,
  index: number,
  derivationPath: Array<string>,
};

export type Asset = {
  policyId: string,
  assetName: string,
  quantity: number,
};

export type CoinSelectionOutput = {
  address: string,
  amount: CoinSelectionAmount,
  derivationPath: Array<string>,
  assets?: Array<Asset>,
};

export type CertificateType =
  | 'register_reward_account'
  | 'quit_pool'
  | 'join_pool';

export type CoinSelectionCertificate = {
  pool: string,
  certificateType: CertificateType,
  rewardAccountPath: Array<string>,
};

export type CoinSelectionCertificates = Array<CoinSelectionCertificate>;

export type CoinSelectionWithdrawal = {
  stakeAddress: string,
  derivationPath: Array<string>,
  amount: CoinSelectionAmount,
};

export type CoinSelectionWithdrawals = Array<CoinSelectionWithdrawal>;

export type CoinSelectionsDelegationRequestType = {
  walletId: string,
  poolId: string,
  delegationAction: DelegationAction,
};

export type CoinSelectionsPaymentRequestType = {
  walletId: string,
  address: string,
  amount: number,
  assets?: AssetItems,
};

export type CoinSelectionsRequest =
  | CoinSelectionsPaymentRequestType
  | CoinSelectionsDelegationRequestType;

export type CoinSelectionsResponse = {
  inputs: Array<CoinSelectionInput>,
  outputs: Array<CoinSelectionOutput>,
  certificates: CoinSelectionCertificates,
  deposits: BigNumber,
  depositsReclaimed: BigNumber,
  withdrawals: Array<CoinSelectionWithdrawal>,
  fee: BigNumber,
};

export type CreateExternalTransactionRequest = {
  signedTransactionBlob: Buffer,
};

export type CreateExternalTransactionResponse = {
  id: string,
};

export type GetWithdrawalsRequest = {
  walletId: string,
};

export type GetWithdrawalsResponse = {
  withdrawals: BigNumber,
};

export type CoinSelectionAssetsType = Array<Asset>;
