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
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(errorResponse('Error signing out', 'INTERNAL_ERROR'), { status: 500 })
    }

    const response = NextResponse.json(successResponse(null, 'Signed out successfully'), { status: 200 })
    response.cookies.set('sb:token', '', { maxAge: 0, path: '/' })
    return response
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}