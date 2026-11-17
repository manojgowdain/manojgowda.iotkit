/**
 * Public Jobs API routes.
 * CRUD operations for job listings.
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
    const { searchParams } = new URL(request.url)
    let query = supabase.from('jobs').select('*').eq('is_published', true).eq('is_open', true)

    const orgType = searchParams.get('orgType')
    if (orgType && orgType !== 'all') query = query.eq('organization_type', orgType)
    const category = searchParams.get('category')
    if (category && category !== 'all') query = query.eq('job_category', category)
    const empType = searchParams.get('employmentType')
    if (empType && empType !== 'all') query = query.eq('employment_type', empType)
    const workMode = searchParams.get('workMode')
    if (workMode && workMode !== 'all') query = query.eq('work_mode', workMode)
    const location = searchParams.get('location')
    if (location) query = query.ilike('location_city', `%${location}%`)
    const featured = searchParams.get('featured')
    if (featured === 'true') query = query.eq('is_featured', true)
    const search = searchParams.get('search')
    if (search) query = query.ilike('title', `%${search}%`)
    const sort = searchParams.get('sort') || 'latest'
    if (sort === 'salary-asc') query = query.order('salary_min', { ascending: true, nullsFirst: true })
    else if (sort === 'salary-desc') query = query.order('salary_max', { ascending: false, nullsFirst: true })
    else if (sort === 'oldest') query = query.order('created_at', { ascending: true })
    else query = query.order('created_at', { ascending: false })

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const from = (page - 1) * limit
    query = query.range(from, from + limit - 1)

    const { data, error, count } = await query
    if (error) {
      return NextResponse.json(errorResponse('Failed to fetch jobs', error.code || 'DB_ERROR'), { status: 500 })
    }

    return NextResponse.json(successResponse({ jobs: data, pagination: { page, limit, total: count ?? 0, totalPages: Math.ceil((count ?? 0) / limit), hasMore: page * limit < (count ?? 0) } }, 'Jobs fetched successfully'), { status: 200 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const requiredFields = ['title', 'organizationName', 'jobCategory', 'role', 'shortDescription']
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(errorResponse(`Missing required fields: ${missingFields.join(', ')}`, 'VALIDATION_ERROR'), { status: 400 })
    }

    const supabase = await createSupabaseServerClient()

    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

    const { data: existing } = await supabase.from('jobs').select('id').eq('slug', slug).single()
    if (existing) {
      return NextResponse.json(errorResponse('A job with this title already exists.', 'DUPLICATE'), { status: 409 })
    }

    const jobData = {
      title: body.title, slug, status: 'PENDING', source: 'PUBLIC_SUBMISSION',
      submitted_by: body.contactName || 'Anonymous', submitted_by_email: body.contactEmail || null,
      organization_name: body.organizationName, organization_type: body.organizationType || null,
      organization_website: body.organizationWebsite || null, organization_logo: body.organizationLogo || null,
      organization_description: body.organizationDescription || null, organization_industry: body.organizationIndustry || null,
      organization_size: body.organizationSize || null, job_category: body.jobCategory,
      role: body.role, department: body.department || null, short_description: body.shortDescription,
      description: body.description || null, responsibilities: body.responsibilities || [],
      requirements: body.requirements || [], qualifications: body.qualifications || [],
      preferred_qualifications: body.preferredQualifications || [], skills: body.skills || [],
      benefits: body.benefits || [], employment_type: body.employmentType || null,
      work_mode: body.workMode || null, experience_min: body.experienceMin || null,
      experience_max: body.experienceMax || null, experience_level: body.experienceLevel || null,
      openings: body.numberOfOpenings || null, salary_min: body.salaryMin || null,
      salary_max: body.salaryMax || null, salary_currency: body.salaryCurrency || 'INR',
      salary_period: body.salaryPeriod || null, salary_disclosed: body.salaryDisclosed || false,
      location_country: body.locationCountry || null, location_state: body.locationState || null,
      location_city: body.locationCity || null, address: body.address || null,
      is_remote: body.isRemote || false, education_min_qualification: body.educationMinQualification || null,
      education_preferred_qualification: body.educationPreferredQualification || null,
      education_streams: body.educationStreams || [], application_url: body.applicationUrl || null,
      application_email: body.applicationEmail || null, application_method: body.applicationMethod || 'EXTERNAL_URL',
      application_instructions: body.applicationInstructions || null,
      application_deadline: body.applicationDeadline ? new Date(body.applicationDeadline).toISOString() : null,
      contact_name: body.contactName || null, contact_designation: body.contactDesignation || null,
      contact_email: body.contactEmail || null, contact_phone: body.contactPhone || null,
      contact_website: body.contactWebsite || null, is_published: false, is_open: true,
      is_featured: false, is_verified: false,
      metadata: { tags: body.tags || [], seo_title: body.seoTitle || null, seo_description: body.seoDescription || null },
      status_history: [{ status: 'PENDING', changed_at: new Date().toISOString(), changed_by: body.contactName || 'Anonymous', reason: 'Public submission pending review' }],
    }

    const { data, error } = await supabase.from('jobs').insert(jobData).select().single()

    if (error) {
      return NextResponse.json(errorResponse('Failed to submit job', error.code || 'DB_ERROR'), { status: 500 })
    }

    return NextResponse.json(successResponse(data, 'Job submitted successfully for review'), { status: 201 })
  } catch (error) {
    return NextResponse.json(errorResponse('Internal server error', 'INTERNAL_ERROR'), { status: 500 })
  }
}