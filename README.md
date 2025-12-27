# 🏆 Contest Platform Backend – Real-Time Leaderboard System

A **production-ready backend system** for managing contests and real-time leaderboards.  
Designed for **high performance, scalability, and security** using Redis and PostgreSQL.

This project intentionally focuses on **backend architecture and system design**.  
Frontend is excluded for now.

---

## 🚀 Key Features

- 🔐 JWT-based authentication with role-based access (ADMIN / USER)
- 🏆 Real-time leaderboards using Redis Sorted Sets
- 🚦 Redis-backed API rate limiting to prevent abuse
- ⏳ Contest lifecycle management with TTL-based expiration
- 🗄️ PostgreSQL for durable user and contest data
- ⚡ High-performance backend tested under concurrent load
- 🐳 Dockerized infrastructure for Redis and PostgreSQL

---

## 🏗️ Tech Stack

**Backend**
- Node.js
- Express
- PostgreSQL
- Redis
- Prisma ORM
- JWT Authentication
- Docker

---

## 🧠 Architecture Overview

```
Client
|
Backend API (Express)
|
| Auth | Rate Limiter | Services |

|
|── Redis (Sorted Sets, TTL, Counters)
|
|── PostgreSQL (Users, Contests)
```

### Redis Responsibilities
- Leaderboards (Sorted Sets)
- Rate limiting (atomic counters)
- Contest expiration (TTL)

### PostgreSQL Responsibilities
- Users and roles
- Contest metadata
- Durable storage for audit & analytics

---

## ⚙️ Running Locally

### Prerequisites
- Node.js
- Docker

### Start Redis & PostgreSQL
```bash
docker compose up -d
```
### Start Backend Server
```bash
npm install
node src/server.js

```
---
### Performance & Load Testing
 - Load tested using Autocannon
 - Sustained 2,000+ requests/sec under concurrent traffic
 - Average latency <50ms
 - Graceful rejection of abusive traffic via HTTP 429
 - 0 server crashes / 0 5xx errors

### Security Design
 - Password hashing using bcrypt
 - Stateless JWT authentication
 - Role-based access control
 - Rate-limited write-heavy endpoints
 - Redis used only for ephemeral data

**Thank you for visiting this repo!**
