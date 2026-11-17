/**
 * Sign in endpoint.
 * Authenticates user with email and password.
 */
import { createSupabaseServerClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'

const successResponse = (data, message) => ({
  success: true,
  message,
  data
})

const errorResponse = (message, code) => ({
  success: false,
  message,
  error: { code }
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(errorResponse('Email and password are required', 'VALIDATION_ERROR'), { status: 400 })
    }

    const supabase = await createSupabaseServerClient()
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return NextResponse.json(errorResponse(error.message, error.code || 'AUTH_ERROR'), { status: 401 })
    }

    return NextResponse.json(successResponse(data, 'Signed in successfully'), { status: 200 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}