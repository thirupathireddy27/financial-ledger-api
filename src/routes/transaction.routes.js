const express = require('express')
const {
  depositSchema,
  withdrawSchema,
  transferSchema
} = require('../validators/transaction.validator')
const router = express.Router()

const {
  deposit,
  withdraw,
  transfer
} = require('../services/transaction.service')

/**
 * POST /deposits
 */
router.post('/deposits', async (req, res) => {
  const parsed = depositSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0].message
    })
  }

  try {
    const txn = await deposit(parsed.data)
    res.status(201).json(txn)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})




/**
 * POST /withdrawals
 */
router.post('/withdrawals', async (req, res) => {
  const parsed = withdrawSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0].message
    })
  }

  try {
    const txn = await withdraw(parsed.data)
    res.status(201).json(txn)
  } catch (err) {
    if (err.message === 'INSUFFICIENT_FUNDS') {
      return res.status(422).json({ error: 'Insufficient funds' })
    }
    res.status(400).json({ error: err.message })
  }
})


/**
 * POST /transfers
 */
router.post('/transfers', async (req, res) => {
  const parsed = transferSchema.safeParse(req.body)

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0].message
    })
  }

  try {
    const txn = await transfer(parsed.data)
    res.status(201).json(txn)
  } catch (err) {
    if (err.message === 'INSUFFICIENT_FUNDS') {
      return res.status(422).json({ error: 'Insufficient funds' })
    }
    res.status(400).json({ error: err.message })
  }
})


module.exports = router   // 🔥 THIS IS CRITICAL
