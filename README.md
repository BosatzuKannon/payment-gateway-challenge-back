# Payment Gateway Challenge - Backend API

## Overview
This repository contains the backend service for a payment gateway onboarding process. It handles product stock management, customer data, deliveries, and secure payment transactions.

The API is built using **NestJS** and strictly follows **Hexagonal Architecture (Ports and Adapters)** to ensure a clean, maintainable, and decoupled codebase. It also implements **Railway Oriented Programming (ROP)** principles for robust, predictable error handling across all use cases.

## Tech Stack
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (via Supabase)
- **Architecture:** Hexagonal (Ports & Adapters) & ROP
- **Testing:** Jest (Targeting >80% coverage)
- **Deployment:** AWS (ECS/Docker - *Pending link*)

## Architecture & Folder Structure
The project is divided into strictly isolated layers to protect the domain logic from external frameworks or database changes.

```
src/
├── core/                   # Shared kernel (ROP implementations, base entities)
├── modules/
│   ├── stock/              # Stock context
│   │   ├── domain/         # Entities, Repositories interfaces (Ports)
│   │   ├── application/    # Use Cases (ROP), DTOs
│   │   └── infrastructure/ # Controllers, Supabase Adapters, Nest Modules
│   ├── transaction/        # Transaction & Payment context
│   ├── customer/           # Customer context
│   └── delivery/           # Delivery context
└── main.ts                 # Application entry point
```

## Data Model Design
*Draft of the core entities required for the business process.* 

- **Products (Stock):** `id`, `name`, `description`, `price`, `stock_quantity`, `created_at`
- **Customers:** `id`, `email`, `full_name`, `phone_number`, `created_at`
- **Transactions:** `id`, `customer_id`, `product_id`, `amount`, `status` (PENDING, APPROVED, FAILED), `external_reference`, `created_at`
- **Deliveries:** `id`, `transaction_id`, `address`, `city`, `region`, `status`, `created_at`

## API Documentation
- **Swagger UI:** `[Link to be added once deployed]`
- **Postman Collection:** `[Link to be added or file included in repo]`

## Testing
This project includes comprehensive unit tests for all Use Cases and Domain logic.

```
# Run unit tests
npm run test

# Run test coverage
npm run test:cov
```
**Current Coverage:** *[Pending - Goal: >80%]*

## Installation & Running the App

```
# Install dependencies
npm install

# Start development server
npm run start:dev
```