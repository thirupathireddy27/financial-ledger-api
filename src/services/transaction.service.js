const prisma = require('../prisma')
const { Prisma } = require('@prisma/client')
const { calculateBalance } = require('../utils/balance')

/**
 * Deposit money into an account
 */
async function deposit({ accountId, amount, currency, description }) {
  return prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.create({
      data: {
        type: 'deposit',
        destinationAccountId: accountId,
        amount,
        currency,
        status: 'completed',
        description
      }
    })

    await tx.ledgerEntry.create({
      data: {
        accountId,
        transactionId: transaction.id,
        entryType: 'credit',
        amount
      }
    })

    return transaction
  })
}

/**
 * Withdraw money from an account (CONCURRENCY SAFE)
 */
async function withdraw({ accountId, amount, currency, description }) {
  return prisma.$transaction(
    async (tx) => {
      const balance = await calculateBalance(tx, accountId)

      if (balance.minus(amount).isNegative()) {
        throw new Error('INSUFFICIENT_FUNDS')
      }

      const transaction = await tx.transaction.create({
        data: {
          type: 'withdrawal',
          sourceAccountId: accountId,
          amount,
          currency,
          status: 'completed',
          description
        }
      })

      await tx.ledgerEntry.create({
        data: {
          accountId,
          transactionId: transaction.id,
          entryType: 'debit',
          amount
        }
      })

      return transaction
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    }
  )
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
  return prisma.$transaction(
    async (tx) => {
      const balance = await calculateBalance(tx, sourceAccountId)

      if (balance.minus(amount).isNegative()) {
        throw new Error('INSUFFICIENT_FUNDS')
      }

      const transaction = await tx.transaction.create({
        data: {
          type: 'transfer',
          sourceAccountId,
          destinationAccountId,
          amount,
          currency,
          status: 'completed',
          description
        }
      })

      await tx.ledgerEntry.createMany({
        data: [
          {
            accountId: sourceAccountId,
            transactionId: transaction.id,
            entryType: 'debit',
            amount
          },
          {
            accountId: destinationAccountId,
            transactionId: transaction.id,
            entryType: 'credit',
            amount
          }
        ]
      })

      return transaction
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    }
  )
}

module.exports = {
  deposit,
  withdraw,
  transfer
}
