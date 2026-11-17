/**
 * API error handler middleware.
 * Standardizes error responses for API routes.
 */
export function handleApiError(error: any, defaultMessage: string = 'Internal server error'): Response {
  console.error('API Error:', error)

  const status = error instanceof Response
    ? error.status
    : error.statusCode ?? 500

  const message = error instanceof Response
    ? error.statusText
    : defaultMessage

  return new Response(
    JSON.stringify({
      success: false,
      message,
    }),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

/**
 * Check if response is an error response.
 */
export function isErrorResponse(response: Response): boolean {
  return response.status >= 400
}