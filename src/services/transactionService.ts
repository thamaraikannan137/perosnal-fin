import type { Transaction, TransactionCreateInput, TransactionUpdateInput } from '../types';
import { assetService } from './assetService';
import { liabilityService } from './liabilityService';

const TRANSACTION_STORAGE_KEY = 'mockTransactions';

// Initialize mock transactions in local storage if not present
const initializeTransactions = () => {
  if (!localStorage.getItem(TRANSACTION_STORAGE_KEY)) {
    const mockTransactions: Transaction[] = [
      {
        id: 'txn-1',
        liabilityId: 'liability-1',
        type: 'emi_payment',
        amount: 50000,
        date: '2023-10-15',
        description: 'EMI Payment - October',
        notes: 'Monthly EMI payment for home loan',
        createdAt: '2023-10-15T10:00:00Z',
        updatedAt: '2023-10-15T10:00:00Z',
      },
      {
        id: 'txn-2',
        liabilityId: 'liability-1',
        type: 'emi_payment',
        amount: 50000,
        date: '2023-09-15',
        description: 'EMI Payment - September',
        notes: 'Monthly EMI payment for home loan',
        createdAt: '2023-09-15T10:00:00Z',
        updatedAt: '2023-09-15T10:00:00Z',
      },
      {
        id: 'txn-3',
        liabilityId: 'liability-2',
        type: 'emi_payment',
        amount: 25000,
        date: '2023-10-10',
        description: 'EMI Payment - October',
        notes: 'Monthly EMI payment for car loan',
        createdAt: '2023-10-10T10:00:00Z',
        updatedAt: '2023-10-10T10:00:00Z',
      },
      {
        id: 'txn-4',
        assetId: 'asset-1',
        type: 'deposit',
        amount: 100000,
        date: '2023-10-20',
        description: 'Salary Deposit',
        notes: 'Monthly salary credit',
        createdAt: '2023-10-20T10:00:00Z',
        updatedAt: '2023-10-20T10:00:00Z',
      },
    ];
    localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(mockTransactions));
  }
};

initializeTransactions();

const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to update asset/liability balance based on transaction
const updateBalanceFromTransaction = async (transaction: Transaction, isDelete = false) => {
  const multiplier = isDelete ? -1 : 1;

  if (transaction.assetId) {
    const asset = await assetService.getAssetById(transaction.assetId);
    if (asset) {
      let newValue = asset.value;
      if (transaction.type === 'deposit' || transaction.type === 'interest') {
        newValue += transaction.amount * multiplier;
      } else if (transaction.type === 'withdrawal' || transaction.type === 'payment') {
        newValue -= transaction.amount * multiplier;
      }
      await assetService.updateAsset(transaction.assetId, { value: Math.max(0, newValue) });
    }
  }

  if (transaction.liabilityId) {
    const liability = await liabilityService.getLiabilityById(transaction.liabilityId);
    if (liability) {
      let newBalance = liability.balance;
      if (transaction.type === 'emi_payment' || transaction.type === 'payment') {
        newBalance -= transaction.amount * multiplier;
      } else if (transaction.type === 'adjustment') {
        // Adjustments can increase or decrease balance based on amount sign
        newBalance += transaction.amount * multiplier;
      }
      await liabilityService.updateLiability(transaction.liabilityId, { balance: Math.max(0, newBalance) });
    }
  }
};

export const transactionService = {
  getTransactions: async (filters?: { assetId?: string; liabilityId?: string }): Promise<Transaction[]> => {
    await simulateDelay(300);
    const transactions = JSON.parse(localStorage.getItem(TRANSACTION_STORAGE_KEY) || '[]') as Transaction[];
    
    if (filters) {
      return transactions.filter((txn) => {
        if (filters.assetId && txn.assetId !== filters.assetId) return false;
        if (filters.liabilityId && txn.liabilityId !== filters.liabilityId) return false;
        return true;
      });
    }
    
    return transactions;
  },

  getTransactionById: async (id: string): Promise<Transaction | undefined> => {
    await simulateDelay(200);
    const transactions = JSON.parse(localStorage.getItem(TRANSACTION_STORAGE_KEY) || '[]') as Transaction[];
    return transactions.find((txn) => txn.id === id);
  },

  createTransaction: async (transaction: TransactionCreateInput): Promise<Transaction> => {
    await simulateDelay(400);
    const transactions = JSON.parse(localStorage.getItem(TRANSACTION_STORAGE_KEY) || '[]') as Transaction[];
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...transaction,
    };
    transactions.push(newTransaction);
    localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
    
    // Update asset/liability balance automatically
    await updateBalanceFromTransaction(newTransaction);
    
    return newTransaction;
  },

  updateTransaction: async (id: string, changes: TransactionUpdateInput): Promise<Transaction> => {
    await simulateDelay(400);
    const transactions = JSON.parse(localStorage.getItem(TRANSACTION_STORAGE_KEY) || '[]') as Transaction[];
    const index = transactions.findIndex((txn) => txn.id === id);
    if (index === -1) throw new Error('Transaction not found');

    const oldTransaction = transactions[index];
    
    // Revert old transaction's effect
    await updateBalanceFromTransaction(oldTransaction, true);
    
    const updatedTransaction = {
      ...oldTransaction,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    transactions[index] = updatedTransaction;
    localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(transactions));
    
    // Apply new transaction's effect
    await updateBalanceFromTransaction(updatedTransaction);
    
    return updatedTransaction;
  },

  deleteTransaction: async (id: string): Promise<void> => {
    await simulateDelay(300);
    const transactions = JSON.parse(localStorage.getItem(TRANSACTION_STORAGE_KEY) || '[]') as Transaction[];
    const transactionToDelete = transactions.find((txn) => txn.id === id);
    
    if (transactionToDelete) {
      // Revert the transaction's effect on balance
      await updateBalanceFromTransaction(transactionToDelete, true);
    }
    
    const filtered = transactions.filter((txn) => txn.id !== id);
    localStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(filtered));
  },
};

