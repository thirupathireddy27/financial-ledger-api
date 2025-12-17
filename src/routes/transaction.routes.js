const express = require('express');
const router = express.Router();

const {
  deposit,
  withdraw,
  transfer
} = require('../services/transaction.service');

/**
 * Deposit funds
 * POST /deposits
 */
router.post('/deposits', async (req, res) => {
  try {
    const txn = await deposit(req.body);
    res.status(201).json(txn);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Withdraw funds
 * POST /withdrawals
 */
router.post('/withdrawals', async (req, res) => {
  try {
    const txn = await withdraw(req.body);
    res.status(201).json(txn);
  } catch (err) {
    if (err.message === 'INSUFFICIENT_FUNDS') {
      return res.status(422).json({ error: 'Insufficient funds' });
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * Transfer funds (double-entry)
 * POST /transfers
 */
router.post('/transfers', async (req, res) => {
  try {
    const txn = await transfer(req.body);
    res.status(201).json(txn);
  } catch (err) {
    if (err.message === 'INSUFFICIENT_FUNDS') {
      return res.status(422).json({ error: 'Insufficient funds' });
    }
    if (err.message === 'SAME_ACCOUNT_TRANSFER') {
      return res.status(400).json({ error: 'Source and destination cannot be same' });
    }
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
