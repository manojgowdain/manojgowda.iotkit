/**
 * Single admin job endpoint.
 * GET: Fetch a single job by ID.
 * PATCH: Update a job.
 * DELETE: Delete a job.
 */

import { createSupabaseServerClient } from '../../../../../lib/supabase/server'
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

async function isAdmin(supabase) {
  const { data: user } = await supabase.auth.getUser()
  if (!user?.user) return false
  const { data: adminRecord } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', user.user.id)
    .maybeSingle()
  return !!adminRecord
}

// GET - Fetch single job
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()
    if (!(await isAdmin(supabase))) {
      return NextResponse.json(errorResponse('Unauthorized', 'AUTH_ERROR'), { status: 401 })
    }

    const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(errorResponse('Job not found', 'NOT_FOUND'), { status: 404 })
      }
      return NextResponse.json(errorResponse('Failed to fetch job', error.code || 'DB_ERROR'), { status: 500 })
    }

    return NextResponse.json(successResponse(data, 'Job fetched successfully'), { status: 200 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}

// PATCH - Update job
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createSupabaseServerClient()

    if (!(await isAdmin(supabase))) {
      return NextResponse.json(errorResponse('Unauthorized', 'AUTH_ERROR'), { status: 401 })
    }

    const { error } = await supabase.from('jobs').update(body).eq('id', id)

    if (error) {
      return NextResponse.json(errorResponse('Failed to update job', error.code || 'DB_ERROR'), { status: 500 })
    }

    return NextResponse.json(successResponse(null, 'Job updated successfully'), { status: 200 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}

// DELETE - Delete job
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()
    if (!(await isAdmin(supabase))) {
      return NextResponse.json(errorResponse('Unauthorized', 'AUTH_ERROR'), { status: 401 })
    }

    const { error } = await supabase.from('jobs').delete().eq('id', id)

    if (error) {
      return NextResponse.json(errorResponse('Failed to delete job', error.code || 'DB_ERROR'), { status: 500 })
    }

    return NextResponse.json(successResponse(null, 'Job deleted successfully'), { status: 200 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}