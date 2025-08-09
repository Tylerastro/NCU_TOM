# Makefile for NCU TOM Backend Testing and Development
# Use with: make <target>

.PHONY: help test test-fast test-cov test-html test-parallel install-test clean lint format check

# Default target
help:
	@echo "Available targets:"
	@echo "  help         - Show this help message"
	@echo "  install-test - Install test dependencies"
	@echo "  test         - Run working tests (non-database, with coverage)"
	@echo "  test-fast    - Run working tests without coverage (faster)"
	@echo "  test-all     - Run ALL tests including database (may fail)"
	@echo "  test-cov     - Run tests with coverage report"
	@echo "  test-html    - Run tests and generate HTML coverage report"
	@echo "  test-parallel- Run tests in parallel"
	@echo "  test-unit    - Run only unit tests"
	@echo "  test-api     - Run only API tests" 
	@echo "  test-db      - Run only database tests (requires DB setup)"
	@echo "  test-integration - Run only integration tests"
	@echo "  test-failed  - Run only failed tests from last run"
	@echo "  lint         - Run code linting (flake8)"
	@echo "  format       - Format code (black + isort)"
	@echo "  check        - Run all code quality checks"
	@echo "  clean        - Clean up test artifacts"

# Install test dependencies
install-test:
	uv pip install -r requirements-test.txt

# Basic test run (all working tests)
test:
	uv run pytest -k "not django_db" --cov --tb=short

# Fast test run (no coverage, no database)
test-fast:
	uv run pytest -k "not django_db" --tb=short

# All tests (including database - may fail if DB not configured)
test-all:
	uv run pytest --cov --tb=short

# Test with coverage
test-cov:
	uv run pytest --cov --cov-report=term-missing

# Test with HTML coverage report
test-html:
	uv run pytest --cov --cov-report=html
	@echo "Coverage report generated in htmlcov/index.html"

# Run tests in parallel
test-parallel:
	uv run pytest -n auto --cov --tb=short

# Run specific test categories
test-unit:
	uv run pytest -m unit

test-api:
	uv run pytest -m api

test-db:
	uv run pytest -m db

test-integration:
	uv run pytest -m integration

test-astronomical:
	uv run pytest -m astronomical

test-external:
	uv run pytest -m external

test-security:
	uv run pytest -m security

# Run only failed tests
test-failed:
	uv run pytest --lf

# Run tests and generate reports
test-report:
	uv run pytest --cov --cov-report=html --cov-report=term --html=reports/pytest_report.html --self-contained-html

# Code quality
lint:
	uv run flake8 .

format:
	uv run black .
	uv run isort .

check: lint
	uv run black --check .
	uv run isort --check-only .

# Cleanup
clean:
	rm -rf .coverage
	rm -rf htmlcov/
	rm -rf reports/
	rm -rf .pytest_cache/
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete

# Development helpers
migrate:
	uv run python manage.py migrate

runserver:
	uv run python manage.py runserver

shell:
	uv run python manage.py shell

# Quick development workflow
dev: clean migrate test-fast runserver

# CI/CD workflow
ci: install-test check test-html