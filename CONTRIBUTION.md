# Contributing to NestJS Bulk Email Service (Bull Queue)

Thank you for considering contributing to this project!  
This guide will help you understand the project, set it up locally, and contribute effectively.

---

## 📌 Project Overview

This is a **high-performance NestJS bulk email service** that can send emails to **1000+ recipients in seconds** using **Bull Queue** and **Redis**.

### Key Features

- ⚡ **Parallel Processing** (10 concurrent jobs by default)
- 🔁 **Automatic Retries** (3 attempts with exponential backoff)
- 💾 **Job Persistence via Redis**
- 🛠 **Error Handling & Logging**
- 📊 **Queue Monitoring Support**
- 📦 **Optimized Bulk Email Queueing**
- 🚫 **Rate Limiting Protection**
- 📨 **SMTP Support**

---

## 🛠 Development Setup

### 1. Install Dependencies

```bash
npm install
