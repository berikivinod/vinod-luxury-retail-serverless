# ☁️ Vinod Luxury Retail (VLR) – Cloud-Native E-Commerce Application

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900?logo=awslambda)
![API Gateway](https://img.shields.io/badge/API-Gateway-blue)
![DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 📖 Overview

**Vinod Luxury Retail (VLR)** is a cloud-native luxury retail e-commerce application built using **Next.js**, **React**, **TypeScript**, and **AWS Serverless** technologies.

The application demonstrates how a modern React frontend communicates with a scalable serverless backend using **Amazon API Gateway**, **AWS Lambda**, and **Amazon DynamoDB** while following production-style cloud architecture and software engineering best practices.

This repository contains the complete application source code including:

- Next.js Frontend
- AWS Lambda Source Code
- REST API Integrations
- Serverless Order Management
- Sample Product Data
- Docker Configuration
- DynamoDB Seed Scripts

Infrastructure provisioning is maintained separately using Terraform.

---

# 🚧 Project Status

**Current Status:** Active Development

## ✅ Completed

### Shopping Experience

- Product Catalog
- Product Details
- Product Search
- Shopping Cart
- Update Cart Quantity
- Remove Cart Items
- Checkout
- Place Order
- Order Confirmation
- Order History
- Order Details
- Store Locator

### Cloud Integration

- REST API Integration
- AWS Lambda Integration
- Amazon API Gateway Integration
- Amazon DynamoDB Integration
- Docker Production Build
- Responsive UI

## 🚧 Currently In Progress

- Favorites (Wishlist)
- Address Management
- Payment Methods
- Amazon Cognito Authentication

---

# ✨ Features

## Shopping Experience

- Product Catalog
- Product Details
- Product Search
- Shopping Cart
- Update Cart Quantity
- Remove Cart Items
- Checkout
- Place Order
- Order Confirmation
- Order History
- Order Details
- Store Locator

---

## 📦 Order Management

The application includes a complete serverless order management workflow.

### Supported Features

- Place customer orders
- Order confirmation
- Customer order history
- Order details
- Purchased product summary
- Order status tracking
- Shipping information
- Payment information
- Tracking information
- Order totals

---

## Serverless Backend

- Product APIs
- Search APIs
- Order APIs
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- CloudWatch Logging

---

## Frontend

- Next.js 16
- React 19
- TypeScript
- CSS Modules
- Responsive Design
- Component-Based Architecture

---

# 🏗 Application Architecture

```text
                    Browser
                       │
                       ▼
             Next.js / React Frontend
                       │
                       ▼
                Amazon API Gateway
                       │
        ┌──────────────┼──────────────────────┐
        ▼              ▼                      ▼
   Product APIs    Search APIs          Order APIs
        │              │                      │
        └──────────────┼──────────────────────┘
                       ▼
                  AWS Lambda
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
      Products Table       Orders Table
      Amazon DynamoDB     Amazon DynamoDB
```

---

# 🔄 Order Workflow

```text
Shopping Cart
      │
      ▼
Checkout
      │
      ▼
Place Order API
      │
      ▼
AWS Lambda
      │
      ▼
Amazon DynamoDB
      │
      ▼
Order Confirmation
      │
      ▼
Order History
      │
      ▼
Order Details
```

---

# 🚀 REST APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /products | Retrieve all products |
| GET | /products/{id} | Retrieve product details |
| GET | /products/search | Search products |
| POST | /orders | Place customer order |
| GET | /orders | Retrieve customer order history |
| GET | /orders/{orderId} | Retrieve customer order details |

---

# 🚀 Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- CSS Modules

## Backend

- Node.js
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB

## DevOps

- Docker
- Amazon ECS
- AWS Fargate
- Amazon ECR
- CloudWatch
- IAM

---

# 🌱 Database Seeding

Populate Amazon DynamoDB with sample data.

## Products

```bash
node scripts/seed-products.js
```

The script imports the sample product catalog from the **data/** directory into the **vlr-products** DynamoDB table.

Future seed scripts can populate:

- Orders
- Favorites
- Stores
- Addresses
- Payment Methods
- User Profiles

---

# 📁 Project Structure

```text
vinod-luxury-retail-serverless

├── components/
├── data/
├── lambda/
│   ├── products/
│   ├── search/
│   └── orders/
├── pages/
├── public/
├── scripts/
├── styles/
├── types/
├── Dockerfile
├── .dockerignore
├── package.json
├── README.md
```

---

# ▶️ Run Locally

Install dependencies

```bash
npm install
```

Run the application

```bash
npm run dev
```

Open your browser

```text
http://localhost:3000
```

---

# 🐳 Docker

Build

```bash
docker build -t vlr-ui .
```

Run

```bash
docker run -p 3000:3000 vlr-ui
```

The Docker image includes:

- Multi-stage Build
- Production-ready Image
- Optimized Docker Layers
- .dockerignore
- Health-check Ready Configuration

---

# ☁️ AWS Services Used

- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon ECS
- AWS Fargate
- Amazon ECR
- CloudWatch Logs
- IAM

Infrastructure provisioning is maintained in the companion Terraform repository.

---

# 📊 Skills Demonstrated

- Next.js
- React
- TypeScript
- Node.js
- REST API Development
- REST API Integration
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Serverless Architecture
- Order Management Systems
- DynamoDB Data Modeling
- Docker
- Cloud-Native Application Development
- Component-Based UI Design
- Responsive Web Development

---

# 🌟 Portfolio Highlights

This project demonstrates:

- Modern React application architecture
- Cloud-native application development
- Production-style serverless architecture
- AWS Lambda REST APIs
- Amazon API Gateway integration
- Amazon DynamoDB integration
- Complete end-to-end order management workflow
- Shopping cart and checkout workflow
- Responsive UI using CSS Modules
- Docker containerization
- Infrastructure separation using Terraform
- Real-world e-commerce application design

---

# 🔄 Future Enhancements

Planned improvements include:

- Favorites (Wishlist)
- Address Management
- Payment Methods
- User Profile
- Amazon Cognito Authentication
- JWT Authorization
- Payment Gateway Integration
- Product Reviews
- Inventory Management
- Email Notifications
- Amazon S3 Image Hosting
- CloudFront CDN
- GitHub Actions CI/CD
- CloudWatch Monitoring & Dashboards
- Performance Optimization
- End-to-End Testing

---

# 🔗 Related Repositories

## terraform-aws-serverless-ecommerce-platform

Infrastructure as Code repository provisioning:

- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Amazon ECS
- AWS Fargate
- Amazon ECR
- IAM
- Networking
- CloudWatch

---

## vinod-luxury-retail-local

Local prototype built using JSON files before migrating to a serverless AWS architecture.

---

# ⚠️ Disclaimer

This repository was created solely for educational, learning, and portfolio purposes.

The application simulates a luxury retail e-commerce platform to demonstrate modern full-stack software engineering, cloud-native architecture, and AWS serverless application development.

All products, brands, customers, stores, addresses, payment methods, shopping carts, favorites, and orders are fictional sample data created exclusively for learning and demonstration purposes.

This project is **not affiliated with, endorsed by, sponsored by, or associated with any retailer, luxury brand, company, or organization**.

Any resemblance to actual companies, products, brands, organizations, services, or trademarks is purely coincidental.

No commercial use is intended.

---

# 👨‍💻 Author

**Vinod Beriki**

DevOps Engineer | AWS | Terraform | Kubernetes | Docker | React | Next.js | TypeScript | Serverless

GitHub

https://github.com/berikivinod

---

# 📄 License

MIT License