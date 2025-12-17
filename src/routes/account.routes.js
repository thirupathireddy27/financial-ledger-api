const express = require('express');
const router = express.Router();

const {
  createAccount,
  getAccountById,
  getLedger
} = require('../services/account.service');

/**
 * Create a new account
 * POST /accounts
 */
router.post('/', async (req, res) => {
  try {
    const account = await createAccount(req.body);
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Get account details + balance
 * GET /accounts/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const account = await getAccountById(req.params.id);
    res.json(account);
  } catch (err) {
    if (err.message === 'ACCOUNT_NOT_FOUND') {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get ledger entries for an account
 * GET /accounts/:id/ledger
 */
router.get('/:id/ledger', async (req, res) => {
  try {
    const ledger = await getLedger(req.params.id);
    res.json(ledger);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
