# 💳 Payment Gateway Challenge - Backend API

## 📝 Overview
This repository contains the backend service for a payment gateway onboarding process. It handles product stock management, customer data, deliveries, and secure payment transactions.

The API is built using **NestJS** and strictly follows **Hexagonal Architecture (Ports and Adapters)** to ensure a clean, maintainable, and decoupled codebase. It also implements **Railway Oriented Programming (ROP)** principles for robust, predictable error handling across all use cases.

## ⚙️ Tech Stack
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (via Supabase)
- **Architecture:** Hexagonal (Ports & Adapters) & ROP
- **Testing:** Jest (Targeting >80% coverage)
- **Deployment:** AWS (ECS/Docker - `https://wcq9jnemqv.us-east-2.awsapprunner.com/`)

## 🏗️ Architecture & Folder Structure
The project is divided into strictly isolated layers to protect the domain logic from external frameworks or database changes.

```
src/
├── modules/
│   ├── stock/              # Product and inventory management
│   │   ├── application/    # Use Cases (GetProducts, UpdateStock)
│   │   ├── domain/         # Entities and Repository Interfaces (Ports)
│   │   └── infrastructure/ # Controllers and Supabase Adapter
│   └── transaction/        # Payment processing and orders
│       ├── application/    # ProcessPayment Use Case (ROP)
│       ├── domain/         # Transaction Entity and Payment Port
│       └── infrastructure/ # Controller and Wompi Adapter
├── app.module.ts           # Global module integration
└── main.ts                 # Entry point and Swagger configuration
```

## 📊 Data Model Design
Relational database design optimized for transaction persistence and stock control.
```
-- PostgreSQL Schema (Supabase)

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  status TEXT NOT NULL DEFAULT 'PENDING',
  wompi_id TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id)
);

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_modtime
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
```

## 🚀 Deployment & Infrastructure
The application is deployed in the cloud using containers to ensure environment parity.
- **Cloud Provider:** AWS (Amazon Web Services).
- **Containerization:** Docker.
- **Orchestration:** AWS App Runner (connected to Amazon ECR).
- **CI/CD:** GitHub Actions for automated deployment upon merging to `main`.
- **Live API URL:** `https://wcq9jnemqv.us-east-2.awsapprunner.com`

## 🛠️ API Documentation
The application is deployed in the cloud using containers to ensure environment parity.
- **Swagger UI:** `https://wcq9jnemqv.us-east-2.awsapprunner.com/api` .
- **Postman Collection:** Find the Payment_Challenge.postman_collection.json file in the root of this repository.

## 🧪 Testing & Quality
Jest is used to ensure the integrity of the business logic.
```
# Run unit tests
npm run test

# Run test coverage
npm run test:cov
```

### Final Coverage Report
| Category | Percentage |
|----------|------------|
| **Statements** | 87.55% |
| **Branches** | 62.16% |
| **Functions** | 84.84% |
| **Lines** | 85.86% |

**Key Highlights:**
- All Use Cases (Business Logic) have **>96% coverage**.
- Domain Entities (Core Rules) have **100% coverage**.
- Infrastructure adapters (Wompi, Supabase) are fully tested using mocks.

- **Coverage Target:** >80% (Results being updated in the `feat/testing-and-docs` branch).

## ⚙️ Installation & Running the App

```
# Install dependencies
npm install

# Start development server
npm run start:dev
```