/**
 * Single job endpoint.
 * GET: Fetch a single published job by slug.
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const supabase = await createSupabaseServerClient()

    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(errorResponse('Job not found', 'NOT_FOUND'), { status: 404 })
      }
      return NextResponse.json(errorResponse('Failed to fetch job', error.code || 'DB_ERROR'), { status: 500 })
    }

    await supabase.from('jobs').update({ views: (data?.views || 0) + 1 }).eq('id', data.id)

    return NextResponse.json(successResponse(data, 'Job fetched successfully'), { status: 200 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}