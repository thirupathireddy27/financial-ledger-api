Financial Ledger API (Double-Entry Bookkeeping)
📌 Overview

The Financial Ledger API is a backend service that implements double-entry bookkeeping principles to manage financial transactions between accounts.
It is designed as the core ledger system for a mock banking application, focusing on data integrity, auditability, and correctness rather than simple CRUD operations.

All balances are derived from an immutable ledger, ensuring that the transaction history is the single source of truth.

🎯 Objectives

Implement double-entry bookkeeping for all financial transactions

Guarantee ACID properties for every transaction

Maintain an immutable ledger (append-only)

Prevent negative balances (overdrafts)

Safely handle concurrent transactions

Provide a clean, testable REST API

🛠️ Tech Stack

Backend: Node.js, Express.js

Database: PostgreSQL

ORM: Prisma

Containerization: Docker & Docker Compose

API Testing: Postman

🧱 Core Concepts Implemented
Double-Entry Bookkeeping

Every transfer generates:

One debit entry (source account)

One credit entry (destination account)

The net sum of ledger entries for a transfer is zero

Immutable Ledger

Ledger entries are never updated or deleted

Each entry represents a historical financial fact

Ensures a full audit trail

Balance Calculation

Account balance is not stored in the database

Balance is calculated dynamically as:

Balance = Σ (credits) − Σ (debits)


This ensures consistency and prevents data corruption.

📂 Project Structure
financial-ledger-api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── prisma.js
│   ├── routes/
│   │   ├── account.routes.js
│   │   └── transaction.routes.js
│   ├── services/
│   │   ├── account.service.js
│   │   └── transaction.service.js
│   └── utils/
│       └── balance.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── postman/
│   └── ledger-api.postman_collection.json
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

🗄️ Database Schema (ERD)
Account

id (UUID, PK)

userId

type

currency

status

createdAt

Transaction

id (UUID, PK)

type (deposit / withdrawal / transfer)

sourceAccountId

destinationAccountId

amount

currency

status

description

createdAt

LedgerEntry

id (UUID, PK)

accountId (FK → Account)

transactionId (FK → Transaction)

entryType (debit / credit)

amount

createdAt

🔐 ACID Transaction Strategy

All financial operations are wrapped inside a single database transaction using Prisma:

Ledger entries

Transaction record creation

Balance validation

If any step fails, the entire transaction is rolled back, preserving database consistency.

🔄 Transaction Isolation Level

PostgreSQL default: READ COMMITTED

Prevents dirty reads

Ensures each transaction sees only committed data

Safe for concurrent financial operations

🚫 Negative Balance Prevention

Before creating any debit entry:

Current balance is calculated from the ledger

If balance < withdrawal/transfer amount:

Transaction is rejected

Database changes are rolled back

API returns 422 Unprocessable Entity

🌐 API Endpoints
Account APIs

POST /accounts – Create a new account

GET /accounts/:id – Get account details with balance

GET /accounts/:id/ledger – Get account ledger entries

Transaction APIs

POST /deposits – Deposit money

POST /withdrawals – Withdraw money

POST /transfers – Transfer money (double-entry)

🧪 API Testing

A complete Postman collection is included:

postman/ledger-api.postman_collection.json


It demonstrates:

Account creation

Deposits

Transfers

Balance verification

Overdraft prevention

🐳 Running the Project (Docker)
Prerequisites

Docker

Docker Compose

Start the Application
docker-compose up --build

Services

API: http://localhost:8000

PostgreSQL: localhost:5432

⚙️ Environment Variables

Create a .env file (not committed):

DATABASE_URL=postgresql://postgres:postgres@db:5432/ledgerdb

🧾 Submission Notes

Ledger entries are immutable

Balances are derived, not stored

System safely handles concurrent requests

Designed for correctness over convenience