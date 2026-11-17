/*
 * Central API exports for the application.
 *
 * This file provides a clean interface for importing API utilities
 * and components throughout the application.
 */

// API response utilities
export type { ApiResponse } from './response'
export { errorResponse, successResponse, handleSupabaseError } from './response'

// Error handling utilities
export { handleApiError, isErrorResponse } from './error-handler'

// Supabase backend client
export { createSupabaseServerClient } from '../supabase/server'