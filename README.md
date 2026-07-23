<div align="center">

<!-- Add your project logo/banner here -->
<!-- ![Backtesting Engine Banner](./assets/banner.png) -->

# 📈 Quant Lab Backtesting Engine

### Professional Algorithmic Trading Platform for Strategy Development & Testing

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.13+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🎯 Overview

A full-stack web application that enables traders and quantitative analysts to **develop, test, and analyze algorithmic trading strategies** with real market data. Built with modern technologies and production-ready architecture.

### ✨ Why This Platform?

| Feature | Description |
|---------|-------------|
| 🎨 **No Coding Required** | Use pre-built strategy templates with visual configuration |
| 🔌 **Multi-Broker Support** | Integrate with Binance, Zerodha, and more |
| 📊 **Real-Time Data** | Test with both historical and real-time market data |
| 📈 **Advanced Analytics** | Sharpe ratio, drawdown analysis, win rate, and more |
| 🔒 **Secure & Scalable** | JWT authentication, PostgreSQL database, cloud-ready |
| ⚡ **Production-Ready** | Built with FastAPI, Next.js, and enterprise patterns |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd Backtesting_Engine-main

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend setup (in new terminal)
cd frontend
npm install
npm run dev
```

**📖 Complete Guide**: [START_HERE.md](./START_HERE.md) | **☁️ Deploy in 5 min**: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

---

## 🎬 Demo

> **Live Demo**: [Coming Soon]  
> **Video Walkthrough**: [Coming Soon]

### Screenshots

<details>
<summary>Click to view screenshots</summary>

#### Dashboard
> Add screenshot: Dashboard with portfolio overview and recent backtests

#### Strategy Editor
> Add screenshot: Monaco Editor with strategy code

#### Backtest Results
> Add screenshot: Performance charts and metrics

</details>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Demo](#-demo)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Strategy Development](#-strategy-development)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Documentation](#-documentation)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Support](#-support)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Strategy Management
- Custom Python strategy development
- Pre-built templates (MA, RSI, MACD)
- Monaco code editor with syntax highlighting
- Strategy versioning & import/export
- Real-time validation

### 🔌 Broker Integration
- Binance (Spot & Futures)
- Extensible broker framework
- Secure API key management
- Real-time & historical data

### 📊 Performance Analytics
- Sharpe & Sortino ratios
- Maximum drawdown analysis
- Win rate & profit factor
- Trade distribution metrics
- Interactive equity curves

</td>
<td width="50%">

### ⚡ Backtesting Engine
- Event-driven architecture
- Multiple timeframes support
- Position & risk management
- Transaction cost modeling
- Slippage simulation

### 🎨 Modern UI/UX
- Responsive dashboard
- Real-time portfolio overview
- Interactive charts (Recharts)
- Detailed trade logs
- CSV/JSON export

### 🔒 Security & Auth
- JWT authentication
- Bcrypt password hashing
- Protected API endpoints
- Role-based access control
- Encrypted credentials

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sql&logoColor=white)

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### DevOps
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

</div>

<details>
<summary><b>📦 Complete Technology Breakdown</b></summary>

#### Backend Technologies
- **Framework**: FastAPI 0.104+ (async support, automatic docs)
- **Language**: Python 3.13+ (type hints, modern features)
- **Database**: PostgreSQL 14+ with SQLAlchemy 2.0 ORM
- **Authentication**: JWT (python-jose) with bcrypt hashing
- **HTTP Clients**: httpx, aiohttp for async broker APIs
- **Validation**: Pydantic v2 for data validation
- **Server**: Uvicorn (high-performance ASGI server)

#### Frontend Technologies
- **Framework**: Next.js 16.1 with App Router
- **Language**: TypeScript 5.0+ (strict mode)
- **UI Library**: React 19.2 with server components
- **Styling**: Tailwind CSS 4.0 (utility-first)
- **Components**: Radix UI primitives (accessible)
- **Code Editor**: Monaco Editor (VS Code engine)
- **Charts**: Recharts (responsive charts)
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React (optimized icons)

#### DevOps & Infrastructure
- **Frontend Hosting**: Vercel (serverless, CDN)
- **Backend Hosting**: Railway/Render (containers)
- **Database**: Managed PostgreSQL (Render/Railway/Supabase)
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions (optional)
- **Monitoring**: Built-in health checks

</details>

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App Router]
        B[Dashboard UI]
        C[Strategy Editor]
        D[Backtest Results]
    end
    
    subgraph "Backend Layer"
        E[FastAPI Server]
        F[Auth Module]
        G[Strategy Manager]
        H[Backtest Engine]
        I[Broker Factory]
    end
    
    subgraph "Data Layer"
        J[(PostgreSQL)]
        K[Users]
        L[Strategies]
        M[Backtests]
    end
    
    subgraph "External Services"
        N[Binance API]
        O[Other Brokers]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    E --> F
    E --> G
    E --> H
    E --> I
    F --> J
    G --> J
    H --> J
    I --> N
    I --> O
    J --> K
    J --> L
    J --> M
```

### 🎨 Design Patterns

| Pattern | Implementation | Purpose |
|---------|---------------|---------|
| **Event-Driven** | Backtesting Engine | Realistic market simulation |
| **Factory Pattern** | Broker integrations | Unified multi-broker interface |
| **Repository Pattern** | Database abstraction | Clean separation of concerns |
| **Strategy Pattern** | Base strategy class | Extensible strategy framework |
| **Middleware** | JWT authentication | Stateless API security |

---

## 💻 Installation

### Prerequisites

> **Required**: Python 3.11+, Node.js 20+, PostgreSQL 14+  
> **Optional**: Docker, Git

### Quick Setup

#### 1️⃣ Clone Repository
```bash
git clone <your-repo-url>
cd Backtesting_Engine-main
```

#### 2️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/backtesting_db
SECRET_KEY=your-secret-key-generate-with-openssl-rand-hex-32
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=http://localhost:3000
```

Start backend:
```bash
uvicorn main:app --reload
```
> ✅ Backend: http://localhost:8000 | 📚 API Docs: http://localhost:8000/docs

#### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start frontend:
```bash
npm run dev
```
> ✅ Frontend: http://localhost:3000

<details>
<summary><b>🐳 Docker Setup (Alternative)</b></summary>

```bash
# Coming soon - Docker Compose configuration
docker-compose up -d
```

</details>

<details>
<summary><b>🔧 Detailed Setup Instructions</b></summary>

### Database Setup

**Option 1: Local PostgreSQL**
```bash
# macOS
brew install postgresql
brew services start postgresql
createdb backtesting_db

# Ubuntu/Debian
sudo apt install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb backtesting_db
```

**Option 2: Cloud Database**
- Use [Supabase](https://supabase.com) (free tier)
- Use [Railway](https://railway.app) (free tier)
- Use [Render](https://render.com) (free tier)

### Environment Variables

Generate secure SECRET_KEY:
```bash
openssl rand -hex 32
```

### Database Migrations
```bash
cd backend
# Tables are auto-created on first run
# Or use Alembic for migrations:
python -m alembic upgrade head
```

### Common Issues

**Port already in use:**
```bash
# Backend: Change port
uvicorn main:app --reload --port 8001

# Frontend: Change port in package.json
npm run dev -- -p 3001
```

**Database connection error:**
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL format
- Test connection: `psql $DATABASE_URL`

</details>

---

## 🎮 Usage

### Getting Started Workflow

```mermaid
graph LR
    A[Register Account] --> B[Connect Broker]
    B --> C[Create Strategy]
    C --> D[Run Backtest]
    D --> E[Analyze Results]
    style A fill:#e1f5ff
    style C fill:#fff4e1
    style D fill:#e8f5e9
    style E fill:#fce4ec
```

### 1️⃣ Register an Account

Navigate to `http://localhost:3000/register` and create your account:
- Enter email and password
- Confirm registration
- Login with your credentials

### 2️⃣ Configure Broker Connection (Optional)

<details>
<summary>Setup broker API credentials</summary>

1. Navigate to Settings → Broker Configuration
2. Select your broker (e.g., Binance)
3. Add API credentials:
   - API Key
   - API Secret
4. Test connection
5. Save configuration

> **Note**: This step is optional for testing with demo data

</details>

### 3️⃣ Create a Strategy

<table>
<tr>
<td width="50%">

#### Option A: Use Template 🎨
1. Navigate to **Strategies → New Strategy**
2. Select a pre-built template:
   - MA Crossover
   - RSI Mean Reversion
   - MACD Momentum
3. Customize parameters
4. Save strategy

</td>
<td width="50%">

#### Option B: Custom Code 💻
1. Navigate to **Strategies → New Strategy**
2. Choose **"Custom"** template
3. Write Python strategy code
4. Validate syntax
5. Save strategy

</td>
</tr>
</table>

**Example Strategy Code:**
```python
from strategies.base import BaseStrategy

class MyStrategy(BaseStrategy):
    def __init__(self):
        super().__init__()
        self.name = "My Custom Strategy"
        
    def should_enter(self, candles):
        # Your entry logic here
        return True  # or False
        
    def should_exit(self, candles, position):
        # Your exit logic here
        return True  # or False
```

> 📖 **Learn More**: [STRATEGY_FORMAT_GUIDE.md](./backend/STRATEGY_FORMAT_GUIDE.md)

### 4️⃣ Run a Backtest

1. Navigate to your saved strategy
2. Click **"Run Backtest"** button
3. Configure backtest parameters:

| Parameter | Example | Description |
|-----------|---------|-------------|
| **Symbol** | BTC/USDT | Trading pair |
| **Timeframe** | 1h | Candle interval (1m, 5m, 1h, 1d) |
| **Date Range** | 2024-01-01 to 2024-12-31 | Historical period |
| **Initial Capital** | $10,000 | Starting balance |
| **Position Size** | 10% | Percentage per trade |

4. Click **"Start Backtest"**
5. View real-time progress and results

### 5️⃣ Analyze Results

View comprehensive performance analytics:

- 📊 **Performance Metrics**: Return, Sharpe ratio, max drawdown
- 📈 **Equity Curve**: Visual portfolio growth
- 📝 **Trade Log**: Detailed trade-by-trade breakdown
- 💾 **Export**: Download results as CSV/JSON
- 🔄 **Compare**: Side-by-side backtest comparison

---

## 📂 Project Structure

```
Backtesting_Engine-main/
├── backend/                      # FastAPI backend
│   ├── main.py                   # Application entry point
│   ├── requirements.txt          # Python dependencies
│   ├── api/                      # API route handlers
│   │   ├── health.py            # Health check endpoints
│   │   ├── brokers.py           # Broker-related endpoints
│   │   └── strategies.py        # Strategy CRUD endpoints
│   ├── auth/                     # Authentication module
│   │   ├── dependencies.py      # Auth dependencies
│   │   ├── jwt.py               # JWT token handling
│   │   ├── password.py          # Password hashing
│   │   ├── routes.py            # Auth routes (login/register)
│   │   └── schemas.py           # Auth schemas
│   ├── brokers/                  # Broker integrations
│   │   ├── base.py              # Base broker interface
│   │   ├── binance.py           # Binance implementation
│   │   └── factory.py           # Broker factory
│   ├── core/                     # Core domain models
│   │   └── candle.py            # Candle data structure
│   ├── db/                       # Database configuration
│   │   └── database.py          # SQLAlchemy setup
│   ├── engine/                   # Backtesting engine
│   │   ├── backtest.py          # Main backtest runner
│   │   └── position.py          # Position management
│   ├── models/                   # SQLAlchemy models
│   │   ├── user.py              # User model
│   │   ├── strategy.py          # Strategy model
│   │   └── backtest.py          # Backtest model
│   ├── strategies/               # Strategy framework
│   │   ├── base.py              # Base strategy class
│   │   ├── indicators.py        # Technical indicators
│   │   ├── loader.py            # Dynamic strategy loader
│   │   └── schemas.py           # Strategy schemas
│   └── examples/                 # Example strategies
│       └── strategies/
│           ├── ma_crossover.py
│           ├── rsi_mean_reversion.py
│           └── macd_momentum.py
│
├── frontend/                     # Next.js frontend
│   ├── package.json             # Node dependencies
│   ├── next.config.ts           # Next.js configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/           # Login page
│   │   │   └── register/        # Register page
│   │   └── (dashboard)/         # Dashboard route group
│   │       ├── dashboard/       # Main dashboard
│   │       ├── strategies/      # Strategy management
│   │       └── backtests/       # Backtest results
│   ├── components/              # React components
│   │   ├── layout/              # Layout components
│   │   └── ui/                  # UI components (buttons, cards, etc.)
│   └── lib/                     # Utilities and configs
│       ├── api.ts               # API client
│       ├── config.ts            # App configuration
│       └── types.ts             # TypeScript types
│
├── DEPLOYMENT_GUIDE.md          # Comprehensive deployment guide
├── QUICK_DEPLOY.md              # Quick deployment (Railway)
├── QUICK_DEPLOY_RENDER.md       # Quick deployment (Render)
├── START_HERE.md                # Getting started guide
└── README.md                    # This file
```

---

## 📚 API Documentation

### Interactive API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Key Endpoints

#### Authentication
```
POST /auth/register          # Register new user
POST /auth/login            # Login and get JWT token
GET  /auth/me               # Get current user info
```

#### Strategies
```
GET    /api/strategies               # List all strategies
POST   /api/strategies               # Create new strategy
GET    /api/strategies/{id}          # Get strategy by ID
PUT    /api/strategies/{id}          # Update strategy
DELETE /api/strategies/{id}          # Delete strategy
POST   /api/strategies/{id}/backtest # Run backtest
```

#### Brokers
```
GET  /api/brokers                    # List available brokers
POST /api/brokers/connect            # Connect broker API
GET  /api/brokers/candles            # Fetch historical data
```

#### Health
```
GET  /health                         # Health check
GET  /health/db                      # Database health
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 📊 Strategy Development

### Strategy Template Structure

```python
from strategies.base import BaseStrategy
from strategies.indicators import sma, rsi, macd

class MyCustomStrategy(BaseStrategy):
    """
    My custom trading strategy description
    """
    
    def __init__(self, param1=20, param2=50):
        super().__init__()
        self.name = "My Custom Strategy"
        self.param1 = param1
        self.param2 = param2
        
    def should_enter(self, candles):
        """
        Entry logic - return True to open position
        
        Args:
            candles: List of Candle objects (OHLCV data)
            
        Returns:
            bool: True if entry condition is met
        """
        if len(candles) < self.param2:
            return False
            
        # Calculate indicators
        sma_short = sma(candles, self.param1)
        sma_long = sma(candles, self.param2)
        
        # Entry condition: short SMA crosses above long SMA
        return sma_short[-1] > sma_long[-1] and sma_short[-2] <= sma_long[-2]
        
    def should_exit(self, candles, position):
        """
        Exit logic - return True to close position
        
        Args:
            candles: List of Candle objects
            position: Current position object
            
        Returns:
            bool: True if exit condition is met
        """
        if len(candles) < self.param2:
            return False
            
        # Calculate indicators
        sma_short = sma(candles, self.param1)
        sma_long = sma(candles, self.param2)
        
        # Exit condition: short SMA crosses below long SMA
        return sma_short[-1] < sma_long[-1] and sma_short[-2] >= sma_long[-2]
```

### Available Indicators

The platform provides common technical indicators:

- **Moving Averages**: `sma()`, `ema()`
- **Momentum**: `rsi()`, `macd()`, `stochastic()`
- **Volatility**: `bollinger_bands()`, `atr()`
- **Volume**: `obv()`, `volume_sma()`

See [STRATEGY_FORMAT_GUIDE.md](./backend/STRATEGY_FORMAT_GUIDE.md) for complete documentation.

---

## 🚀 Deployment

### Quick Deployment Options

1. **Vercel + Railway** (Recommended - 5 minutes)
   - [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

2. **Vercel + Render** (Popular - 10 minutes)
   - [QUICK_DEPLOY_RENDER.md](./QUICK_DEPLOY_RENDER.md)

3. **Both on Render**
   - [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)

### Deployment Checklist

Before deploying, review:
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

### Environment Variables

**Backend:**
```env
DATABASE_URL=postgresql://...
SECRET_KEY=...
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=https://your-frontend-domain.com
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=.

# Run specific test file
pytest tests/test_backtest.py
```

### Frontend Tests

```bash
cd frontend

# Run tests (if configured)
npm test

# Run linting
npm run lint
```

### Integration Tests

See [INTEGRATION_TEST.md](./INTEGRATION_TEST.md) for end-to-end testing guide.

### Postman Collection

Import [backend/POSTMAN_COLLECTION.json](./backend/POSTMAN_COLLECTION.json) to test API endpoints.

---

## 📖 Documentation

- **[START_HERE.md](./START_HERE.md)** - Quick start guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[BACKTESTING_EXPLANATION.md](./BACKTESTING_EXPLANATION.md)** - How backtesting works
- **[STRATEGY_FORMAT_GUIDE.md](./backend/STRATEGY_FORMAT_GUIDE.md)** - Strategy development guide
- **[STRATEGY_QUICK_REFERENCE.md](./backend/STRATEGY_QUICK_REFERENCE.md)** - Quick reference
- **[POSTMAN_TESTING_GUIDE.md](./backend/POSTMAN_TESTING_GUIDE.md)** - API testing guide
- **[PLATFORM_COMPARISON.md](./PLATFORM_COMPARISON.md)** - Deployment platform comparison
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Current project status

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Core backtesting engine with event-driven architecture
- [x] User authentication and authorization
- [x] Strategy management system
- [x] Binance integration
- [x] Performance analytics dashboard
- [x] Monaco code editor integration

### 🚧 In Progress
- [ ] Paper trading mode (simulated live trading)
- [ ] Additional broker integrations (Zerodha, Alpaca)
- [ ] Strategy marketplace
- [ ] Mobile responsive improvements

### 📅 Planned Features
- [ ] Real-time trading (live execution)
- [ ] Portfolio optimization tools
- [ ] Machine learning strategy builder
- [ ] Social features (strategy sharing, leaderboards)
- [ ] Advanced charting with TradingView integration
- [ ] Webhook notifications (Discord, Telegram)
- [ ] Multi-currency support
- [ ] Options & futures strategies

**💡 Have a feature request?** [Open an issue](../../issues/new) with the `enhancement` label.

---

## 🤝 Contributing

<div align="center">

### We welcome contributions! 🎉

[![Contributors](https://img.shields.io/github/contributors/yourusername/backtesting-engine?style=for-the-badge)](../../graphs/contributors)
[![Issues](https://img.shields.io/github/issues/yourusername/backtesting-engine?style=for-the-badge)](../../issues)
[![Pull Requests](https://img.shields.io/github/issues-pr/yourusername/backtesting-engine?style=for-the-badge)](../../pulls)

</div>

### How to Contribute

1. **🍴 Fork the repository**
2. **🔀 Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **✍️ Make your changes**
4. **✅ Test your changes**
   ```bash
   # Backend tests
   cd backend && pytest
   
   # Frontend linting
   cd frontend && npm run lint
   ```
5. **💬 Commit with clear messages**
   ```bash
   git commit -m 'feat: Add amazing feature'
   ```
6. **📤 Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **🎯 Open a Pull Request**

### Contribution Guidelines

<table>
<tr>
<td>

#### Code Style
- **Python**: Follow [PEP 8](https://pep8.org/)
- **TypeScript**: Use ESLint config
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/)

</td>
<td>

#### Pull Requests
- Link related issues
- Add tests for new features
- Update documentation
- Keep PRs focused and small

</td>
</tr>
</table>

### Development Setup

```bash
# Install pre-commit hooks
pip install pre-commit
pre-commit install

# Run tests
cd backend && pytest --cov
cd frontend && npm test

# Format code
cd backend && black . && isort .
cd frontend && npm run format
```

**📖 Read our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.**

---

## � Support

### 📚 Documentation
- [START_HERE.md](./START_HERE.md) - Getting started guide  
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - Quick deployment
- [STRATEGY_FORMAT_GUIDE.md](./backend/STRATEGY_FORMAT_GUIDE.md) - Strategy development
- [POSTMAN_TESTING_GUIDE.md](./backend/POSTMAN_TESTING_GUIDE.md) - API testing

### 🐛 Issues & Questions
- Report bugs via [GitHub Issues](../../issues)
- Ask questions in [GitHub Discussions](../../discussions)

---

<div align="center">

**Made with ❤️ for algorithmic traders and quantitative analysts**

License: [MIT](LICENSE)

</div>

