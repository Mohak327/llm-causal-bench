# LLM Causal Bench

A Next.js application for benchmarking Large Language Models (LLMs) on causal reasoning tasks. This project provides tools to generate Structural Causal Models (SCMs) and test LLM performance on causal inference scenarios.

## Features

- **Generate SCMs**: Create custom Structural Causal Models with interactive graph visualization
- **Test Module**: Benchmark LLMs on causal reasoning tasks with various error types
- **Multi-Model Support**: Test with Claude, GPT-4, Gemini Pro, and Llama models
- **Interactive Visualizations**: View causal graphs with ReactFlow
- **Markdown Support**: Formatted responses with ReactMarkdown
- **Environment-Specific Configuration**: Separate configs for local, QA, and production

## Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for LLM providers (Anthropic, OpenAI, Google)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd llm-causal-bench
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## Environment Configuration

This project uses environment-specific configuration files to manage different deployment stages.

### Setting Up Environment Files

Create three environment files in the project root:

#### 1. `.env.local` (Local Development)
```env
# Local Development Environment
NEXT_PUBLIC_ENV_NAME=LOCAL
NEXT_PUBLIC_APP_ENV=development

# API Keys (Add your actual keys here)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

#### 2. `.env.prod` (Production)
```env
# Production Environment
NEXT_PUBLIC_ENV_NAME=PROD
NEXT_PUBLIC_APP_ENV=production

# API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-production-domain.com
```

### Environment Variables Explained

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ENV_NAME` | Environment identifier (LOCAL/QA1/PROD) |
| `NEXT_PUBLIC_APP_ENV` | Next.js environment mode |
| `ANTHROPIC_API_KEY` | Claude API key from Anthropic |
| `OPENAI_API_KEY` | GPT-4 API key from OpenAI |
| `GEMINI_API_KEY` | Gemini Pro API key from Google |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL for API calls |

**Note**: The `NEXT_PUBLIC_*` prefix makes variables accessible in the browser. Server-only keys (like API keys) should NOT use this prefix.

## Running the Project

### Development Mode

**Local environment:**
```bash
npm run dev
```
Runs on `http://localhost:3000` with `.env.local` configuration.

**QA environment:**
```bash
npm run dev-qa
```
Runs locally but uses `.env.qa` configuration.

**Production environment locally:**
```bash
npm run dev-prod
```
Runs locally but uses `.env.prod` configuration (useful for testing prod settings).

### Production Build

**Build for production:**
```bash
npm run build-prod
```

**Start production server:**
```bash
npm start
```

## Project Structure

```
llm-causal-bench/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── evaluate-response/
│   │   │   ├── generate-scm/
│   │   │   └── test-models/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.jsx
│   ├── components/            # React components
│   │   ├── Molecules/
│   │   │   └── SCMGraph/     # Causal graph visualization
│   │   └── Organisms/
│   │       ├── GenerateModule/
│   │       └── TestModule/
│   ├── config/
│   │   └── env.config.ts     # Centralized environment config
│   ├── page-data/
│   │   └── benchmark/        # Causal templates and data
│   └── services/
│       ├── analysis/         # Analysis service
│       └── llm/             # LLM service
├── .env.local               # Local environment variables
├── .env.qa                  # QA environment variables
├── .env.prod                # Production environment variables
└── package.json
```

## Features Overview

### Generate Module
- Create custom Structural Causal Models
- Define variables, relationships, and mechanisms
- Visualize causal graphs interactively
- Support for multiple LLM providers

### Test Module
- Benchmark LLMs on causal reasoning
- Test various error types:
  - Spurious correlations
  - Confounders
  - Selection bias
  - Reverse causality
- View detailed performance metrics
- Compare model responses

### Environment-Aware Features
- **Debug Mode**: Load dummy data buttons (hidden in PROD)
- **Environment Indicator**: Shows current environment in UI
- **Feature Flags**: Controlled via `ENV_CONFIG.SHOW_DEBUG_FEATURES`

## Accessing Environment Config in Code

Use the centralized configuration:

```typescript
import { ENV_CONFIG } from '@/config/env.config';

// Check environment
if (ENV_CONFIG.IS_PRODUCTION) {
  // Production-only code
}

// Use feature flags
if (ENV_CONFIG.SHOW_DEBUG_FEATURES) {
  // Show debug tools
}

// Get environment name
console.log(ENV_CONFIG.ENV_NAME); // LOCAL, QA1, or PROD
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_ENV_NAME=PROD`
   - `NEXT_PUBLIC_APP_ENV=production`
   - `ANTHROPIC_API_KEY=<your-key>`
   - `OPENAI_API_KEY=<your-key>`
   - `GEMINI_API_KEY=<your-key>`
   - `NEXT_PUBLIC_API_BASE_URL=<your-domain>`

4. Deploy

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

## Technologies

- **Framework**: Next.js 16.0.3
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS + Typography plugin
- **Markdown**: ReactMarkdown
- **Graphs**: ReactFlow
- **Icons**: Lucide React
- **Environment Management**: env-cmd
- **LLM APIs**: Anthropic, OpenAI, Google Generative AI

## Development Guidelines

- Use MVC pattern for components (Model, View, Controller)
- Keep environment variables in centralized `env.config.ts`
- Hide debug features in production using `ENV_CONFIG.SHOW_DEBUG_FEATURES`
- Follow atomic design principles for components
- Use TypeScript for type safety

## License

MIT  
  
