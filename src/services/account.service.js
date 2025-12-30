const prisma = require('../prisma')
const { calculateBalance } = require('../utils/balance')

async function createAccount({ userId, accountType, currency }) {
  return prisma.account.create({
    data: {
      userId,
      type: accountType, // correct mapping
      currency,
      status: 'active'
    }
  })
}

async function getAccountById(accountId) {
  const account = await prisma.account.findUnique({
    where: { id: accountId }
  })

  if (!account) {
    throw new Error('ACCOUNT_NOT_FOUND')
  }

  // balance calculation must use transaction
  const balance = await prisma.$transaction(async (tx) => {
    return calculateBalance(tx, accountId)
  })

  return {
    ...account,
    balance: balance.toString() // Decimal → string for API
  }
}

async function getLedger(accountId) {
  return prisma.ledgerEntry.findMany({
    where: { accountId },
    orderBy: { createdAt: 'asc' }
  })
}

module.exports = {
  createAccount,
  getAccountById,
  getLedger
}
