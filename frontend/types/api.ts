// Centralized API response types and interfaces

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Standardized error interfaces matching DRF format
export interface ValidationErrors {
  [fieldName: string]: string[] | ValidationErrors;
}

export interface ApiError {
  detail?: ValidationErrors | string;
  code?: string;
}

// Legacy interface for gradual migration
export interface LegacyApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Auth related types
export interface TokenResponse {
  access: string;
  refresh: string;
  access_expiration?: Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

// Common request options
export interface RequestOptions {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Filter options for different endpoints
export interface TargetFilters extends RequestOptions {
  name?: string;
  tags?: number[];
}

export interface ObservationFilters extends RequestOptions {
  name?: string;
  tags?: number[];
  users?: number[];
  status?: number[];
}

// Status enums for better type safety
export enum ObservationStatus {
  PENDING = 1,
  SCHEDULED = 2,
  COMPLETED = 3,
  FAILED = 4,
  CANCELLED = 5
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  OBSERVER = 'observer'
}

// API endpoint configuration
export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  requiresAuth?: boolean;
}