# Financial Ledger API (Double-Entry Bookkeeping)

## 📌 Overview

The Financial Ledger API is a backend service that implements **double-entry bookkeeping principles** to manage financial transactions between accounts.  
It is designed as the core ledger system for a mock banking application, focusing on **data integrity, auditability, concurrency safety, and correctness**, rather than simple CRUD operations.

All account balances are **derived from an immutable ledger**, ensuring that the transaction history remains the single source of truth.

---

## 🎯 Objectives

- Implement double-entry bookkeeping for all financial transactions  
- Guarantee **ACID properties** for every transaction  
- Maintain an **immutable (append-only) ledger**  
- Prevent negative balances (overdrafts)  
- Safely handle **concurrent transactions**  
- Provide a clean, testable REST API  

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **ORM:** Prisma  
- **Containerization:** Docker & Docker Compose  
- **Validation:** Zod  
- **API Testing:** Postman  

---

## 🧱 Core Concepts Implemented

### Double-Entry Bookkeeping

Every transfer operation generates exactly two balanced ledger entries:

- One **debit** entry from the source account  
- One **credit** entry to the destination account  

The net sum of ledger entries for a transfer is always zero, ensuring accounting correctness.

---

### Immutable Ledger

- Ledger entries are **never updated or deleted**
- Each entry represents a permanent financial fact
- Provides a complete and verifiable audit trail

---

### Balance Calculation

Account balances are **not stored** in the database.  
Instead, balances are calculated dynamically from the ledger:

Balance = Σ (credits) − Σ (debits)

This approach ensures:
- Strong consistency
- No risk of balance drift
- Protection against data corruption

All calculations use **high-precision decimal types**, avoiding floating-point rounding errors.

---

## 📂 Project Structure

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
│   ├── validators/
│   │   └── transaction.validator.js
│   └── utils/
│       └── balance.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── postman/
│   └── ledger-api.postman_collection.json
├── evidence/
│   └── verification responses
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

---

## 🗄️ Database Schema (ERD)

### Account
- id (UUID, PK)
- userId
- type
- currency
- status
- createdAt

### Transaction
- id (UUID, PK)
- type (deposit / withdrawal / transfer)
- sourceAccountId
- destinationAccountId
- amount
- currency
- status
- description
- createdAt

### LedgerEntry
- id (UUID, PK)
- accountId (FK → Account)
- transactionId (FK → Transaction)
- entryType (debit / credit)
- amount
- createdAt

---

## 🔐 ACID Transaction Strategy

All financial operations are wrapped inside a **single database transaction** using Prisma:

- Transaction record creation  
- Ledger entry creation  
- Balance validation  

If any step fails, the entire transaction is **rolled back**, preserving database consistency and integrity.

---

## 🔄 Transaction Isolation & Concurrency

- Critical financial operations use **Serializable isolation**
- Prevents race conditions during concurrent withdrawals or transfers
- Ensures balance checks always operate on consistent data

The system safely handles concurrent requests without allowing overdrafts.

---

## 🚫 Negative Balance Prevention

Before creating any debit entry:

1. Current balance is calculated from the ledger **within the transaction**
2. If the resulting balance would be negative:
   - The transaction is rejected
   - All changes are rolled back
   - API returns `422 Unprocessable Entity`

---

## 🌐 API Endpoints

### Account APIs
- POST /accounts – Create a new account  
- GET /accounts/:id – Retrieve account details with calculated balance  
- GET /accounts/:id/ledger – Retrieve ledger entries for an account  

### Transaction APIs
- POST /deposits – Deposit money into an account  
- POST /withdrawals – Withdraw money from an account  
- POST /transfers – Transfer money between accounts (double-entry)  

---

## 🧪 API Testing

A complete Postman collection is included:

postman/ledger-api.postman_collection.json

It demonstrates:
- Account creation
- Deposits and transfers
- Balance verification
- Overdraft prevention
- Ledger immutability

Sample verified API responses are available in the /evidence folder.

---

## 🐳 Running the Project (Docker)

### Prerequisites
- Docker
- Docker Compose

### Start the Application
docker-compose up --build

### Services
- API: http://localhost:8000  
- PostgreSQL: localhost:5432  

---

## ⚙️ Environment Variables

Create a .env file (not committed):

DATABASE_URL=postgresql://postgres:postgres@db:5432/ledgerdb

---

## 🔎 Input Validation & Error Handling

All financial endpoints implement **strict input validation using Zod**.

- Negative amounts, malformed UUIDs, and missing fields are rejected at the API boundary
- Invalid requests return `400 Bad Request`
- Business rule violations (e.g., insufficient funds) return `422 Unprocessable Entity`

This ensures strong data integrity, security, and predictable API behavior under invalid or malicious input.

---

## 🧾 Submission Notes

- Ledger entries are immutable and append-only  
- Balances are derived, never stored  
- Financial precision is preserved using decimal arithmetic  
- Concurrency safety and rollback guarantees are enforced  
- Designed for **correctness and auditability over convenience**
