/**
 * Standardized API response format.
 */
export type ApiResponse<T = any> = {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details?: unknown
  }
}

/**
 * Success response helper.
 */
export function successResponse<T>(data: T, message: string = 'Operation successful'): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  }
}

/**
 * Error response helper.
 */
export function errorResponse(message: string, code: string, details?: unknown): ApiResponse {
  return {
    success: false,
    message,
    error: {
      code,
      details,
    },
  }
}

/**
 * Handle Supabase errors and convert to API response.
 */
export function handleSupabaseError(error: any): { success: boolean; message: string; code: string } {
  console.error('Supabase Error:', error)

  // Handle specific error codes
  if (error?.status === 401) {
    return { success: false, message: 'Unauthorized', code: 'AUTH_ERROR' }
  }

  if (error?.status === 403) {
    return { success: false, message: 'Forbidden', code: 'AUTH_ERROR' }
  }

  if (error?.code === '23505') { // Unique violation
    return { success: false, message: 'Duplicate entry', code: 'UNIQUE_VIOLATION' }
  }

  if (error?.code === '23503') { // Foreign key violation
    return { success: false, message: 'Related record required', code: 'FOREIGN_KEY_VIOLATION' }
  }

  if (error?.code === '23504') { // Check violation
    return { success: false, message: 'Check constraint violated', code: 'CHECK_VIOLATION' }
  }

  // Generic error
  return {
    success: false,
    message: 'Something went wrong',
    code: 'INTERNAL_ERROR',
  }
}