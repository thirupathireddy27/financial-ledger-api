const prisma = require('../prisma');
const { calculateBalance } = require('../utils/balance');

async function createAccount(data) {
  return prisma.account.create({
    data
  });
}

async function getAccountById(accountId) {
  const account = await prisma.account.findUnique({
    where: { id: accountId }
  });

  if (!account) {
    throw new Error('ACCOUNT_NOT_FOUND');
  }

  const balance = await calculateBalance(accountId);

  return { ...account, balance };
}

async function getLedger(accountId) {
  return prisma.ledgerEntry.findMany({
    where: { accountId },
    orderBy: { createdAt: 'asc' }
  });
}

module.exports = {
  createAccount,
  getAccountById,
  getLedger
};
