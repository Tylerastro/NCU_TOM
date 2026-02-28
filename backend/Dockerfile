FROM python:3.13-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV UV_PROJECT_ENVIRONMENT=/app/.venv

# Copy dependency files first for better caching
COPY pyproject.toml uv.lock ./

# Install dependencies using uv (frozen to ensure reproducibility)
RUN uv sync --frozen --no-dev --no-install-project

# Copy the rest of the application
COPY . .

# Sync again to install the project itself
RUN uv sync --frozen --no-dev

ENTRYPOINT ["/app/entrypoint.sh"]
