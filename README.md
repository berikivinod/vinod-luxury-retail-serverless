# ☁️ Vinod Luxury Retail (VLR) – Cloud-Native E-Commerce Application

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?logo=node.js)
![AWS Lambda](https://img.shields.io/badge/AWS-Lambda-FF9900?logo=awslambda)
![API Gateway](https://img.shields.io/badge/API-Gateway-blue)
![DynamoDB](https://img.shields.io/badge/DynamoDB-NoSQL-blue)
![OpenSearch](https://img.shields.io/badge/AWS-OpenSearch%20Serverless-orange)
![OpenAI](https://img.shields.io/badge/OpenAI-AI-black)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-green)

---

# 📖 Overview

**Vinod Luxury Retail (VLR)** is a cloud-native luxury retail e-commerce application built using **Next.js**, **React**, **TypeScript**, **Node.js**, and **AWS Serverless** technologies.

The application demonstrates how a modern React frontend communicates with a scalable serverless backend using **Amazon API Gateway**, **AWS Lambda**, and **Amazon DynamoDB** while following production-style cloud architecture and software engineering best practices.

The application has also evolved into an **AI-powered shopping experience** with an AI Style Advisor and Retrieval-Augmented Generation (RAG) product search architecture.

The AI platform combines:

- OpenAI
- OpenAI Embeddings
- Amazon OpenSearch Serverless
- Vector Search
- Natural Language Query Understanding
- Product Search
- Product Recommendations
- Product Selection
- Product Comparison
- Preference Extraction
- Intent Classification
- Grounded AI Responses

This repository contains the complete application source code including:

- Next.js Frontend
- React Components
- TypeScript Services
- AWS Lambda Source Code
- REST API Integrations
- Serverless Product Management
- Serverless Order Management
- Favorites / Wishlist
- Customer Authentication
- AI Style Advisor
- RAG Product Search
- OpenSearch Vector Search
- OpenAI Integration
- Sample Product Data
- Docker Configuration
- DynamoDB Seed Scripts

---

# 🔗 Project Architecture

This solution is organized into two repositories.

## 1. vinod-luxury-retail-serverless

Application source code including:

- Next.js Frontend
- AWS Lambda Functions
- REST API Integrations
- React Components
- Customer Authentication
- Shopping Experience
- AI Style Advisor
- RAG Product Search
- Product Recommendations
- Product Comparison

## 2. terraform-aws-serverless-ecommerce-platform

Infrastructure as Code provisioning for:

- Amazon Cognito
- Amazon API Gateway
- AWS Lambda
- Amazon DynamoDB
- Amazon ECS
- AWS Fargate
- Amazon ECR
- IAM
- VPC Networking
- NAT Gateway
- CloudWatch
- Amazon OpenSearch Serverless

---

# 🚧 Project Status

**Current Status: Active Development**

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
- Favorites / Wishlist

### Cloud Integration

- REST API Integration
- AWS Lambda Integration
- Amazon API Gateway Integration
- Amazon DynamoDB Integration
- Docker Production Build
- Responsive UI
- Serverless Backend

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

### AI / RAG

- AI Style Advisor
- Natural Language Product Search
- AI Query Understanding
- Brand Filtering
- Category Filtering
- Price Filtering
- Semantic Product Search
- OpenAI Embeddings
- OpenSearch Serverless Vector Search
- RAG Product Indexing
- RAG Product Retrieval
- Grounded AI Responses
- Product Recommendations
- Product Selection
- Product Comparison
- Preference Extraction
- Intent Classification

## 🚧 Currently In Progress

- Shopping Cart Backend Migration
- Address Drawer Components
- Payment Method Management
- Customer Profile Editing
- Checkout Enhancements
- Advanced AI Shopping Capabilities
- Multi-turn AI Shopping Conversations
- Advanced RAG Query Understanding

---

# ✨ Features

# 🔐 Authentication & Customer Identity

The application includes a complete AWS Cognito authentication workflow.

## Supported Features

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

The customer account module uses a centralized authentication model and reusable layout architecture, reducing duplicated code and improving maintainability.

## Architecture Overview

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
     │
     ├── Header
     ├── Footer
     ├── Account Sidebar
     ├── Authentication
     └── Loading State
     │
     ▼
Account Pages
```

## Authentication

Authentication is centralized using **React Context** and **AWS Cognito**.

### Features

- Centralized authentication state
- Automatic session restoration
- Protected account pages
- Shared authenticated user context
- Reduced duplicate Cognito authentication logic
- Shared loading state across account pages

## Shared Account Layout

A reusable `AccountLayout` component provides a consistent customer experience across account pages.

### Responsibilities

- Header
- Footer
- Account Sidebar
- Authentication
- Loading Screen
- Protected Routes

## Customer Pages

The following pages share the authentication and layout architecture:

- Account Overview
- Order History
- Address Book
- Payment Information
- Favorites
- Style Preferences
- My Store

## Benefits

- Eliminated duplicated authentication code
- Reduced repeated Header/Footer rendering
- Centralized account navigation
- Improved maintainability
- Consistent user experience
- Cleaner React component hierarchy
- Easier future enhancements

---

# 🛍 Shopping Experience

The application provides a complete luxury retail shopping experience.

### Features

- Product Catalog
- Product Details
- Product Search
- Shopping Cart
- Update Cart Quantity
- Remove Cart Items
- Favorites / Wishlist
- Checkout
- Place Order
- Order Confirmation
- Order History
- Order Details
- Store Locator

---

# 📦 Order Management

The application includes a serverless order management workflow.

## Supported Features

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

## Order Workflow

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

# ❤️ Favorites Management

The application includes a serverless favorites / wishlist experience.

## Supported Features

- Add products to favorites
- Remove products from favorites
- View favorite products
- Persistent favorites using Amazon DynamoDB
- Synchronization across Product Listing Page
- Synchronization across Product Detail Page
- Synchronization across Favorites page
- React `useFavorites` custom hook

## Favorites Architecture

```text
React Components
       │
       ▼
useFavorites Hook
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

# 🤖 AI Style Advisor

VLR includes an AI-powered Style Advisor designed to help customers discover products using natural language.

Customers can describe what they are looking for instead of relying only on traditional product filters.

## Example Queries

```text
Show me luxury handbags
```

```text
Show me handbags under $1000
```

```text
Show me Gucci products
```

```text
Show me Gucci handbags under $2000
```

```text
Show me shoes
```

```text
Show me products under $500
```

```text
I want something expensive for a special occasion
```

```text
Do you have leather shoes?
```

The Style Advisor interprets the request, searches the product catalog, and generates a response based on the products retrieved from the system.

---

# 🧠 AI Query Understanding

The AI Style Advisor includes a query-understanding layer that converts natural-language shopping requests into structured search criteria.

Currently supported structured filters include:

- Brand
- Category
- Maximum Price

Example:

```text
Show me Gucci handbags under $2000
```

The request can be interpreted as:

```json
{
  "brand": "Gucci",
  "category": "Handbags",
  "maxPrice": 2000
}
```

These structured filters are then used during product retrieval.

---

# 🔎 Retrieval-Augmented Generation (RAG)

The application implements a Retrieval-Augmented Generation architecture for product discovery.

RAG combines:

- Natural language understanding
- OpenAI embeddings
- Vector search
- Product metadata filtering
- OpenSearch Serverless
- AI response generation

The goal is to ensure that AI responses are grounded in the actual product catalog.

---

# 🏗 RAG Architecture

```text
                         Customer
                            │
                            ▼
                   Next.js / React
                            │
                            ▼
                  AI Style Advisor API
                            │
                            ▼
                  Query Understanding
                            │
                   ┌────────┴────────┐
                   │                 │
                   ▼                 ▼
              Structured         Semantic
                Filters           Intent
                   │                 │
                   └────────┬────────┘
                            │
                            ▼
                    OpenAI Embedding
                 text-embedding-3-small
                            │
                            ▼
                  OpenSearch Serverless
                       Vector Search
                            │
                            ▼
                    Relevant Products
                            │
                            ▼
                  RAG Response Generator
                            │
                            ▼
                       GPT-4o-mini
                            │
                            ▼
                   Grounded AI Response
```

---

# 🧩 RAG Components

The RAG implementation is divided into three primary Lambda functions.

## 1. RAG Indexer

```text
vlr-product-rag-indexer
```

The RAG Indexer builds the vector search index from the product catalog.

### Responsibilities

- Read products from DynamoDB
- Build searchable product content
- Generate OpenAI embeddings
- Store product vectors
- Store product metadata
- Index products into OpenSearch Serverless

### Indexing Flow

```text
Amazon DynamoDB
       │
       ▼
RAG Indexer Lambda
       │
       ▼
OpenAI Embeddings
       │
       ▼
OpenSearch Serverless
       │
       ▼
products Vector Index
```

---

# 🔍 2. RAG Search Lambda

```text
vlr-product-rag-search
```

The RAG Search Lambda performs vector-based product retrieval.

### Responsibilities

- Receive search requests
- Generate an embedding for the user query
- Perform vector search
- Apply structured filters
- Retrieve relevant products
- Return ranked search results

The search layer uses OpenSearch Serverless as the vector store.

---

# 💬 3. RAG Response Lambda

```text
vlr-product-rag-response
```

The RAG Response Lambda is responsible for generating the final customer-facing response.

### Responsibilities

- Process the user request
- Retrieve relevant products
- Build grounded product context
- Generate the AI response
- Prevent unsupported product claims

The response generator uses:

```text
GPT-4o-mini
```

---

# 🔢 OpenAI Embeddings

The RAG system uses:

```text
text-embedding-3-small
```

The application expects embeddings with:

```text
1536 dimensions
```

Both product content and customer search queries are converted into vector representations.

This enables semantic matching between customer intent and product information.

---

# 🔎 OpenSearch Serverless Vector Store

The RAG system uses **Amazon OpenSearch Serverless** for vector search.

The collection is:

```text
vlr-product-rag
```

The product index is:

```text
products
```

The vector field is:

```text
embedding
```

The vector dimension is:

```text
1536
```

Product metadata includes:

- Product ID
- SKU
- Name
- Brand
- Category
- Price
- Searchable Text
- Additional Metadata

---

# 🏷️ RAG Structured Filtering

The RAG search layer supports structured filters.

## Brand Filter

Example:

```text
Show me Gucci products
```

Filter:

```text
brand = Gucci
```

## Category Filter

Example:

```text
Show me handbags
```

Filter:

```text
category = Handbags
```

## Maximum Price Filter

Example:

```text
Show me handbags under $1000
```

Filters:

```text
category = Handbags
maxPrice = 1000
```

## Combined Filters

Example:

```text
Show me Gucci handbags under $2000
```

Filters:

```text
brand = Gucci
category = Handbags
maxPrice = 2000
```

---

# 🎯 Semantic Product Search

Not every customer request can be represented using structured filters.

For example:

```text
I want something expensive for a special occasion
```

This request does not specify an exact brand or category.

The system therefore uses semantic vector search to identify conceptually relevant products.

This allows the application to support natural-language shopping requests beyond exact keyword matching.

---

# 🧠 Grounded AI Responses

The response generation layer is designed to use products retrieved from the product search layer.

The AI is instructed to:

- Use only supplied product information
- Avoid inventing products
- Avoid inventing prices
- Avoid unsupported product attributes
- Avoid unsupported availability claims
- Provide concise shopping guidance
- Mention product names
- Mention brands
- Mention prices when appropriate

This creates a grounded response-generation pattern instead of allowing the model to independently invent product information.

---

# 🧠 AI Shopping Services

The application contains several AI-oriented services under:

```text
services/ai/
```

Current AI service areas include:

- Intent Classification
- Preference Extraction
- Product Search
- Product Recommendation
- Product Selection
- Product Comparison
- Recommendation Building
- Style Advisor
- RAG
- Query Understanding

---

# 🧠 Intent Classification

The AI layer includes intent classification to identify the customer's shopping objective.

The architecture provides a foundation for supporting shopping intents such as:

- Product Search
- Product Recommendation
- Product Comparison
- Style Assistance

This allows the Style Advisor to evolve beyond a simple product search endpoint.

---

# ❤️ Preference Extraction

The preference extraction layer is designed to identify customer preferences from natural language.

Examples:

```text
I prefer leather shoes
```

```text
I want something elegant
```

```text
I need something for a special occasion
```

These preferences can be passed to downstream product selection and recommendation services.

---

# 🛍 Product Recommendation

The product recommendation layer uses retrieved product information to identify products that best match the customer's request.

The architecture separates customer intent from product retrieval and response generation.

```text
User Request
     │
     ▼
Intent
     │
     ▼
Preferences
     │
     ▼
Product Search
     │
     ▼
Product Selection
     │
     ▼
Recommendation
```

---

# ⚖️ Product Comparison

The AI application includes product comparison functionality.

The comparison layer is designed to compare products using information available in the product catalog.

The system should remain grounded in known product information and should not introduce unsupported specifications.

---

# 🔄 AI Request Flow

The overall AI shopping request flow is:

```text
Customer
   │
   ▼
Next.js Style Advisor
   │
   ▼
Style Advisor API
   │
   ▼
Intent Classification
   │
   ▼
Preference Extraction
   │
   ▼
Query Understanding
   │
   ▼
Product Search / RAG
   │
   ▼
OpenAI Embedding
   │
   ▼
OpenSearch Serverless
   │
   ▼
Relevant Products
   │
   ▼
Product Selection / Recommendation
   │
   ▼
AI Response Generator
   │
   ▼
Customer
```

---

# 🧪 RAG Test Scenarios

The RAG implementation has been tested with multiple natural-language shopping queries.

## Test 1 – Luxury Handbags

```text
Show me luxury handbags
```

Expected interpretation:

```text
category = Handbags
```

The system retrieves relevant handbag products.

---

## Test 2 – Handbags Under $1000

```text
Show me handbags under $1000
```

Expected interpretation:

```text
category = Handbags
maxPrice = 1000
```

The retrieved products are restricted to the specified price range.

---

## Test 3 – Gucci Products

```text
Show me Gucci products
```

Expected interpretation:

```text
brand = Gucci
```

If matching products do not exist, the system returns a grounded no-match response.

---

## Test 4 – Gucci Handbags Under $2000

```text
Show me Gucci handbags under $2000
```

Expected interpretation:

```text
brand = Gucci
category = Handbags
maxPrice = 2000
```

---

## Test 5 – Shoes

```text
Show me shoes
```

Expected interpretation:

```text
category = Shoes
```

---

## Test 6 – Products Under $500

```text
Show me products under $500
```

Expected interpretation:

```text
maxPrice = 500
```

---

## Test 7 – Special Occasion

```text
I want something expensive for a special occasion
```

This request demonstrates semantic vector search.

The system can retrieve conceptually relevant luxury products without requiring an explicit category.

---

## Test 8 – Leather Shoes

```text
Do you have leather shoes?
```

The system can identify the shoe category and use semantic retrieval to identify relevant leather products.

---

# 📊 RAG API Response

The RAG response contains structured information including:

- User query
- Extracted filters
- Number of retrieved products
- Product information
- Product ID
- SKU
- Product name
- Brand
- Category
- Price
- Search score
- AI-generated answer

Example:

```json
{
  "message": "RAG search completed",
  "query": "Show me handbags under $1000",
  "filters": {
    "category": "Handbags",
    "maxPrice": 1000
  },
  "retrievedProducts": 2,
  "products": [],
  "answer": "..."
}
```

---

# 🚀 REST APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Retrieve all products |
| GET | `/products/{id}` | Retrieve product details |
| GET | `/products/search` | Search products |
| POST | `/orders` | Place customer order |
| GET | `/orders` | Retrieve customer order history |
| GET | `/orders/{orderId}` | Retrieve customer order details |
| POST | `/favorites` | Add product to favorites |
| GET | `/favorites` | Retrieve favorite products |
| DELETE | `/favorites/{productId}` | Remove favorite product |

---

# 🤖 AI / RAG Components

The application includes the following RAG Lambda functions:

```text
lambda/
├── rag-indexer/
├── rag-search/
└── vlr-product-rag-response/
```

AI application services include:

```text
services/ai/
├── intentClassifier.ts
├── preferenceExtractor.ts
├── productComparator.ts
├── productRecommender.ts
├── productSelectionHandler.ts
├── productSelector.ts
├── recommendationBuilder.ts
├── productSearch.ts
├── styleAdvisor.ts
└── rag/
```

The Style Advisor API is exposed through:

```text
pages/api/ai/style-advisor.ts
```

---

# 🏗 Application Architecture

```text
                         Customer
                            │
                            ▼
                  Next.js / React Frontend
                            │
             ┌──────────────┴──────────────┐
             │                             │
             ▼                             ▼
      Standard APIs                 AI Style Advisor
             │                             │
             ▼                             ▼
      Amazon API Gateway              AI / RAG API
             │                             │
             ▼                             ▼
        AWS Lambda                Query Understanding
             │                             │
             ▼                             ▼
      Amazon DynamoDB             OpenAI Embeddings
                                           │
                                           ▼
                                  OpenSearch Serverless
                                           │
                                           ▼
                                    Relevant Products
                                           │
                                           ▼
                                       GPT-4o-mini
                                           │
                                           ▼
                                    Grounded Response
```

---

# 🚀 Technology Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- CSS Modules
- Custom React Hooks
- React Context API
- Responsive Design
- Component-Based Architecture

## Backend

- Node.js
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- REST APIs

## AI

- OpenAI
- GPT-4o-mini
- `text-embedding-3-small`
- OpenAI Embeddings
- Retrieval-Augmented Generation
- Natural Language Processing
- Query Understanding
- Intent Classification
- Preference Extraction
- Product Recommendation
- Product Selection
- Product Comparison

## Vector Search

- Amazon OpenSearch Serverless
- OpenSearch Vector Search
- k-NN Search
- `knn_vector`
- 1536-dimensional embeddings
- Product metadata filtering
- Semantic Product Retrieval

## Authentication

- Amazon Cognito
- AWS Amplify
- React Context
- Protected Routes
- Session Management

## DevOps / Cloud

- Docker
- Amazon ECS
- AWS Fargate
- Amazon ECR
- CloudWatch
- IAM
- Terraform
- AWS VPC
- NAT Gateway

---

# 🌱 Database Seeding

Populate Amazon DynamoDB with sample data.

## Products

```bash
node scripts/seed-products.js
```

The script imports the sample product catalog from the `data/` directory into the `vlr-products` DynamoDB table.

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
│
├── components/
│
├── data/
│
├── lambda/
│   ├── products/
│   ├── search/
│   ├── orders/
│   ├── favorites/
│   ├── rag-indexer/
│   ├── rag-search/
│   └── vlr-product-rag-response/
│
├── pages/
│   ├── api/
│   │   └── ai/
│   │       └── style-advisor.ts
│   │
│   └── ...
│
├── public/
│
├── scripts/
│
├── services/
│   └── ai/
│       ├── intentClassifier.ts
│       ├── preferenceExtractor.ts
│       ├── productComparator.ts
│       ├── productRecommender.ts
│       ├── productSelectionHandler.ts
│       ├── productSelector.ts
│       ├── recommendationBuilder.ts
│       ├── productSearch.ts
│       ├── styleAdvisor.ts
│       └── rag/
│
├── styles/
│
├── types/
│
├── Dockerfile
├── .dockerignore
├── package.json
├── README.md
└── tsconfig.json
```

---

# ▶️ Run Locally

## Install Dependencies

```bash
npm install
```

## Run the Application

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

---

# 🐳 Docker

## Build

```bash
docker build -t vlr-ui .
```

## Run

```bash
docker run -p 3000:3000 vlr-ui
```

The Docker image includes:

- Multi-stage Build
- Production-ready Image
- Optimized Docker Layers
- `.dockerignore`
- Health-check Ready Configuration

---

# ☁️ AWS Services Used

- Amazon API Gateway
- Amazon Cognito
- AWS Amplify
- AWS Lambda
- Amazon DynamoDB
- Amazon OpenSearch Serverless
- Amazon ECS
- AWS Fargate
- Amazon ECR
- CloudWatch Logs
- IAM
- Amazon VPC
- NAT Gateway

Infrastructure provisioning is maintained in the companion Terraform repository.

---

# 🔐 Environment Configuration

The application uses environment variables for external service configuration.

Examples include:

```text
OPENAI_API_KEY
OPENSEARCH_ENDPOINT
```

Sensitive credentials must never be committed to Git.

Do not commit:

```text
.env
.env.local
AWS credentials
OpenAI API keys
terraform.tfvars
```

Use environment configuration appropriate for the local or AWS deployment environment.

---

# 📊 Skills Demonstrated

## Frontend

- Next.js
- React
- TypeScript
- CSS Modules
- React Custom Hooks
- React Context API
- Component-Based UI Design
- Responsive Web Development

## Backend

- Node.js
- REST API Development
- REST API Integration
- AWS Lambda
- Amazon API Gateway
- Amazon DynamoDB
- Serverless Architecture
- CRUD REST APIs
- API Gateway CORS

## Authentication

- Amazon Cognito
- AWS Amplify
- Authentication & Authorization
- Protected Routes
- Session Management
- React Authentication Hooks
- React Context
- Context-Based Authentication
- Shared Layout Architecture

## AI / Machine Learning

- OpenAI API
- GPT-4o-mini
- OpenAI Embeddings
- Retrieval-Augmented Generation
- Vector Search
- Semantic Search
- Natural Language Processing
- Query Understanding
- Intent Classification
- Preference Extraction
- Product Recommendation
- Product Selection
- Product Comparison
- Grounded AI Responses

## Vector Search

- Amazon OpenSearch Serverless
- OpenSearch Vector Search
- k-NN Search
- Vector Embeddings
- Metadata Filtering
- Semantic Product Retrieval

## DevOps / Cloud

- Docker
- Amazon ECS
- AWS Fargate
- Amazon ECR
- CloudWatch
- IAM
- Terraform
- AWS Networking
- Serverless Architecture

---

# 🏆 Key Accomplishments

- Complete cloud-native luxury retail application
- Modern Next.js / React frontend
- Serverless REST APIs
- Amazon DynamoDB integration
- Product catalog and search
- Shopping cart and checkout
- Order management
- Favorites / Wishlist
- Amazon Cognito Authentication
- Secure Customer Account
- Protected Customer Pages
- Centralized Authentication Context
- Shared Account Layout Architecture
- React custom hooks
- Dockerized Next.js application
- Infrastructure managed with Terraform
- AI-powered Style Advisor
- Natural-language product discovery
- OpenAI embedding integration
- OpenSearch Serverless vector search
- Retrieval-Augmented Generation
- AI query understanding
- Product recommendation
- Product comparison
- AI product selection
- Preference extraction
- Intent classification
- Grounded AI responses

---

# 🌟 Portfolio Highlights

This project demonstrates:

- Modern React application architecture
- Cloud-native application development
- Production-style serverless architecture
- AWS Lambda REST APIs
- Amazon API Gateway integration
- Amazon DynamoDB integration
- Amazon Cognito authentication
- Secure Customer Account Management
- Complete end-to-end order management
- Shopping cart and checkout workflow
- Responsive UI using CSS Modules
- Docker containerization
- Infrastructure separation using Terraform
- Serverless CRUD APIs
- Backend-powered Favorites
- React custom hook architecture
- Cross-page state synchronization
- AI-powered shopping experience
- Retrieval-Augmented Generation
- Vector database / semantic search
- OpenAI integration
- AI product recommendations
- AI product comparison
- Natural-language product search
- Grounded AI response generation

---

# 🔄 Future Enhancements

The application will continue to evolve into a more complete production-style, cloud-native luxury retail platform.

---

# 🛒 Shopping Cart Backend

The current shopping cart implementation will be migrated from browser-based storage to a fully serverless backend powered by AWS services.

## Planned Features

- Persist shopping carts in Amazon DynamoDB
- Serverless CRUD APIs using AWS Lambda
- REST APIs exposed through Amazon API Gateway
- React `useCart` custom hook
- Real-time synchronization across Product Detail, Shopping Cart, Header, and Checkout pages
- Quantity updates and item removal through REST APIs
- Automatic cart persistence across devices for authenticated users

## Planned REST APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cart` | Add item to cart |
| GET | `/cart` | Retrieve shopping cart |
| PUT | `/cart/{productId}` | Update cart item quantity |
| DELETE | `/cart/{productId}` | Remove cart item |

## Planned Architecture

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

The customer account experience will continue to evolve.

## Planned Features

- Address Management
- Add Address
- Edit Address
- Delete Address
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

# 🧠 AI & Shopping Experience Enhancements

The AI Style Advisor will continue to evolve into a more advanced conversational shopping assistant.

Planned enhancements include:

- Multi-turn conversational shopping
- Customer preference memory
- Personalized recommendations
- Advanced product filtering
- Material detection
- Occasion detection
- Style detection
- Color preferences
- Size preferences
- Price range understanding
- Product similarity
- Advanced product comparison
- Personalized product ranking
- Recommendation explanations
- AI-assisted outfit recommendations
- AI-powered shopping journeys
- Improved RAG retrieval
- Hybrid keyword + vector search
- RAG evaluation framework
- AI response quality evaluation
- Prompt evaluation
- Retrieval quality evaluation

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
- Advanced Product Filters
- Product Comparison
- Inventory Availability
- Low Stock Notifications
- Personalized Recommendations

---

# 🔐 Security Enhancements

- Multi-Factor Authentication (MFA)
- Social Login
- Role-Based Access Control (RBAC)
- Secure JWT Authorization
- API Rate Limiting
- Audit Logging
- Secrets Management
- Enhanced API Security

---

# 🧪 Quality & Testing

Planned testing improvements include:

- Unit Testing
- Integration Testing
- End-to-End Testing
- RAG Retrieval Testing
- AI Response Evaluation
- Prompt Testing
- Performance Testing
- Accessibility Improvements
- Cross-Browser Testing
- Mobile Optimization

---

# 🚀 Long-Term Roadmap

- Complete Serverless Backend
- Event-Driven Architecture
- Microservices Expansion
- Advanced AI Shopping Assistant
- Multi-Agent AI Shopping Architecture
- Real-Time Notifications
- Email Notifications
- SMS Notifications
- Customer Loyalty Program
- Rewards & Membership
- Analytics Dashboard
- Business Intelligence Reporting
- Advanced Personalization
- AI-powered Customer Experience

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
- Amazon Cognito
- Amazon OpenSearch Serverless

---

## vinod-luxury-retail-local

Local prototype built using JSON files before migrating to a serverless AWS architecture.

---

# ⚠️ Disclaimer

This repository was created solely for educational, learning, and portfolio purposes.

The application simulates a luxury retail e-commerce platform to demonstrate modern full-stack software engineering, cloud-native architecture, AI integration, and AWS serverless application development.

All products, brands, customers, stores, addresses, payment methods, shopping carts, favorites, and orders are fictional sample data created exclusively for learning and demonstration purposes.

This project is **not affiliated with, endorsed by, sponsored by, or associated with any retailer, luxury brand, company, or organization**.

Any resemblance to actual companies, products, brands, organizations, services, or trademarks is purely coincidental.

No commercial use is intended.

---

# 👨‍💻 Author

**Vinod Beriki**

DevOps Engineer | AWS | Terraform | Kubernetes | Docker | React | Next.js | TypeScript | Serverless | AI | RAG

GitHub:

https://github.com/berikivinod

---

# 📄 License

MIT License