/**
 * Posts API routes.
 * CRUD operations for blog post management.
 * All routes require admin authentication.
 */

import { createSupabaseServerClient } from '../../../lib/supabase/server'
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

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    // Check if user is admin
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

    const { searchParams } = new URL(request.url)
    const publishedParam = searchParams.get('published')
    const isPublished = publishedParam === 'true'

    let query = supabase.from('posts').select('*')

    if (publishedParam !== null) {
      query = query.eq('is_published', isPublished)
    }

    const { data, error } = await query.order('published_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        errorResponse('Failed to fetch posts', error.code || 'DB_ERROR'),
        { status: 500 }
      )
    }

    return NextResponse.json(
      successResponse(data, 'Posts fetched successfully'),
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json()
    const { title, slug, excerpt, body, is_published, cover_image_url, tags, seo_title, seo_description, published_at } = requestBody

    // Validate required fields
    if (!title || !slug || !body) {
      return NextResponse.json(
        errorResponse('Title, slug, and body are required', 'VALIDATION_ERROR'),
        { status: 400 }
      )
    }

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

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        errorResponse('Slug already exists', 'VALIDATION_ERROR'),
        { status: 409 }
      )
    }

    const { error } = await supabase.from('posts').insert({
      title,
      slug,
      excerpt,
      body,
      cover_image_url: cover_image_url || null,
      tags: tags || [],
      is_published: is_published ?? false,
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      published_at: published_at ? new Date(published_at).toISOString() : null,
    })

    if (error) {
      return NextResponse.json(
        errorResponse('Failed to create post', error.code || 'DB_ERROR'),
        { status: 500 }
      )
    }

    return NextResponse.json(
      successResponse(
        { id: (await supabase.from('posts').select('id').order('id', { ascending: false }).limit(1).single()).data },
        'Post created successfully'
      ),
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      errorResponse('Internal server error', 'INTERNAL_ERROR'),
      { status: 500 }
    )
  }
}
