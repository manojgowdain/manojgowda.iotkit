/**
 * Single project endpoint.
 * GET: Fetch a single project by ID.
 * PATCH: Update a project (admin only).
 * DELETE: Delete a project (admin only).
 */

import { createSupabaseServerClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'

// Inline response helpers
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

// GET - Fetch single project
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          errorResponse('Project not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      return NextResponse.json(
        errorResponse('Failed to fetch project', error.code || 'DB_ERROR'),
        { status: 500 }
      )
    }

    return NextResponse.json(
      successResponse(data, 'Project fetched successfully'),
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}

// PATCH - Update project (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, slug, summary, description, technologies, is_published, is_featured, seo_title, seo_description } = body

    // Verify admin authentication
    const supabase = await createSupabaseServerClient()
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .maybeSingle()

    if (adminError || !adminRecord) {
      return NextResponse.json(
        errorResponse('Unauthorized', 'AUTH_ERROR'),
        { status: 401 }
      )
    }

    // Build update payload
    const payload: any = {}
    if (title !== undefined) payload.title = title
    if (slug !== undefined) {
      // Check if new slug conflicts
      const { data: existing } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single()
      if (existing) {
        return NextResponse.json(
          errorResponse('Slug already exists', 'VALIDATION_ERROR'),
          { status: 409 }
        )
      }
      payload.slug = slug
    }
    if (summary !== undefined) payload.summary = summary
    if (description !== undefined) payload.description = description
    if (technologies !== undefined) payload.technologies = technologies || []
    if (is_published !== undefined) payload.is_published = is_published
    if (is_featured !== undefined) payload.is_featured = is_featured
    if (seo_title !== undefined) payload.seo_title = seo_title || null
    if (seo_description !== undefined) payload.seo_description = seo_description || null

    const { error } = await supabase.from('projects').update(payload).eq('id', id)

    if (error) {
      return NextResponse.json(
        errorResponse('Failed to update project', error.code || 'DB_ERROR'),
        { status: 500 }
      )
    }

    // Fetch updated project
    const { data, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      return NextResponse.json(
        errorResponse('Project updated but failed to fetch', 'PARTIAL_ERROR'),
        { status: 200 }
      )
    }

    return NextResponse.json(
      successResponse(data, 'Project updated successfully'),
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}

// DELETE - Delete project (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Verify admin authentication
    const supabase = await createSupabaseServerClient()
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .maybeSingle()

    if (adminError || !adminRecord) {
      return NextResponse.json(
        errorResponse('Unauthorized', 'AUTH_ERROR'),
        { status: 401 }
      )
    }

    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) {
      return NextResponse.json(
        errorResponse('Failed to delete project', error.code || 'DB_ERROR'),
        { status: 500 }
      )
    }

    return NextResponse.json(
      successResponse(null, 'Project deleted successfully'),
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}