const { z } = require('zod')

const amountSchema = z.string().refine(
  (val) => {
    const n = Number(val)
    return !isNaN(n) && n > 0
  },
  { message: 'Amount must be a positive number' }
)

exports.depositSchema = z.object({
  accountId: z.string().uuid(),
  amount: amountSchema,
  currency: z.string().min(1),
  description: z.string().optional()
})

exports.transferSchema = z.object({
  sourceAccountId: z.string().uuid(),
  destinationAccountId: z.string().uuid(),
  amount: amountSchema,
  currency: z.string().min(1),
  description: z.string().optional()
})

exports.withdrawSchema = z.object({
  accountId: z.string().uuid(),
  amount: amountSchema,
  currency: z.string().min(1),
  description: z.string().optional()
})
