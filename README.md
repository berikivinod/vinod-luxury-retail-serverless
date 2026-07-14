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

**Vinod Luxury Retail (VLR)** is a modern cloud-native luxury retail e-commerce application built using **Next.js**, **React**, **TypeScript**, and **AWS Serverless services**.

The application demonstrates how a modern frontend communicates with a scalable serverless backend using Amazon API Gateway, AWS Lambda, and Amazon DynamoDB while following production-style application architecture.

This repository contains the complete application source code, including the frontend, Lambda functions, sample datasets, Docker configuration, and database import scripts.

---

# 🚧 Project Status

**Current Status:** Active Development

## Completed

- Product Catalog
- Product Details
- Product Search
- Shopping Cart
- Update Cart Quantity
- Remove Cart Items
- Checkout
- Place Order
- Store Locator
- Responsive UI
- REST APIs
- AWS Lambda Integration
- Amazon DynamoDB Integration

## Currently In Progress

- Order History
- Order Details
- Favorites API
- Address Management
- Payment Method APIs
- Amazon Cognito Authentication

---

# ✨ Features

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
- Store Locator

### Serverless Backend

- REST APIs
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- CloudWatch Logging

### Frontend

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
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Product APIs    Shopping Cart   Order APIs
        │              │              │
        └──────────────┼──────────────┘
                       ▼
                  AWS Lambda
                       │
                       ▼
                Amazon DynamoDB
```

---

# 🚀 REST APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /products | Retrieve all products |
| GET | /products/{id} | Retrieve product details |
| GET | /products/search | Search products |
| GET | /cart | Retrieve shopping cart |
| POST | /cart | Add product to cart |
| PUT | /cart | Update quantity |
| DELETE | /cart | Remove cart item |
| POST | /orders | Place customer order |

---

# 🚀 Technology Stack

## Frontend

- Next.js
- React
- TypeScript
- CSS Modules

## Backend

- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Node.js

## DevOps

- Docker
- Amazon ECS (Deployment)
- CloudWatch
- IAM

---

# 🌱 Database Seeding

Populate DynamoDB with sample data.

## Products

```bash
node scripts/seed-products.js
```

Additional seed scripts are included for expanding the sample application dataset.

---

# 📁 Project Structure

```text
vinod-luxury-retail-serverless

├── components/
├── data/
├── lambda/
│   ├── cart/
│   ├── orders/
│   └── products/
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

Run locally

```bash
npm run dev
```

Open

```
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

---

# ☁️ AWS Services Used

- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- CloudWatch
- IAM
- Amazon ECS
- AWS Fargate
- Amazon ECR

Infrastructure provisioning is maintained in the companion Terraform repository.

---

# 📊 Skills Demonstrated

- Next.js
- React
- TypeScript
- REST API Integration
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Docker
- Serverless Architecture
- Component-Based UI Design
- Responsive Web Development

---

# 🌟 Portfolio Highlights

This project demonstrates:

- Modern React application architecture
- Serverless backend integration
- AWS Lambda REST APIs
- Amazon DynamoDB integration
- Shopping cart workflow
- Checkout process
- Order placement workflow
- Docker containerization
- Production-style project organization

---

# 🔄 Future Enhancements

Planned improvements include:

- Amazon Cognito Authentication
- JWT Authorization
- Favorites APIs
- Address APIs
- Payment Method APIs
- Order History
- Order Details
- Payment Gateway Integration
- CloudFront CDN
- Amazon S3 Image Hosting
- GitHub Actions CI/CD
- Performance Optimization
- End-to-End Testing

---

# 🔗 Related Repositories

## vinod-luxury-retail-local

Local prototype built using JSON files without AWS services.

---

## terraform-aws-serverless-ecommerce-platform

Infrastructure as Code repository provisioning:

- Amazon ECS
- AWS Lambda
- API Gateway
- Amazon DynamoDB
- Networking
- IAM
- Application Load Balancer

---

# ⚠️ Disclaimer

This repository was created solely for educational, learning, and portfolio purposes.

The application simulates a luxury retail e-commerce platform to demonstrate modern full-stack software engineering and cloud architecture.

All products, product names, brands, descriptions, customers, stores, addresses, payment methods, favorites, shopping carts, and orders are **fictional sample data** created exclusively for learning and demonstration purposes.

This project is **not affiliated with, endorsed by, sponsored by, or associated with any retailer, luxury brand, company, or organization**.

Any resemblance to actual companies, products, brands, organizations, services, or trademarks is purely coincidental.

No commercial use is intended.

---

# 👨‍💻 Author

**Vinod Beriki**

DevOps Engineer | AWS | Terraform | Kubernetes | Docker | React | Serverless

GitHub

https://github.com/berikivinod

---

# 📄 License

MIT License