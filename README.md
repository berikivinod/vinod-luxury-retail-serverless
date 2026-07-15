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

The application demonstrates how a modern frontend communicates with a scalable serverless backend using **Amazon API Gateway**, **AWS Lambda**, and **Amazon DynamoDB** while following production-style application architecture.

This repository contains the complete application source code, including:

- Next.js frontend
- AWS Lambda source code
- API integrations
- Sample datasets
- Docker configuration
- DynamoDB seed scripts

Infrastructure provisioning is maintained separately using Terraform.

---

# 🚧 Project Status

**Current Status:** Active Development

## ✅ Completed

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
- REST API Integration
- AWS Lambda Integration
- Amazon API Gateway Integration
- Amazon DynamoDB Integration
- Docker Production Build
- Responsive UI

## 🚧 Currently In Progress

- Order History (Frontend)
- Order Details (Frontend)
- Favorites
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
- Order History *(In Progress)*
- Order Details *(In Progress)*
- Store Locator

---

## Serverless Backend

- Product APIs
- Shopping Cart APIs
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
| GET | /orders | Retrieve customer orders |
| GET | /orders/{orderId} | Retrieve order details |

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

Additional seed scripts can be added to populate users, stores, favorites, addresses, payment methods, and other sample datasets.

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

Run the application

```bash
npm run dev
```

Open

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

- Multi-stage build
- Production-ready image
- Optimized Docker layers
- .dockerignore
- Health-check ready configuration

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
- Docker
- Serverless Architecture
- Component-Based UI Design
- Responsive Web Development
- Cloud-Native Application Development

---

# 🌟 Portfolio Highlights

This project demonstrates:

- Modern React application architecture
- Cloud-native application development
- Hybrid container and serverless architecture
- AWS Lambda REST APIs
- Amazon API Gateway integration
- Amazon DynamoDB integration
- Shopping cart workflow
- Checkout workflow
- Order placement workflow
- Docker containerization
- Production-style project organization
- Infrastructure separation using Terraform

---

# 🔄 Future Enhancements

Planned improvements include:

- Complete Order History UI
- Complete Order Details UI
- Favorites
- Address Management
- Payment Methods
- User Profile
- Amazon Cognito Authentication
- JWT Authorization
- Payment Gateway Integration
- CloudFront CDN
- Amazon S3 Image Hosting
- GitHub Actions CI/CD
- CloudWatch Monitoring & Dashboards
- Performance Optimization
- End-to-End Testing

---

# 🔗 Related Repositories

## terraform-aws-serverless-ecommerce-platform

Infrastructure as Code repository provisioning:

- Amazon ECS
- AWS Fargate
- Application Load Balancer
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- IAM
- Networking

---

## vinod-luxury-retail-local

Local prototype built using JSON files without AWS services.

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

DevOps Engineer | AWS | Terraform | Kubernetes | Docker | React | Next.js | TypeScript | Serverless

GitHub

https://github.com/berikivinod

---

# 📄 License

MIT License