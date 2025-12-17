const express = require('express');
const app = express();

app.use(express.json());

app.use('/accounts', require('./routes/account.routes'));
app.use('/', require('./routes/transaction.routes'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
