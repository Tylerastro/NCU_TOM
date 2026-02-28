# =============================================================================
# NCU TOM Development Makefile
# Run `make` or `make help` to see all available commands
# =============================================================================

.PHONY: help setup dev prod down logs logs-follow build rebuild \
        shell-django shell-frontend shell-db \
        migrate makemigrations createsuperuser test lint \
        clean status ps

# Colors for output
CYAN := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m
BOLD := \033[1m

# Docker compose files
LOCAL_COMPOSE := docker-compose.local.yml
PROD_COMPOSE := docker-compose.prod.yml

# Default target: show help
.DEFAULT_GOAL := help

# =============================================================================
# Help
# =============================================================================

help: ## Show this help message
	@echo ""
	@echo "$(BOLD)NCU TOM Development Commands$(RESET)"
	@echo "=============================="
	@echo ""
	@echo "$(BOLD)Quick Start:$(RESET)"
	@echo "  $(CYAN)make setup$(RESET)    - First-time setup (creates .env.local)"
	@echo "  $(CYAN)make dev$(RESET)      - Start local development with file watching"
	@echo "  $(CYAN)make down$(RESET)     - Stop all containers"
	@echo ""
	@echo "$(BOLD)Available Commands:$(RESET)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-18s$(RESET) %s\n", $$1, $$2}'
	@echo ""

# =============================================================================
# Setup
# =============================================================================

setup: ## First-time setup: creates .env.local from template
	@if [ -f .env.local ]; then \
		echo "$(YELLOW)⚠ .env.local already exists$(RESET)"; \
		read -p "Overwrite? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 0; \
	fi
	@cp .env.example .env.local
	@echo "$(GREEN)✓ Created .env.local from .env.example$(RESET)"
	@echo "$(YELLOW)→ Edit .env.local with your settings before running 'make dev'$(RESET)"

# =============================================================================
# Development Environment
# =============================================================================

dev: ## Start local development environment with file watching
	@if [ ! -f .env.local ]; then \
		echo "$(RED)✗ .env.local not found. Run 'make setup' first.$(RESET)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Starting development environment...$(RESET)"
	docker compose -f $(LOCAL_COMPOSE) up --watch

dev-detach: ## Start local development in background (detached)
	@if [ ! -f .env.local ]; then \
		echo "$(RED)✗ .env.local not found. Run 'make setup' first.$(RESET)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Starting development environment (detached)...$(RESET)"
	docker compose -f $(LOCAL_COMPOSE) up -d --watch
	@echo "$(GREEN)✓ Development environment started$(RESET)"
	@echo "$(CYAN)→ Frontend: http://localhost:3000$(RESET)"
	@echo "$(CYAN)→ Backend:  http://localhost:8000$(RESET)"
	@echo "$(CYAN)→ Run 'make logs' to view logs$(RESET)"

prod: ## Start production environment (detached)
	@if [ ! -f .env.prod ]; then \
		echo "$(RED)✗ .env.prod not found. Create it before running production.$(RESET)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Starting production environment...$(RESET)"
	docker compose -f $(PROD_COMPOSE) up -d
	@echo "$(GREEN)✓ Production environment started$(RESET)"

# =============================================================================
# Container Management
# =============================================================================

down: ## Stop containers (auto-detects environment)
	@if docker compose -f $(LOCAL_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		echo "$(YELLOW)Stopping local development containers...$(RESET)"; \
		docker compose -f $(LOCAL_COMPOSE) down; \
		echo "$(GREEN)✓ Local containers stopped$(RESET)"; \
	elif docker compose -f $(PROD_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		echo "$(YELLOW)Stopping production containers...$(RESET)"; \
		docker compose -f $(PROD_COMPOSE) down; \
		echo "$(GREEN)✓ Production containers stopped$(RESET)"; \
	else \
		echo "$(YELLOW)No running containers found$(RESET)"; \
	fi

down-local: ## Stop local development containers
	docker compose -f $(LOCAL_COMPOSE) down
	@echo "$(GREEN)✓ Local containers stopped$(RESET)"

down-prod: ## Stop production containers
	docker compose -f $(PROD_COMPOSE) down
	@echo "$(GREEN)✓ Production containers stopped$(RESET)"

restart: ## Restart containers (auto-detects environment)
	@if docker compose -f $(LOCAL_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		echo "$(YELLOW)Restarting local containers...$(RESET)"; \
		docker compose -f $(LOCAL_COMPOSE) restart; \
	elif docker compose -f $(PROD_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		echo "$(YELLOW)Restarting production containers...$(RESET)"; \
		docker compose -f $(PROD_COMPOSE) restart; \
	else \
		echo "$(YELLOW)No running containers found$(RESET)"; \
	fi

status: ## Show status of containers (auto-detects environment)
	@if docker compose -f $(LOCAL_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		echo "$(BOLD)Local Development Containers:$(RESET)"; \
		docker compose -f $(LOCAL_COMPOSE) ps; \
	elif docker compose -f $(PROD_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		echo "$(BOLD)Production Containers:$(RESET)"; \
		docker compose -f $(PROD_COMPOSE) ps; \
	else \
		echo "$(YELLOW)No running containers$(RESET)"; \
	fi

ps: status ## Alias for 'status'

# =============================================================================
# Logs
# =============================================================================

logs: ## View container logs (auto-detects environment)
	@if docker compose -f $(LOCAL_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) logs --tail=100; \
	elif docker compose -f $(PROD_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		docker compose -f $(PROD_COMPOSE) logs --tail=100; \
	else \
		echo "$(YELLOW)No running containers$(RESET)"; \
	fi

logs-follow: ## Follow container logs (auto-detects environment)
	@if docker compose -f $(LOCAL_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) logs -f; \
	elif docker compose -f $(PROD_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		docker compose -f $(PROD_COMPOSE) logs -f; \
	else \
		echo "$(YELLOW)No running containers$(RESET)"; \
	fi

logs-django: ## View Django container logs
	@if docker compose -f $(LOCAL_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) logs --tail=100 django; \
	elif docker compose -f $(PROD_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		docker compose -f $(PROD_COMPOSE) logs --tail=100 django; \
	fi

logs-frontend: ## View frontend container logs
	@if docker compose -f $(LOCAL_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) logs --tail=100 nextjs; \
	elif docker compose -f $(PROD_COMPOSE) ps -q 2>/dev/null | grep -q .; then \
		docker compose -f $(PROD_COMPOSE) logs --tail=100 react; \
	fi

# =============================================================================
# Shell Access
# =============================================================================

shell-django: ## Open bash shell in Django container
	@if docker compose -f $(LOCAL_COMPOSE) ps -q django 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) exec django bash; \
	elif docker compose -f $(PROD_COMPOSE) ps -q django 2>/dev/null | grep -q .; then \
		docker compose -f $(PROD_COMPOSE) exec django bash; \
	else \
		echo "$(RED)✗ Django container is not running$(RESET)"; \
	fi

shell-frontend: ## Open bash shell in frontend container
	@if docker compose -f $(LOCAL_COMPOSE) ps -q nextjs 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) exec nextjs sh; \
	elif docker compose -f $(PROD_COMPOSE) ps -q react 2>/dev/null | grep -q .; then \
		docker compose -f $(PROD_COMPOSE) exec react sh; \
	else \
		echo "$(RED)✗ Frontend container is not running$(RESET)"; \
	fi

shell-db: ## Open PostgreSQL console
	@if docker compose -f $(LOCAL_COMPOSE) ps -q db 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) exec db psql -U tom -d tom; \
	elif docker compose -f $(PROD_COMPOSE) ps -q db 2>/dev/null | grep -q .; then \
		docker compose -f $(PROD_COMPOSE) exec db psql -U tom -d tom; \
	else \
		echo "$(RED)✗ Database container is not running$(RESET)"; \
	fi

# =============================================================================
# Django Management Commands
# =============================================================================

migrate: ## Run Django migrations
	@if docker compose -f $(LOCAL_COMPOSE) ps -q django 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) exec django uv run python manage.py migrate; \
	elif docker compose -f $(PROD_COMPOSE) ps -q django 2>/dev/null | grep -q .; then \
		docker compose -f $(PROD_COMPOSE) exec django uv run python manage.py migrate; \
	else \
		echo "$(RED)✗ Django container is not running$(RESET)"; \
	fi

makemigrations: ## Create Django migrations
	@if docker compose -f $(LOCAL_COMPOSE) ps -q django 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) exec django uv run python manage.py makemigrations; \
	else \
		echo "$(RED)✗ Django container is not running. Start with 'make dev' first.$(RESET)"; \
	fi

createsuperuser: ## Create Django superuser
	@if docker compose -f $(LOCAL_COMPOSE) ps -q django 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) exec django uv run python manage.py createsuperuser; \
	else \
		echo "$(RED)✗ Django container is not running. Start with 'make dev' first.$(RESET)"; \
	fi

# =============================================================================
# Testing
# =============================================================================

test: ## Run backend tests with pytest
	@if docker compose -f $(LOCAL_COMPOSE) ps -q django 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) exec django uv run pytest; \
	else \
		echo "$(YELLOW)Running tests locally...$(RESET)"; \
		cd backend && uv run pytest; \
	fi

test-cov: ## Run backend tests with coverage report
	@if docker compose -f $(LOCAL_COMPOSE) ps -q django 2>/dev/null | grep -q .; then \
		docker compose -f $(LOCAL_COMPOSE) exec django uv run pytest --cov --cov-report=html; \
	else \
		echo "$(YELLOW)Running tests locally...$(RESET)"; \
		cd backend && uv run pytest --cov --cov-report=html; \
	fi

# =============================================================================
# Build
# =============================================================================

build: ## Build Docker images for local development
	docker compose -f $(LOCAL_COMPOSE) build

build-prod: ## Build Docker images for production
	docker compose -f $(PROD_COMPOSE) build

rebuild: ## Rebuild and restart local development (no cache)
	docker compose -f $(LOCAL_COMPOSE) build --no-cache
	@echo "$(GREEN)✓ Rebuild complete. Run 'make dev' to start.$(RESET)"

# =============================================================================
# Cleanup
# =============================================================================

clean: ## Remove stopped containers and unused images
	@echo "$(YELLOW)Cleaning up Docker resources...$(RESET)"
	docker compose -f $(LOCAL_COMPOSE) down --remove-orphans 2>/dev/null || true
	docker compose -f $(PROD_COMPOSE) down --remove-orphans 2>/dev/null || true
	docker system prune -f
	@echo "$(GREEN)✓ Cleanup complete$(RESET)"

clean-volumes: ## Remove containers AND volumes (⚠ destroys database data)
	@echo "$(RED)⚠ This will delete all database data!$(RESET)"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 0
	docker compose -f $(LOCAL_COMPOSE) down -v 2>/dev/null || true
	docker compose -f $(PROD_COMPOSE) down -v 2>/dev/null || true
	@echo "$(GREEN)✓ Volumes removed$(RESET)"
