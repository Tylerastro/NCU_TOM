# NCU TOM: 鹿林天文台觀測管理系統
![License](https://img.shields.io/badge/License-MIT-blue)
![GitHub repo size](https://img.shields.io/github/repo-size/Tylerastro/NCU_TOM)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/tylerastro/NCU_TOM)
[![codecov](https://codecov.io/gh/Tylerastro/NCU_TOM/graph/badge.svg?token=HRARMN5RJZ)](https://codecov.io/gh/Tylerastro/NCU_TOM)
![Codecov](https://img.shields.io/codecov/c/github/Tylerastro/NCU_TOM)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/Tylerastro/NCU_TOM/CI.yml)
![Server](https://img.shields.io/website?url=https%3A%2F%2Ftom.astro.ncu.edu.tw)
[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v2/monitor/165qe.svg)](https://uptime.betterstack.com/?utm_source=status_badge)





# Overview
NCU TOM是基於[Tom's toolkit](https://github.com/TOMToolkit/tom_base)所產生的計畫，為增加使用者體驗以及前後端分離，我們採用Django + Next.js

NCU TOM is a project based on [Tom's toolkit](https://github.com/TOMToolkit/tom_base). To enhance user experience and separate the frontend from the backend, we adopted  Django with Next.js 

## Table of Contents
- [中文](#簡介)
- [English](#introduction)



## 簡介

NCU TOM 是一個專為天文開發的觀測管理系統，目的協助管理觀測目標、排程、數據記錄和分析。瀏覽[NCU TOM](https://tom.astro.ncu.edu.tw)查看最新的上線版本。
目前架構採用Next.js + Django與Django REST Framework 來設計

## 快速開始

```bash
git clone https://github.com/Tylerastro/NCU_TOM.git
cd NCU_TOM
make setup    # 建立 .env.local 設定檔
make dev      # 啟動開發環境
```

其他常用指令：
| 指令 | 說明 |
|------|------|
| `make` | 顯示所有可用指令 |
| `make down` | 停止容器 |
| `make logs` | 查看日誌 |
| `make shell-django` | 進入 Django 容器 |
| `make shell-db` | 開啟 PostgreSQL 控制台 |
| `make test` | 執行測試 |

## 安裝
> 目前CI流程支援Python 3.11, 3.12， node 21+


### Docker compose（推薦）

1. Clone the Repo
```bash
git clone https://github.com/Tylerastro/NCU_TOM.git
cd NCU_TOM
```

2. 複製環境設定檔（首次設定）
```bash
cp .env.example .env.local
```

3. 啟動開發環境（含檔案監聽）
```bash
docker compose -f docker-compose.local.yml up --watch
```

4. 造訪 [localhost:3000](http://localhost:3000) 觀看目前的版本。

### 後端開發 (Django)
```bash
cd backend

# 安裝套件
uv add [package-name]

# 啟動開發伺服器
uv run python manage.py runserver

# 執行測試
uv run pytest

# 執行資料庫遷移
uv run python manage.py migrate

# 建立本地超級使用者
uv run python manage.py create_local_superuser
```

### 前端開發 (Next.js)
```bash
cd frontend

# 開發伺服器
npm run dev

# 建置生產版本
npm run build

# 程式碼檢查
npm run lint

# 啟動生產伺服器
npm start
```

## 開發與測試

### 測試框架
我們使用 **pytest** 進行完整的測試分類：

```bash
# 快速單元測試（無資料庫）
uv run pytest -m "unit" 

# 整合測試（含資料庫）
uv run pytest -m "integration or db"

# 所有測試含覆蓋率
uv run pytest --cov --cov-report=html

# 特定測試類別
uv run pytest -m "api"          # API 端點測試
uv run pytest -m "security"     # 安全測試
uv run pytest -m "astronomical" # 天文專用測試
```

### 程式碼品質工具
- **後端**: Ruff (語法檢查/格式化), mypy (型別檢查), bandit (安全檢查), safety (依賴掃描)
- **前端**: ESLint, TypeScript 檢查, 依賴分析
- **效能**: Lighthouse CI 網頁效能監控


# 加入開發者行列

歡迎所有貢獻！您可以通過以下方式參與：

- 回報錯誤
- 提出建議
- 開發新功能
- 修復程式碼
- ...


# NCU TOM: Lulin Observatory Observation Management System


## Introduction

NCU TOM is an Observation Management System developed specifically for astronomers, aimed at assisting in managing observation targets, scheduling, data recording, and analysis. Visit [NCU TOM](https://tom.astro.ncu.edu.tw) to view the latest online version.

## Quick Start

```bash
git clone https://github.com/Tylerastro/NCU_TOM.git
cd NCU_TOM
make setup    # Create .env.local config
make dev      # Start development environment
```

Common commands:
| Command | Description |
|---------|-------------|
| `make` | Show all available commands |
| `make down` | Stop containers |
| `make logs` | View logs |
| `make shell-django` | Open Django shell |
| `make shell-db` | Open PostgreSQL console |
| `make test` | Run tests |

## Installation

> The current CI process supports Python 3.11, 3.12, and Node 21+

### Docker Compose (Recommended)

1. Clone the Repo
```bash
git clone https://github.com/Tylerastro/NCU_TOM.git
cd NCU_TOM
```

2. Copy environment template (first time only)
```bash
cp .env.example .env.local
```

3. Start full stack with Docker (includes file watching)
```bash
docker compose -f docker-compose.local.yml up --watch
```

4. Visit [localhost:3000](http://localhost:3000) to view the application.

### Backend Development (Django)
```bash
cd backend

# Install dependencies
uv add [package-name]

# Run Django development server
uv run python manage.py runserver

# Run all tests with pytest
uv run pytest

# Run migrations
uv run python manage.py migrate

# Create superuser for local development
uv run python manage.py create_local_superuser
```

### Frontend Development (Next.js)
```bash
cd frontend

# Development server
npm run dev

# Build production
npm run build

# Lint code
npm run lint

# Start production server
npm start
```

## Development & Testing

### Testing Framework
We use **pytest** with comprehensive test categories:

```bash
# Quick unit tests (no database)
uv run pytest -m "unit" 

# Integration tests (with database)  
uv run pytest -m "integration or db"

# All tests with coverage
uv run pytest --cov --cov-report=html

# Specific test categories
uv run pytest -m "api"          # API endpoint tests
uv run pytest -m "security"     # Security tests
uv run pytest -m "astronomical" # Astronomy-specific tests
```

# Join the Development Team

All contributions are welcome! You can participate in the following ways:

- Report errors
- Make suggestions
- Develop new features
- Fix code
- ...
