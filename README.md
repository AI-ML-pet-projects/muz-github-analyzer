# Muz GitHub Analyzer 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack & Dependencies](#tech-stack--dependencies)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)

## Overview

Muz GitHub Analyzer is a web-based dashboard built with Next.js 14, React 18, and TypeScript. It offers secure authentication, API key management, and analytics for GitHub repositories. Built on Supabase with Tailwind CSS and shadcn/ui, it provides a modern, responsive interface.

🎬 Demo clip coming soon! We'll showcase the key features and user experience.

> **Note**: This project is heavily inspired by and adapted from [dandi](https://github.com/emarco177/dandi). Many thanks to the original author for their excellent work.

## Features

- 📊 GitHub repository metadata fetching and analytics
- 🔑 API Key Management (create, update, delete, validate)
- 🔐 User Authentication with NextAuth.js (Google OAuth)
- 📱 Responsive UI powered by Tailwind CSS and shadcn/ui
- 🗄️ Supabase database for user and API key storage
- 🤖 Langchain/OpenAI integration for advanced summarization
- 🐳 Docker-ready for streamlined deployment
- ⚙️ Environment variable validation at runtime

## Tech Stack & Dependencies

| Dependency        | Version / Notes           |
| ----------------- | ------------------------- |
| Next.js           | 14.2.23                   |
| React             | 18                        |
| TypeScript        | 5                         |
| Tailwind CSS      | 3.4.x                     |
| shadcn/ui         | 0.0.4                     |
| NextAuth.js       | 4.24.11                   |
| Supabase JS       | 2.49.4                    |
| @langchain/core   | 0.3.51                    |
| @langchain/openai | 0.5.10                    |
| OpenAI API        | Requires `OPENAI_API_KEY` |
| Docker            | Containerization          |

## Demo

🚧 Coming Soon! Stay tuned for the public demo link.

## Getting Started

### Prerequisites

- Node.js v18+
- npm / yarn / pnpm
- Docker (optional)
- Supabase project
- Google OAuth credentials for NextAuth

### Environment Variables

Copy `.env.example` to `.env` and update values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>

# Authentication (NextAuth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your_nextauth_secret>

# Google OAuth
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>

# OpenAI (optional for summarization)
OPENAI_API_KEY=<your_openai_api_key>

# Demo API key (public)
NEXT_PUBLIC_DEMO_API_KEY=<your_demo_api_key>
```

### Run Locally

1. Install dependencies:
   ```bash
   npm install     # or `yarn install` / `pnpm install`
   ```
2. Run the development server:
   ```bash
   npm run dev     # or `yarn dev` / `pnpm dev`
   ```
3. Open your browser to [http://localhost:3000](http://localhost:3000).

### Run with Docker

Before building the Docker image, ensure your Supabase environment variables are set:

> **Important**: The Docker build requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to be properly configured in your `.env.example` file. Without these, the application will fail to start.

1. Build Docker image:
   ```bash
   docker build -t muz-github-analyzer .
   ```
2. Run container:
   ```bash
   docker run -p 3000:3000 --env-file .env muz-github-analyzer
   ```

## API Endpoints

| Endpoint                  | Method    | Description                            | Auth Required        |
| ------------------------- | --------- | -------------------------------------- | -------------------- |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth.js authentication routes      | No                   |
| `/api/api-keys`           | GET       | List API keys for current user         | Yes (session cookie) |
| `/api/api-keys`           | POST      | Create a new API key                   | Yes                  |
| `/api/api-keys/[id]`      | DELETE    | Delete an API key by ID                | Yes                  |
| `/api/api-keys/[id]`      | PATCH     | Update API key metadata                | Yes                  |
| `/api/validate-key`       | POST      | Validate an API key (header/body)      | No\*                 |
| `/api/github-summarizer`  | POST      | Generate repository summary via OpenAI | Yes (Bearer token)   |
| `/api/usage`              | GET       | Fetch user usage statistics and limits | Yes                  |

\*Validation endpoint accepts the key in `Authorization: Bearer <key>` header or JSON body.

## Authentication

This application uses NextAuth.js with Google OAuth provider:

1. User clicks **Sign in with Google**
2. NextAuth.js handles OAuth flow
3. Session is stored in JWT cookies
4. Protected routes and API endpoints require a valid session or API key

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
