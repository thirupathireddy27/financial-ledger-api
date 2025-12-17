const prisma = require('../prisma');

async function calculateBalance(accountId) {
  const entries = await prisma.ledgerEntry.findMany({
    where: { accountId }
  });

  return entries.reduce((balance, entry) => {
    if (entry.entryType === 'credit') {
      return balance + entry.amount.toNumber();
    }
    return balance - entry.amount.toNumber();
  }, 0);
}

module.exports = { calculateBalance };
    