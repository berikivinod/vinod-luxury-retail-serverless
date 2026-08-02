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

## 🔗 Project Architecture

This solution is organized into two repositories:

### 1. vinod-luxury-retail-serverless

Application source code including:

- Next.js Frontend
- AWS Lambda Functions
- REST API Integrations
- React Components
- Customer Authentication
- Shopping Experience

### 2. terraform-aws-serverless-ecommerce-platform

Infrastructure as Code provisioning for:

- Amazon Cognito
- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon ECS
- AWS Fargate
- Amazon ECR
- IAM
- Networking
- CloudWatch

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

- Shopping Cart Backend Migration
- Address Drawer Components
- Payment Method Management
- Customer Profile Editing
- Checkout Enhancements

### Authentication

- Amazon Cognito Authentication
- AWS Amplify Integration
- Protected Customer Pages
- Session Restoration
- Customer Account Module

### Customer Account

- Account Overview
- Order History
- Address Book
- Payment Information
- Favorites
- Style Preferences
- My Store

---

# ✨ Features

## 🔐 Authentication & Customer Identity

The application now includes a complete AWS Cognito authentication workflow.

### Supported Features

- User Registration
- Email Verification
- Secure Sign In
- Secure Sign Out
- Forgot Password
- Reset Password
- Automatic Session Restoration
- Protected Customer Pages
- AWS Amplify Authentication
- Cognito User Attributes
- React `useAuth` custom hook

---

# 👤 Customer Account Architecture

The customer account module has been refactored to use a centralized authentication model and a reusable layout architecture, reducing duplicated code and improving maintainability.

## Architecture Overview

A shared **AuthProvider** and **AccountLayout** are now responsible for authentication, loading state, and common account UI.

```text
AuthProvider
      │
      ▼
React Context
      │
      ▼
useAuth()
      │
      ▼
AccountLayout
 ├── Header
 ├── Footer
 ├── Account Sidebar
 ├── Authentication
 └── Loading State
      │
      ▼
Account Pages
```

---

## Authentication

Authentication is centralized using **React Context** and **AWS Cognito**.

### Features

- Centralized authentication state
- Automatic session restoration
- Protected account pages
- Shared authenticated user context
- Reduced duplicate Cognito authentication logic
- Shared loading state across account pages

---

## Shared Account Layout

A reusable `AccountLayout` component provides a consistent customer experience across all account pages.

### Responsibilities

- Header
- Footer
- Account Sidebar
- Authentication
- Loading Screen
- Protected Routes

---

## Refactored Customer Pages

The following pages now share the same authentication and layout architecture:

- Account Overview
- Order History
- Address Book
- Payment Information
- Favorites
- Style Preferences
- My Store

---

## Benefits

- Eliminated duplicated authentication code
- Reduced repeated Header/Footer rendering
- Centralized account navigation
- Improved maintainability
- Consistent user experience
- Cleaner React component hierarchy
- Easier future enhancements

## Shopping Experience

- Product Catalog
- Product Details
- Product Search
- Shopping Cart
- Update Cart Quantity
- Remove Cart Items
- Favorites (Wishlist)
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

## ❤️ Favorites Management

The application includes a complete serverless favorites (wishlist) experience.

### Supported Features

- Add products to favorites
- Remove products from favorites
- View favorite products
- Persistent favorites using Amazon DynamoDB
- Synchronization across Product Listing Page, Product Detail Page, and Favorites page
- React custom hook (`useFavorites`)

## Serverless Backend

- Product APIs
- Search APIs
- Favorites APIs
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
- Custom React Hooks
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
      ┌──────────┬──────────┬────────────┬──────────┐
      ▼          ▼          ▼            ▼
 Product APIs Search APIs Favorites APIs Order APIs
      │          │          │            │
      └──────────┴──────────┴────────────┘
                     │
                     ▼
                AWS Lambda
                     │
      ┌──────────────┼──────────────┐
      ▼              ▼              ▼
 Products Table Favorites Table Orders Table
 Amazon DynamoDB Amazon DynamoDB Amazon DynamoDB
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
| POST | /favorites | Add product to favorites |
| GET | /favorites | Retrieve favorite products |
| DELETE | /favorites/{productId} | Remove favorite product |

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
│   └── favorites/
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
- Amazon Cognito
- AWS Amplify
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
- React Custom Hooks
- CRUD REST APIs
- API Gateway CORS
- Favorites Management
- DynamoDB Composite Keys
- State Synchronization
- Amazon Cognito
- AWS Amplify
- Authentication & Authorization
- Protected Routes
- React Authentication Hooks
- React Context API
- Context-Based Authentication
- Shared Layout Architecture
- Component Refactoring
- React Composition Patterns

---
# 🏆 Key Accomplishments

- Complete cloud-native luxury retail application
- Centralized React Authentication Context
- Shared Account Layout Architecture
- Protected Customer Account Module
- Reusable React Layout Components
- Serverless REST APIs using AWS Lambda
- Product Catalog and Search
- Shopping Cart and Checkout
- Order Management
- Favorites (Wishlist)
- Amazon DynamoDB integration
- React custom hooks
- Dockerized Next.js application
- Infrastructure managed with Terraform
- AWS Cognito Authentication
- Secure Customer Account
- Password Recovery Workflow
- Protected Customer Pages

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
- Backend-powered Favorites (Wishlist)
- React custom hook architecture
- Cross-page state synchronization
- Serverless CRUD APIs
- Enterprise Authentication using Amazon Cognito
- Secure Customer Account Management
- React Authentication Hooks
- Protected Route Architecture

---

# 🔄 Future Enhancements

The following enhancements are planned as the application continues to evolve into a production-ready, cloud-native luxury retail e-commerce platform.

---

## 🛒 Shopping Cart Backend

The current shopping cart implementation will be migrated from browser-based storage to a fully serverless backend powered by AWS services.

### Planned Features

- Persist shopping carts in Amazon DynamoDB
- Serverless CRUD APIs using AWS Lambda
- REST APIs exposed through Amazon API Gateway
- React `useCart` custom hook for centralized state management
- Real-time synchronization across Product Detail, Shopping Cart, Header, and Checkout pages
- Quantity updates and item removal through REST APIs
- Automatic cart persistence across devices for authenticated users

### Planned REST APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /cart | Add item to cart |
| GET | /cart | Retrieve shopping cart |
| PUT | /cart/{productId} | Update cart item quantity |
| DELETE | /cart/{productId} | Remove item from cart |

### Planned Architecture

```text
React Components
        │
        ▼
     useCart Hook
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

---

# 👤 Customer Account Enhancements

The customer account experience will continue to evolve with additional functionality.

### Planned Features

- Address Management (Add, Edit, Delete)
- Payment Method Management
- Customer Profile Editing
- Preferred Store Management
- Account Settings
- Profile Photo Support

---

# 💳 Checkout Enhancements

Future improvements include:

- Payment Gateway Integration
- Shipping Method Selection
- Tax Calculation
- Promo Codes & Coupons
- Gift Cards
- Order Tracking
- Order Cancellation
- Return & Refund Workflow

---

# ☁️ Cloud & Infrastructure Enhancements

- JWT-based API Authorization
- Amazon S3 Product Image Storage
- Amazon CloudFront CDN
- GitHub Actions CI/CD
- CloudWatch Dashboards
- CloudWatch Alarms
- AWS X-Ray Tracing
- Performance Monitoring
- Infrastructure Automation using Terraform

---

# 🛍 Shopping Experience Enhancements

- Product Reviews & Ratings
- Recently Viewed Products
- Recommended Products
- Personalized Shopping Experience
- AI Shopping Assistant
- Advanced Product Filters
- Product Comparison
- Inventory Availability
- Low Stock Notifications

---

# 🔐 Security Enhancements

- Multi-Factor Authentication (MFA)
- Social Login (Google, Apple)
- Role-Based Access Control (RBAC)
- Secure JWT Authorization
- API Rate Limiting
- Audit Logging

---

# 🧪 Quality & Testing

- Unit Testing
- Integration Testing
- End-to-End Testing
- Performance Testing
- Accessibility Improvements
- Cross-Browser Testing
- Mobile Optimization

---

# 🚀 Long-Term Roadmap

- Complete Serverless Backend
- Event-Driven Architecture
- Microservices Expansion
- Real-Time Notifications
- Email Notifications
- SMS Notifications
- Customer Loyalty Program
- Rewards & Membership
- Analytics Dashboard
- Business Intelligence Reporting

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