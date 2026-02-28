"""Tests for the dataproducts app: ETLLogs, LulinDataProduct, and public APIs."""

import pytest
from rest_framework import status


# ============================================================================
# Model Tests
# ============================================================================


@pytest.mark.django_db
class TestDataProductModels:
    def test_create_etl_log(self):
        from dataproducts.models import ETLLogs

        log = ETLLogs.objects.create(
            name="Test ETL",
            observatory=1,
            success=True,
            file_processed=5,
            row_processed=100,
        )
        assert log.pk is not None
        assert log.success is True

    def test_create_lulin_data_product(self, user, sample_target):
        from dataproducts.models import LulinDataProduct

        product = LulinDataProduct.objects.create(
            name="test_product",
            file_name="test.fits",
            target=sample_target,
            mjd=60000.0,
            mag=15.5,
            source_ra=10.6847,
            source_dec=41.2687,
            exposure_time=120.0,
            zp=25.0,
            FWHM=2.5,
            user=user,
        )
        assert product.pk is not None
        assert product.mjd == 60000.0


# ============================================================================
# Serializer Tests
# ============================================================================


@pytest.mark.django_db
class TestDataProductSerializers:
    def test_etl_logs_serializer_output(self):
        from dataproducts.models import ETLLogs
        from dataproducts.serializers import ETLLogsSerializer

        log = ETLLogs.objects.create(
            name="Nightly Run",
            observatory=1,
            success=True,
            file_processed=10,
            row_processed=200,
        )
        data = ETLLogsSerializer(log).data
        assert "name" in data
        assert "success" in data
        assert "created_at" in data

    def test_lulin_data_product_serializer_has_obs_date(self, user, sample_target):
        from dataproducts.models import LulinDataProduct
        from dataproducts.serializers import LulinDataProductSerializer

        product = LulinDataProduct.objects.create(
            name="obs_product",
            file_name="obs.fits",
            target=sample_target,
            mjd=60000.0,
            mag=14.0,
            source_ra=10.6847,
            source_dec=41.2687,
            exposure_time=60.0,
            zp=25.0,
            FWHM=1.8,
            user=user,
        )
        data = LulinDataProductSerializer(product).data
        assert "obs_date" in data
        assert data["obs_date"] is not None


# ============================================================================
# API Tests
# ============================================================================


@pytest.mark.django_db
class TestDataProductsAPI:
    def test_etl_logs_public(self, api_client):
        response = api_client.get("/api/logs/ETL/")
        assert response.status_code == status.HTTP_200_OK

    def test_lulin_target_data_pk_zero_public(self, api_client):
        response = api_client.get("/api/data-products/lulin/target/0/")
        assert response.status_code == status.HTTP_200_OK
