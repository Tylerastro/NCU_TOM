# Testing Guide for NCU TOM Backend

This document provides comprehensive guidance for testing the NCU TOM backend using pytest.

## Quick Start

```bash
# Install test dependencies
uv pip install -r requirements-test.txt

# Run non-database tests (fast - always works)
uv run pytest -k "not django_db"

# Run unit tests only (fast - always works)  
uv run pytest -m unit

# Run all tests (requires database setup)
uv run pytest

# Run tests with coverage
uv run pytest --cov

# Or use the Makefile
make test-fast      # Run without coverage (faster)
make test-unit      # Run only unit tests
make test-html      # Run all tests and generate HTML coverage report
```

### Database Test Setup

Database tests require additional setup. For now, you can run non-database tests:

```bash
# Run tests that don't need database
uv run pytest -k "not django_db"

# Run specific test categories
uv run pytest -m unit          # Unit tests (no DB)
uv run pytest -m external      # External API mocking tests
uv run pytest -m astronomical  # Coordinate/astronomy tests
```

To enable database tests, ensure your database is running and properly configured in `test_settings.py`.

## Test Structure

### Directory Layout
```
backend/
├── pytest.ini              # Pytest configuration
├── conftest.py             # Global fixtures and configuration
├── requirements-test.txt   # Testing dependencies
├── Makefile               # Test automation commands
├── tests/                 # Pure pytest test files
│   ├── __init__.py
│   ├── test_example.py    # Example test patterns
│   ├── test_targets.py    # Target-related tests
│   ├── test_observations.py  # Observation tests
│   ├── test_users.py      # User/auth tests
│   └── ...
├── targets/
│   └── tests.py          # Legacy (cleared for pytest migration)
├── observations/
│   └── tests.py          # Legacy (cleared for pytest migration)
└── ...
```

### Test Categories (Markers)

We use pytest markers to categorize tests:

- `@pytest.mark.unit` - Fast, isolated unit tests
- `@pytest.mark.integration` - Tests involving multiple components
- `@pytest.mark.api` - API endpoint tests  
- `@pytest.mark.db` - Database-dependent tests
- `@pytest.mark.external` - Tests involving external services
- `@pytest.mark.astronomical` - Astronomical calculations and data
- `@pytest.mark.slow` - Slow-running tests
- `@pytest.mark.security` - Security and permission tests

## Writing Tests

### Basic Test Example
```python
import pytest

@pytest.mark.unit
def test_simple_calculation():
    """Example unit test."""
    result = 1 + 1
    assert result == 2
```

### Using Fixtures
```python
@pytest.mark.db
def test_user_creation(user):
    """Test using the user fixture from conftest.py."""
    assert user.username == 'testuser'
    assert user.is_active
```

### Parametrized Tests (Great for Astronomical Data)
```python
@pytest.mark.parametrize("ra,dec,expected_valid", [
    (0, 0, True),           # Valid center
    (180, 45, True),        # Valid coordinates
    (361, 45, False),       # Invalid RA > 360
    (180, 91, False),       # Invalid Dec > 90
])
@pytest.mark.astronomical
def test_coordinate_validation(ra, dec, expected_valid):
    # Your coordinate validation logic here
    valid = validate_coordinates(ra, dec)
    assert valid == expected_valid
```

### API Testing
```python
@pytest.mark.api
def test_create_target(authenticated_client):
    """Test target creation via API."""
    data = {
        'name': 'Test Target',
        'ra': 180.0,
        'dec': 45.0,
        'redshift': 0.5
    }
    response = authenticated_client.post('/api/targets/', data)
    assert response.status_code == 201
    assert response.data['name'] == 'Test Target'
```

### Mocking External Services
```python
@pytest.mark.external
def test_simbad_query(mocker):
    """Test SIMBAD service integration."""
    # Mock the external HTTP request
    mock_get = mocker.patch('requests.get')
    mock_response = mocker.Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {'object_type': 'Galaxy'}
    mock_get.return_value = mock_response
    
    # Test your service
    result = simbad_service.query('NGC 1234')
    assert result['object_type'] == 'Galaxy'
```

### Database Tests
```python
@pytest.mark.db
def test_target_relationships(user):
    """Test model relationships."""
    from targets.models import Target
    from helpers.models import Tags
    
    # Create test data
    target = Target.objects.create(
        user=user, name='Test Target', ra=180, dec=45
    )
    tag = Tags.objects.create(user=user, name='test-tag')
    target.tags.add(tag)
    
    # Verify relationships
    assert target.user == user
    assert target.tags.count() == 1
    assert tag.name == 'test-tag'
```

## Available Fixtures

### User Fixtures (from conftest.py)
- `user` - Regular user
- `admin_user` - Admin user  
- `faculty_user` - Faculty user

### Client Fixtures
- `client` - Django test client
- `api_client` - DRF API client
- `authenticated_client` - API client authenticated as regular user
- `admin_client` - API client authenticated as admin
- `faculty_client` - API client authenticated as faculty

### Authentication Fixtures
- `user_token` - Auth token for regular user
- `admin_token` - Auth token for admin

### Utility Fixtures
- `sample_coordinates` - Valid/invalid astronomical coordinates
- `sample_observation_dates` - Test dates for observations
- `mock_settings` - For overriding Django settings

## Running Tests

### Basic Commands
```bash
# Run all tests
uv run pytest

# Run with verbose output
uv run pytest -v

# Run specific test file
uv run pytest tests/test_targets.py

# Run specific test
uv run pytest tests/test_targets.py::test_target_creation

# Run tests matching pattern
uv run pytest -k "target"
```

### Using Markers
```bash
# Run only unit tests (fast)
uv run pytest -m unit

# Run only API tests
uv run pytest -m api

# Skip slow tests
uv run pytest -m "not slow"

# Run multiple markers
uv run pytest -m "unit or api"
```

### Coverage
```bash
# Run with coverage
uv run pytest --cov

# Coverage with missing line report
uv run pytest --cov --cov-report=term-missing

# Generate HTML coverage report
uv run pytest --cov --cov-report=html
# Open htmlcov/index.html in browser
```

### Parallel Execution
```bash
# Auto-detect CPU cores
uv run pytest -n auto

# Specify number of processes
uv run pytest -n 4
```

### Database Options
```bash
# Reuse database between runs (faster)
uv run pytest --reuse-db

# Create fresh database
uv run pytest --create-db

# Skip migrations (faster)
uv run pytest --nomigrations
```

### Debugging
```bash
# Stop at first failure
uv run pytest -x

# Run last failed tests only
uv run pytest --lf

# Run last failed, then all
uv run pytest --ff

# Detailed traceback
uv run pytest --tb=long

# Drop into debugger on failure
uv run pytest --pdb
```

## Using the Makefile

We provide a Makefile for common testing tasks:

```bash
# Show available commands
make help

# Install test dependencies  
make install-test

# Run tests (with coverage)
make test

# Run tests without coverage (faster)
make test-fast

# Generate HTML coverage report
make test-html

# Run tests in parallel
make test-parallel

# Run specific test categories
make test-unit
make test-api
make test-integration

# Code quality
make lint
make format
make check

# Cleanup
make clean
```

## Best Practices

### Test Organization
1. **One concept per test** - Each test should verify one specific behavior
2. **Clear test names** - Use descriptive names that explain what is being tested
3. **Use markers** - Categorize tests with appropriate markers
4. **Keep tests independent** - Each test should work in isolation

### Fixtures
1. **Use appropriate scope** - `function` (default), `class`, `module`, `session`
2. **Compose fixtures** - Build complex fixtures from simpler ones
3. **Avoid heavy setup** - Keep fixtures lightweight when possible

### Assertions
1. **Use specific assertions** - `assert x == 5` not `assert x`
2. **Test both positive and negative cases**
3. **Include helpful error messages** when needed

### Mocking
1. **Mock external dependencies** - Don't make real HTTP requests in tests
2. **Mock at the right level** - Mock the interface, not implementation details
3. **Verify mock calls** when behavior matters

### Performance  
1. **Use `--reuse-db`** for development
2. **Use `--nomigrations`** when migrations aren't needed
3. **Run unit tests frequently** - Save integration tests for CI
4. **Use parallel execution** for large test suites

## Continuous Integration

For CI/CD pipelines, use:

```bash
# Install dependencies and run full test suite with reports
make ci

# Or manually:
uv pip install -r requirements-test.txt
uv run pytest --cov --cov-report=html --cov-report=term --html=reports/pytest_report.html
```

## Troubleshooting

### Common Issues

1. **Import errors**: Make sure `DJANGO_SETTINGS_MODULE` is set in `pytest.ini`
2. **Database permission errors**: Ensure your test database user has creation rights
3. **Slow tests**: Use `--reuse-db` and `--nomigrations` for development
4. **External API failures**: Mock external services in tests

### Debugging Tests
```python
# Add print statements
def test_something():
    result = some_function()
    print(f"Result: {result}")  # Will show in pytest output with -s
    assert result == expected

# Use pytest debugger
def test_something():
    result = some_function() 
    import pdb; pdb.set_trace()  # Drops into debugger
    assert result == expected
```

### Getting Help
- Run `pytest --help` for all options
- Check `pytest.ini` for project-specific configuration  
- Review `conftest.py` for available fixtures
- Use `make help` for common commands

## Coverage Goals

- **Unit tests**: 95%+ coverage
- **Critical paths**: 100% coverage (user auth, target creation, observation scheduling)
- **Total project**: 90%+ coverage
- **Integration tests**: Cover major workflows end-to-end

## Migration from Django TestCase

If migrating from Django's `TestCase`:

1. **Replace class-based tests** with functions
2. **Convert setUp/tearDown** to fixtures
3. **Replace self.assert*** with plain assert
4. **Use pytest markers** instead of test method prefixes
5. **Leverage parametrization** for similar test cases