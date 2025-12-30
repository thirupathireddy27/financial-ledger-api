import { Prisma } from '@prisma/client'

export async function calculateBalance(tx, accountId) {
  const entries = await tx.ledgerEntry.findMany({
    where: { accountId }
  })

  let balance = new Prisma.Decimal(0)

  for (const entry of entries) {
    if (entry.entryType === 'credit') {
      balance = balance.plus(entry.amount)
    } else {
      balance = balance.minus(entry.amount)
    }
  }

  return balance // <-- Decimal only
}
