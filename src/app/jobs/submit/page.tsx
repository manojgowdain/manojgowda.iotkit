/**
 * Job Submission Page
 * /jobs/submit - Public form to submit jobs for admin review
 * Server-side validation with client-side UX improvements
 */

"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface FormData {
  // Step 1: Basic Details
  title: string;
  organizationName: string;
  organizationType: string;
  jobCategory: string;
  role: string;
  shortDescription: string;

  // Step 2: Job Details
  employmentType: string;
  workMode: string;
  experienceMin: string;
  experienceMax: string;
  numberOfOpenings: string;
  skills: string;

  // Step 3: Salary & Location
  locationCountry: string;
  locationState: string;
  locationCity: string;
  isRemote: boolean;
  salaryMin: string;
  salaryMax: string;
  salaryDisclosed: boolean;
  applicationDeadline: string;

  // Step 4: Job Description
  description: string;
  responsibilities: string;
  requirements: string;
  benefits: string;

  // Step 5: Application Details
  applicationMethod: string;
  applicationUrl: string;
  applicationEmail: string;
  applicationInstructions: string;

  // Step 6: Contact Details
  contactName: string;
  contactDesignation: string;
  contactEmail: string;
  contactPhone: string;
  contactWebsite: string;
}

interface FormErrors {
  [key: string]: string;
}

interface FormState {
  step: number;
  isSubmitting: boolean;
  errors: FormErrors;
  submitStatus: "idle" | "success" | "error";
  submitMessage: string;
}

const STEPS = [
  { id: "basic", label: "Basic Details", fields: ["title", "organizationName", "organizationType", "jobCategory", "role", "shortDescription"] },
  { id: "details", label: "Job Details", fields: ["employmentType", "workMode", "experienceMin", "experienceMax", "numberOfOpenings", "skills"] },
  { id: "salary-location", label: "Salary & Location", fields: ["locationCountry", "locationState", "locationCity", "isRemote", "salaryMin", "salaryMax", "salaryDisclosed", "applicationDeadline"] },
  { id: "description", label: "Job Description", fields: ["description", "responsibilities", "requirements", "benefits"] },
  { id: "application", label: "Application Details", fields: ["applicationMethod", "applicationUrl", "applicationEmail", "applicationInstructions"] },
  { id: "contact", label: "Contact Details", fields: ["contactName", "contactDesignation", "contactEmail", "contactPhone", "contactWebsite"] },
];

const REQUIRED_FIELDS: (keyof FormData)[] = [
  "title", "organizationName", "jobCategory", "role", "shortDescription", "contactEmail"
];

const INITIAL_FORM_DATA: FormData = {
  title: "",
  organizationName: "",
  organizationType: "",
  jobCategory: "",
  role: "",
  shortDescription: "",
  employmentType: "",
  workMode: "",
  experienceMin: "",
  experienceMax: "",
  numberOfOpenings: "1",
  skills: "",
  locationCountry: "India",
  locationState: "",
  locationCity: "",
  isRemote: false,
  salaryMin: "",
  salaryMax: "",
  salaryDisclosed: false,
  applicationDeadline: "",
  description: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  applicationMethod: "EXTERNAL_URL",
  applicationUrl: "",
  applicationEmail: "",
  applicationInstructions: "",
  contactName: "",
  contactDesignation: "",
  contactEmail: "",
  contactPhone: "",
  contactWebsite: "",
};

export default function JobSubmitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [formState, setFormState] = useState<FormState>({
    step: 0,
    isSubmitting: false,
    errors: {},
    submitStatus: "idle",
    submitMessage: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    const isCheckbox = type === "checkbox";
    const newValue = isCheckbox ? (target as HTMLInputElement).checked : (value as string);
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field when user types
    if (formState.errors[name]) {
      setFormState(prev => {
        const newErrors = { ...prev.errors };
        delete newErrors[name];
        return { ...prev, errors: newErrors };
      });
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    const step = STEPS[stepIndex];
    const errors: FormErrors = {};

    step.fields.forEach((field: keyof FormData) => {
      const value = formData[field];
      const stringValue = typeof value === "string" ? value : "";
      if (REQUIRED_FIELDS.includes(field) && (!value || (typeof value === "string" && value.trim() === ""))) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1").trim()} is required`;
      }

      // Email validation
      if ((field === "contactEmail" || field === "applicationEmail") && stringValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) {
        errors[field] = "Please enter a valid email address";
      }

      // URL validation
      if ((field === "applicationUrl" || field === "contactWebsite") && stringValue && !/^https?:\/\/.+/.test(stringValue)) {
        errors[field] = "Please enter a valid URL starting with http:// or https://";
      }

      // Number validation
      if (["experienceMin", "experienceMax", "numberOfOpenings", "salaryMin", "salaryMax"].includes(field) && stringValue && isNaN(Number(stringValue))) {
        errors[field] = "Must be a valid number";
      }
    });

    // Salary range validation
    if (stepIndex === 2 && formData.salaryMin && formData.salaryMax) {
      if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
        errors.salaryMin = "Minimum salary cannot exceed maximum salary";
      }
    }

    // Experience range validation
    if (stepIndex === 1 && formData.experienceMin && formData.experienceMax) {
      if (Number(formData.experienceMin) > Number(formData.experienceMax)) {
        errors.experienceMin = "Minimum experience cannot exceed maximum experience";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      return false;
    }

    setFormState(prev => ({ ...prev, errors: {} }));
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all steps
    for (let i = 0; i < STEPS.length; i++) {
      if (!validateStep(i)) {
        setFormState(prev => ({ ...prev, step: i }));
        return;
      }
    }

    setFormState(prev => ({ ...prev, isSubmitting: true, submitStatus: "idle", submitMessage: "" }));

    try {
      const response = await fetch("/api/jobs/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          submitStatus: "success",
          submitMessage: result.message || "Job submitted successfully for review!",
        }));
        // Reset form after successful submission
        setTimeout(() => {
          setFormData(INITIAL_FORM_DATA);
          setFormState(prev => ({ ...prev, step: 0, submitStatus: "idle", submitMessage: "" }));
        }, 5000);
      } else {
        setFormState(prev => ({
          ...prev,
          isSubmitting: false,
          submitStatus: "error",
          submitMessage: result.message || "Failed to submit job. Please try again.",
          errors: result.error ? { submit: result.error } : {},
        }));
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submitStatus: "error",
        submitMessage: "Network error. Please check your connection and try again.",
      }));
    }
  };

  const nextStep = () => {
    if (validateStep(formState.step)) {
      setFormState(prev => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const prevStep = () => {
    setFormState(prev => ({ ...prev, step: prev.step - 1 }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    if (e.key === "Enter" && target.tagName !== "TEXTAREA" && target.tagName !== "BUTTON") {
      e.preventDefault();
      if (formState.step < STEPS.length - 1) {
        nextStep();
      } else if (formState.step === STEPS.length - 1) {
        handleSubmit(e as unknown as FormEvent);
      }
    }
  };

  const currentStep = STEPS[formState.step];
  const progress = ((formState.step + 1) / STEPS.length) * 100;

  if (formState.submitStatus === "success") {
    return (
      <main className="page-main section-wrap">
        <section className="job-submit-section section-wrap">
          <div className="section-heading">
            <Link className="button button-outline" href="/jobs">
              <ArrowLeft size={15} aria-hidden="true" /> Back to Jobs
            </Link>
            <p className="eyebrow">POST A JOB</p>
            <h1>Submit a <span>Job Opening.</span></h1>
          </div>

          <div className="success-state">
            <div className="success-icon">
              <CheckCircle size={64} aria-hidden="true" />
            </div>
            <h2>Job Submitted Successfully!</h2>
            <p>{formState.submitMessage}</p>
            <p className="success-note">Your job posting is now pending review. You&apos;ll receive a confirmation email shortly.</p>
            <div className="success-actions">
              <Link className="button button-primary" href="/jobs">
                Browse Jobs <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <button className="button button-outline" onClick={() => setFormState(prev => ({ ...prev, submitStatus: "idle", step: 0 }))}>
                Submit Another Job
              </button>
            </div>
          </div>

          <div className="submit-info">
            <div className="info-card">
              <AlertTriangle size={20} aria-hidden="true" />
              <div>
                <h3>Important Notes</h3>
                <ul>
                  <li>All submissions are reviewed by our admin team before publication.</li>
                  <li>Your job will appear with status &ldquo;Pending&rdquo; until approved.</li>
                  <li>You will receive a confirmation email upon submission.</li>
                  <li>Approved jobs typically appear within 2-3 business days.</li>
                  <li>Rejected jobs will not be published and you&apos;ll be notified with reasons.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-main section-wrap" onKeyDown={handleKeyDown}>
      <section className="job-submit-section section-wrap">
        <div className="section-heading">
          <Link className="button button-outline" href="/jobs">
            <ArrowLeft size={15} aria-hidden="true" /> Back to Jobs
          </Link>
          <p className="eyebrow">POST A JOB</p>
          <h1>Submit a <span>Job Opening.</span></h1>
          <p className="section-heading-note">Fill out the form below to submit a job for review. Approved jobs will appear on our website.</p>
        </div>

        <div className="job-submit-form-container">
          <form className="job-submit-form" onSubmit={handleSubmit}>
            <div className="form-progress">
              <div className="progress-steps">
                {STEPS.map((step, index) => (
                  <div key={step.id} className={`progress-step ${index < formState.step ? "completed" : index === formState.step ? "active" : ""}`}>
                    <span className="step-circle">{index + 1}</span>
                    <span className="step-label">{step.label}</span>
                  </div>
                ))}
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {formState.submitStatus === "error" && (
              <div className="form-error-banner">
                <XCircle size={20} aria-hidden="true" />
                <span>{formState.submitMessage}</span>
              </div>
            )}

            <div className="form-step" id={`step-${currentStep.id}`}>
              <div className="step-header">
                <span className="step-number">{formState.step + 1}</span>
                <span className="step-label">{currentStep.label}</span>
              </div>
              <div className="form-grid">
                {(currentStep.fields as (keyof FormData)[]).map(field => {
                  const isRequired = REQUIRED_FIELDS.includes(field);
                  const error = formState.errors[field];
                  return (
                    <div key={field} className={`form-field ${error ? "has-error" : ""} ${["shortDescription", "description", "responsibilities", "requirements", "benefits", "applicationInstructions"].includes(field) ? "full-width" : ""}`}>
                      <label htmlFor={field}>
                        {field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                        {isRequired && <span className="required" aria-hidden="true">*</span>}
                      </label>
                      {field === "organizationType" && (
                        <select id={field} name={field} value={String(formData[field])} onChange={handleChange}>
                          <option value="">Select type</option>
                          <option value="GOVERNMENT">Government</option>
                          <option value="PRIVATE">Private</option>
                          <option value="PSU">Public Sector Undertaking (PSU)</option>
                          <option value="CENTRAL_GOVERNMENT">Central Government</option>
                          <option value="STATE_GOVERNMENT">State Government</option>
                          <option value="BANKING">Banking</option>
                          <option value="RAILWAY">Railway</option>
                          <option value="DEFENCE">Defence</option>
                          <option value="TEACHING">Teaching</option>
                          <option value="INTERNSHIP">Internship</option>
                          <option value="APPRENTICESHIP">Apprenticeship</option>
                        </select>
                      )}
                      {field === "jobCategory" && (
                        <select id={field} name={field} value={String(formData[field])} onChange={handleChange}>
                          <option value="">Select category</option>
                          <option value="IT">IT / Software</option>
                          <option value="ENGINEERING">Engineering</option>
                          <option value="HEALTHCARE">Healthcare</option>
                          <option value="EDUCATION">Education</option>
                          <option value="FINANCE">Finance</option>
                          <option value="BANKING">Banking</option>
                          <option value="ADMINISTRATION">Administration</option>
                          <option value="MARKETING">Marketing</option>
                          <option value="SALES">Sales</option>
                          <option value="OTHER">Other</option>
                        </select>
                      )}
                      {field === "employmentType" && (
                        <select id={field} name={field} value={String(formData[field])} onChange={handleChange}>
                          <option value="">Select type</option>
                          <option value="FULL_TIME">Full-time</option>
                          <option value="PART_TIME">Part-time</option>
                          <option value="CONTRACT">Contract</option>
                          <option value="INTERNSHIP">Internship</option>
                          <option value="APPRENTICESHIP">Apprenticeship</option>
                          <option value="TEMPORARY">Temporary</option>
                        </select>
                      )}
                      {field === "workMode" && (
                        <select id={field} name={field} value={String(formData[field])} onChange={handleChange}>
                          <option value="">Select mode</option>
                          <option value="REMOTE">Remote</option>
                          <option value="ON_SITE">On-site</option>
                          <option value="HYBRID">Hybrid</option>
                        </select>
                      )}
                      {field === "applicationMethod" && (
                        <select id={field} name={field} value={String(formData[field])} onChange={handleChange}>
                          <option value="EXTERNAL_URL">External URL</option>
                          <option value="EMAIL">Email</option>
                        </select>
                      )}
                      {["shortDescription", "description", "responsibilities", "requirements", "benefits", "applicationInstructions"].includes(field) && (
                        <textarea
                          id={field}
                          name={field}
                          rows={field === "description" ? 6 : field === "shortDescription" ? 3 : 4}
                          placeholder={field === "shortDescription" ? "Brief summary of the job (max 300 characters)" :
                           field === "description" ? "Detailed description of the job role and responsibilities" :
                           field === "responsibilities" ? "• Design and develop web applications\n• Collaborate with cross-functional teams\n• Write clean, maintainable code" :
                           field === "requirements" ? "• Bachelor's degree in Computer Science\n• 2+ years of experience with React\n• Knowledge of REST APIs" :
                           field === "benefits" ? "• Health insurance\n• Flexible work hours\n• Professional development budget" :
                           "Instructions for applicants on how to apply"}
                          maxLength={field === "shortDescription" ? 300 : undefined}
                          value={String(formData[field])}
                          onChange={handleChange}
                        />
                      )}
                      {field === "isRemote" && (
                        <div className="form-field checkbox-row">
                          <input
                            type="checkbox"
                            id={field}
                            name={field}
                            checked={formData[field] as boolean}
                            onChange={handleChange}
                          />
                          <label htmlFor={field}>Remote Position</label>
                        </div>
                      )}
                      {field === "salaryDisclosed" && (
                        <div className="form-field checkbox-row">
                          <input
                            type="checkbox"
                            id={field}
                            name={field}
                            checked={formData[field] as boolean}
                            onChange={handleChange}
                          />
                          <label htmlFor={field}>Disclose Salary Range</label>
                        </div>
                      )}
                      {field === "applicationDeadline" && (
                        <input
                          type="date"
                          id={field}
                          name={field}
                          value={String(formData[field])}
                          onChange={handleChange}
                        />
                      )}
                      {field === "contactEmail" && (
                        <input
                          type="email"
                          id={field}
                          name={field}
                          placeholder="hr@company.com"
                          required
                          value={String(formData[field])}
                          onChange={handleChange}
                        />
                      )}
                      {field === "applicationEmail" && (
                        <input
                          type="email"
                          id={field}
                          name={field}
                          placeholder="hr@company.com"
                          value={String(formData[field])}
                          onChange={handleChange}
                        />
                      )}
                      {field === "applicationUrl" && (
                        <input
                          type="url"
                          id={field}
                          name={field}
                          placeholder="https://company.com/careers/apply"
                          value={String(formData[field])}
                          onChange={handleChange}
                        />
                      )}
                      {field === "contactWebsite" && (
                        <input
                          type="url"
                          id={field}
                          name={field}
                          placeholder="https://company.com"
                          value={String(formData[field])}
                          onChange={handleChange}
                        />
                      )}
                      {["experienceMin", "experienceMax", "numberOfOpenings", "salaryMin", "salaryMax"].includes(field) && (
                        <input
                          type="number"
                          id={field}
                          name={field}
                          min={field === "numberOfOpenings" ? 1 : 0}
                          max={field === "numberOfOpenings" ? 1000 : field === "experienceMin" || field === "experienceMax" ? 50 : undefined}
                          placeholder={field === "numberOfOpenings" ? "1" : field === "experienceMin" ? "0" : field === "experienceMax" ? "10" : field === "salaryMin" ? "e.g. 300000" : "e.g. 600000"}
                          value={String(formData[field])}
                          onChange={handleChange}
                        />
                      )}
                      {field === "locationCountry" && (
                        <input
                          type="text"
                          id={field}
                          name={field}
                          value={String(formData[field])}
                          onChange={handleChange}
                          readOnly
                        />
                      )}
                      {!["organizationType", "jobCategory", "employmentType", "workMode", "applicationMethod",
                        "isRemote", "salaryDisclosed", "shortDescription", "description", "responsibilities",
                        "requirements", "benefits", "applicationInstructions", "contactEmail",
                        "applicationEmail", "applicationUrl", "contactWebsite",
                        "experienceMin", "experienceMax", "numberOfOpenings", "salaryMin", "salaryMax",
                        "locationCountry", "applicationDeadline"].includes(field) && (
                        <input
                          type="text"
                          id={field}
                          name={field}
                          placeholder={field === "title" ? "e.g. Full Stack Developer" :
                           field === "organizationName" ? "e.g. Tech Solutions Pvt Ltd" :
                           field === "role" ? "e.g. Software Engineer" :
                           field === "skills" ? "e.g. React, Node.js, AWS, Docker" :
                           field === "locationState" ? "e.g. Karnataka" :
                           field === "locationCity" ? "e.g. Bangalore" :
                           field === "contactName" ? "Your name" :
                           field === "contactDesignation" ? "e.g. HR Manager" :
                           field === "contactPhone" ? "+91 98765 43210" :
                           ""}
                          maxLength={field === "title" ? 180 : field === "organizationName" ? 200 : field === "role" ? 180 : undefined}
                          value={String(formData[field])}
                          onChange={handleChange}
                        />
                      )}
                      {error && <span className="error-message">{error}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={prevStep}
                disabled={formState.step === 0 || formState.isSubmitting}
              >
                Previous
              </button>
              {formState.step < STEPS.length - 1 ? (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={nextStep}
                  disabled={formState.isSubmitting}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="button button-primary"
                  disabled={formState.isSubmitting}
                >
                  {formState.isSubmitting ? (
                    <>
                      <Loader2 size={16} className="spinner" aria-hidden="true" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Job for Review"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="submit-info">
          <div className="info-card">
            <AlertTriangle size={20} aria-hidden="true" />
            <div>
              <h3>Important Notes</h3>
              <ul>
                <li>All submissions are reviewed by our admin team before publication.</li>
                <li>Your job will appear with status &ldquo;Pending&rdquo; until approved.</li>
                <li>You will receive a confirmation email upon submission.</li>
                <li>Approved jobs typically appear within 2-3 business days.</li>
                <li>Rejected jobs will not be published and you&apos;ll be notified with reasons.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}