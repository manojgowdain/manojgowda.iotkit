/**
 * Admin Jobs API routes.
 * CRUD operations for job management by admins.
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

export async function GET(request: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    if (!(await isAdmin(supabase))) {
      return NextResponse.json(errorResponse('Unauthorized', 'AUTH_ERROR'), { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const source = searchParams.get('source')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase.from('jobs').select('*', { count: 'exact' })

    if (status && status !== 'all') query = query.eq('status', status)
    if (source && source !== 'all') query = query.eq('source', source)
    if (search) query = query.ilike('title', `%${search}%`)

    query = query.order('created_at', { ascending: false })
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(errorResponse('Failed to fetch jobs', error.code || 'DB_ERROR'), { status: 500 })
    }

    return NextResponse.json(successResponse({ jobs: data, pagination: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit) } }, 'Jobs fetched successfully'), { status: 200 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createSupabaseServerClient()

    if (!(await isAdmin(supabase))) {
      return NextResponse.json(errorResponse('Unauthorized', 'AUTH_ERROR'), { status: 401 })
    }

    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

    const { error } = await supabase.from('jobs').insert({
      title: body.title, slug, status: body.status || 'DRAFT', source: 'ADMIN',
      submitted_by: body.submittedBy || null, organization_name: body.organizationName,
      organization_type: body.organizationType, job_category: body.jobCategory,
      role: body.role, department: body.department, short_description: body.shortDescription,
      description: body.description, responsibilities: body.responsibilities || [],
      requirements: body.requirements || [], qualifications: body.qualifications || [],
      skills: body.skills || [], benefits: body.benefits || [],
      employment_type: body.employmentType, work_mode: body.workMode,
      experience_min: body.experienceMin, experience_max: body.experienceMax,
      experience_level: body.experienceLevel, openings: body.numberOfOpenings,
      salary_min: body.salaryMin, salary_max: body.salaryMax,
      salary_currency: body.salaryCurrency || 'INR', salary_period: body.salaryPeriod,
      salary_disclosed: body.salaryDisclosed, location_country: body.locationCountry,
      location_state: body.locationState, location_city: body.locationCity,
      is_remote: body.isRemote, application_url: body.applicationUrl,
      application_email: body.applicationEmail,
      application_deadline: body.applicationDeadline ? new Date(body.applicationDeadline).toISOString() : null,
      contact_name: body.contactName, contact_email: body.contactEmail,
      contact_phone: body.contactPhone, is_published: body.status === 'PUBLISHED',
      is_open: body.isOpen !== false, is_featured: body.isFeatured, is_verified: body.isVerified,
      metadata: { tags: body.tags || [], seo_title: body.seoTitle, seo_description: body.seoDescription },
    })

    if (error) {
      return NextResponse.json(errorResponse('Failed to create job', error.code || 'DB_ERROR'), { status: 500 })
    }

    return NextResponse.json(successResponse(null, 'Job created successfully'), { status: 201 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}