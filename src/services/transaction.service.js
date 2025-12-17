const prisma = require('../prisma');
const { calculateBalance } = require('../utils/balance');

/**
 * Deposit money into an account
 */
async function deposit({ accountId, amount, currency, description }) {
  return prisma.$transaction(async (tx) => {
    const txn = await tx.transaction.create({
      data: {
        type: 'deposit',
        destinationAccountId: accountId,
        amount,
        currency,
        status: 'completed',
        description
      }
    });

    await tx.ledgerEntry.create({
      data: {
        accountId,
        transactionId: txn.id,
        entryType: 'credit',
        amount
      }
    });

    return txn;
  });
}

/**
 * Withdraw money from an account
 */
async function withdraw({ accountId, amount, currency, description }) {
  return prisma.$transaction(async (tx) => {
    const balance = await calculateBalance(accountId);

    if (balance < amount) {
      throw new Error('INSUFFICIENT_FUNDS');
    }

    const txn = await tx.transaction.create({
      data: {
        type: 'withdrawal',
        sourceAccountId: accountId,
        amount,
        currency,
        status: 'completed',
        description
      }
    });

    await tx.ledgerEntry.create({
      data: {
        accountId,
        transactionId: txn.id,
        entryType: 'debit',
        amount
      }
    });

    return txn;
  });
}

/**
 * Transfer money between two internal accounts
 * DOUBLE-ENTRY BOOKKEEPING
 */
async function transfer({
  sourceAccountId,
  destinationAccountId,
  amount,
  currency,
  description
}) {
  if (sourceAccountId === destinationAccountId) {
    throw new Error('SAME_ACCOUNT_TRANSFER');
  }

  return prisma.$transaction(async (tx) => {
    const balance = await calculateBalance(sourceAccountId);

    if (balance < amount) {
      throw new Error('INSUFFICIENT_FUNDS');
    }

    const txn = await tx.transaction.create({
      data: {
        type: 'transfer',
        sourceAccountId,
        destinationAccountId,
        amount,
        currency,
        status: 'completed',
        description
      }
    });

    // Debit source account
    await tx.ledgerEntry.create({
      data: {
        accountId: sourceAccountId,
        transactionId: txn.id,
        entryType: 'debit',
        amount
      }
    });

    // Credit destination account
    await tx.ledgerEntry.create({
      data: {
        accountId: destinationAccountId,
        transactionId: txn.id,
        entryType: 'credit',
        amount
      }
    });

    return txn;
  });
}

module.exports = {
  deposit,
  withdraw,
  transfer
};
