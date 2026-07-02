# ☁️ Vinod Luxury Retail (VLR) - Serverless Application

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900?logo=awslambda)
![API Gateway](https://img.shields.io/badge/API-Gateway-blue)
![DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Overview

**Vinod Luxury Retail (VLR)** is a cloud-native luxury retail e-commerce application built using **Next.js**, **React**, **TypeScript**, and **AWS Serverless services**.

This project demonstrates how a modern frontend application integrates with a serverless backend using Amazon API Gateway, AWS Lambda, and Amazon DynamoDB.

> **Note**
>
> This repository is an educational and portfolio project. All products, brands, users, stores, addresses, payment methods, orders, shopping carts, and other business data are fictional sample data created solely for learning and demonstration purposes.

---

## 🏗️ Application Architecture

```text
Browser
    │
    ▼
Next.js / React
    │
    ▼
REST API
    │
    ▼
Amazon API Gateway
    │
    ▼
AWS Lambda
    │
    ▼
Amazon DynamoDB
```

## ✨ Features

- Product Catalog
- Product Search
- Product Details
- Shopping Bag
- Update Cart Quantity
- Remove Cart Items
- Favorites
- Checkout UI
- Order History
- Store Locator
- Mock Authentication
- Responsive Design

### REST APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | /products | Retrieve products |
| GET | /products/{id} | Product details |
| GET | /products/search | Search products |
| GET | /cart | Retrieve shopping cart |
| POST | /cart | Add item to cart |
| PUT | /cart | Update quantity |
| DELETE | /cart | Remove item |

## 🚀 Technology Stack

- Next.js
- React
- TypeScript
- Node.js
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Docker
- CSS Modules

## 🌱 Database Seeding

Initialize the sample product catalog:

```bash
node scripts/seed-products.js
```

The script imports sample product data from the `data/` folder into DynamoDB.

## 📁 Project Structure

```text
components/
data/
lambda/
pages/
public/
scripts/
styles/
types/
Dockerfile
package.json
README.md
```

## ▶️ Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## ☁️ AWS Services

- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- CloudWatch
- IAM

Infrastructure provisioning is maintained in a separate Terraform repository.

## 🛣️ Future Enhancements

- Amazon Cognito
- Checkout
- Orders
- Payment Integration
- CloudFront
- Amazon S3
- CI/CD

# ⚠️ Disclaimer

This project was created **solely for educational, learning, and portfolio purposes**.

All products, product names, descriptions, brands, users, stores, addresses, orders, payment methods, favorites, and shopping cart data included in this repository are **fictional sample data** created to demonstrate software engineering concepts.

This project is **not affiliated with, endorsed by, sponsored by, or associated with any retailer, luxury brand, company, or organization**.

Any resemblance to real companies, organizations, products, services, trademarks, or brands is purely coincidental.

No commercial use is intended.

## 👨‍💻 Author

**Vinod Beriki**

GitHub: https://github.com/berikivinod

## 📄 License

MIT License
