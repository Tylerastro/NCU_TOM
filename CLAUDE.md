# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NCU TOM is an astronomical observation management system built with Django REST Framework backend and Next.js frontend. It manages observation targets, scheduling, data recording, and analysis for the Lulin Observatory.

## Architecture

- **Backend**: Django 5.1.3 with Django REST Framework, PostgreSQL database
- **Frontend**: Next.js 14+ with TypeScript, TailwindCSS, and shadcn/ui components
- **Authentication**: NextAuth v5 with custom Django backend integration
- **Development**: Docker Compose with file watching for local development

## Development Commands

### Local Development (Recommended)
```bash
# First-time setup
make setup          # Creates .env.local from .env.example

# Start full stack with Docker (includes file watching)
make dev            # or: docker compose -f docker-compose.local.yml up --watch

# Build Docker images
make build          # or: docker compose -f docker-compose.local.yml build
```

### Backend (Django)
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

### Frontend (Next.js)
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

## Project Structure

### Backend Apps
- `targets/`: Target management (astronomical objects with RA/Dec coordinates)
- `observations/`: Observation requests and Lulin telescope integration
- `system/`: User management, authentication, permissions
- `helpers/`: Shared utilities, tags, email notifications
- `dataproducts/`: Data processing and retrieval from Lulin

### Frontend Structure
- `app/(contents)/`: Main application pages with Next.js app router
- `apis/`: API client functions for backend communication
- `components/`: Reusable UI components (uses shadcn/ui)
- `models/`: TypeScript type definitions
- `utils/`: Utility functions

## Key Patterns

### Backend
- All apps follow Django REST Framework patterns with ViewSets
- Models use soft deletion (`deleted_at` field)
- Custom user model extends AbstractUser (`system.User`)
- API responses use custom `ErrorResponseMixin` for consistent error handling
- Pagination handled by custom `StandardResultsSetPagination`

### Frontend
- Uses Next.js App Router with TypeScript
- State management via React Query (@tanstack/react-query)
- Authentication handled by NextAuth v5
- UI components from shadcn/ui built on Radix UI
- Forms use react-hook-form with Zod validation

## Testing

### Backend Testing
- Uses pytest with Django integration (`backend/pytest.ini`)
- Test settings use SQLite in-memory (`backend/test_settings.py`)
- Shared fixtures in `backend/conftest.py`: `user`, `admin_user`, `faculty_user`, `authenticated_client`, `admin_client`
- Test markers: `unit`, `integration`, `api`, `db`, `external`, `astronomical`, `security`, `slow`

### Makefile Commands (from project root)
```bash
make dev             # Start local dev with file watching
make down            # Stop containers
make migrate         # Run Django migrations
make makemigrations  # Create new Django migrations
make test            # Run backend tests with pytest
make test-cov        # Run tests with coverage report
make shell-django    # Open shell in Django container
make shell-db        # Open PostgreSQL console
make logs            # View container logs
```

### CI/CD
- GitHub Actions run tests for Python 3.11-3.12 and Node 21+
- Backend tests require PostgreSQL service
- Frontend build verification

## Environment & Docker

### Environment Files
- `.env.example` — committed template with placeholder values
- `.env.local` — local dev secrets (gitignored, never committed)
- `.env.prod` — production secrets (gitignored, never committed)
- All services share a single root `.env.local` via Docker Compose `env_file`

### Migrations Workflow
- Migrations run automatically on container start (`migrate --noinput`)
- `makemigrations` is **never** run automatically — always create migrations intentionally:
  ```bash
  make makemigrations   # via Docker
  # or locally:
  cd backend && uv run python manage.py makemigrations
  ```
- Always review generated migration files before committing

### Docker Structure
- `docker-compose.local.yml` — local dev with file watching
- `docker-compose.prod.yml` — production with nginx
- Each service has `Dockerfile` (production) and `Dockerfile.local` (development)

## Important Notes

- User roles: `USER`, `FACULTY`, `ADMIN` (defined in `system.User.roles`)
- Astronomical calculations use astropy library
- Models use soft deletion via `deleted_at` field
- Docker setup includes PostgreSQL with health checks