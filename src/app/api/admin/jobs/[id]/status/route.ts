/**
 * Job status management endpoint.
 * PATCH: Update job status (approve, reject, publish, close, reopen).
 */

import { createSupabaseServerClient } from '../../../../../../lib/supabase/server'
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, reason } = body
    const supabase = await createSupabaseServerClient()

    if (!(await isAdmin(supabase))) {
      return NextResponse.json(errorResponse('Unauthorized', 'AUTH_ERROR'), { status: 401 })
    }

    const { data: currentJob } = await supabase.from('jobs').select('*').eq('id', id).single()

    if (!currentJob) {
      return NextResponse.json(errorResponse('Job not found', 'NOT_FOUND'), { status: 404 })
    }

    const statusHistoryEntry = {
      status,
      changed_at: new Date().toISOString(),
      changed_by: (await supabase.auth.getUser()).data?.user?.email || 'Admin',
      reason: reason || '',
    }

    const existingHistory = currentJob.status_history || []
    const newHistory = [...existingHistory, statusHistoryEntry]

    const updatePayload: any = { status, status_history: newHistory, updated_at: new Date().toISOString() }

    if (status === 'APPROVED') {
      updatePayload.reviewed_by = (await supabase.auth.getUser()).data?.user?.id || 'unknown'
      updatePayload.reviewed_at = new Date().toISOString()
      updatePayload.approval_reason = reason || null
    }

    if (status === 'PUBLISHED') {
      updatePayload.is_published = true
      updatePayload.published_at = new Date().toISOString()
    }

    if (status === 'CLOSED') {
      updatePayload.is_open = false
      updatePayload.closed_at = new Date().toISOString()
    }

    if (status === 'REOPEN') {
      updatePayload.is_open = true
      updatePayload.closed_at = null
    }

    if (status === 'REJECTED') {
      updatePayload.reviewed_by = (await supabase.auth.getUser()).data?.user?.id || 'unknown'
      updatePayload.reviewed_at = new Date().toISOString()
      updatePayload.approval_reason = reason || null
    }

    const { error } = await supabase.from('jobs').update(updatePayload).eq('id', id)

    if (error) {
      return NextResponse.json(errorResponse('Failed to update job status', error.code || 'DB_ERROR'), { status: 500 })
    }

    return NextResponse.json(successResponse(null, `Job status updated to ${status}`), { status: 200 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}