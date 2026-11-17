/**
 * Projects API routes.
 * CRUD operations for project management.
 * All routes require admin authentication.
 */

import { createSupabaseServerClient } from '../../../lib/supabase/server'
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

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .maybeSingle()

    if (adminError || !adminRecord) {
      return NextResponse.json(errorResponse('Unauthorized', 'AUTH_ERROR'), { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const publishedParam = searchParams.get('published')
    const isPublished = publishedParam === 'true'

    let query = supabase.from('projects').select('*')
    if (publishedParam !== null) query = query.eq('is_published', isPublished)

    const { data, error } = await query.order('is_featured', { ascending: false }).order('updated_at', { ascending: false })

    if (error) {
      return NextResponse.json(errorResponse('Failed to fetch projects', error.code || 'DB_ERROR'), { status: 500 })
    }

    return NextResponse.json(successResponse(data, 'Projects fetched successfully'), { status: 200 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, slug, summary, description, technologies, is_published, is_featured, seo_title, seo_description } = body

    if (!title || !slug) {
      return NextResponse.json(errorResponse('Title and slug are required', 'VALIDATION_ERROR'), { status: 400 })
    }

    const supabase = await createSupabaseServerClient()
    const { data: adminRecord, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
      .maybeSingle()

    if (adminError || !adminRecord) {
      return NextResponse.json(errorResponse('Unauthorized', 'AUTH_ERROR'), { status: 401 })
    }

    const { data: existing } = await supabase.from('projects').select('id').eq('slug', slug).single()
    if (existing) {
      return NextResponse.json(errorResponse('Slug already exists', 'VALIDATION_ERROR'), { status: 409 })
    }

    const { error } = await supabase.from('projects').insert({
      title, slug, summary, description, technologies: technologies || [],
      is_published: is_published ?? false, is_featured: is_featured ?? false,
      seo_title: seo_title || null, seo_description: seo_description || null,
    })

    if (error) {
      return NextResponse.json(errorResponse('Failed to create project', error.code || 'DB_ERROR'), { status: 500 })
    }

    return NextResponse.json(successResponse({ id: (await supabase.from('projects').select('id').order('id', { ascending: false }).limit(1).single()).data }, 'Project created successfully'), { status: 201 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}
