import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { submitRegistration, type RegistrationRequest } from '../api/registrations'
import './styles/landing.css'

const EMAIL_RE = /^\S+@\S+\.\S+$/
const URL_RE   = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}.*$/i
const DOMAIN_RE = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

type Errors = Partial<Record<keyof RegistrationRequest, string>>

const EMPTY: RegistrationRequest = {
  orgName: '', country: '', websiteUrl: '', domain: '',
  adminFirstName: '', adminLastName: '', adminContactEmail: '', adminPhone: '', description: '',
}

export default function RequestAccessPage() {
  const [form, setForm]         = useState<RegistrationRequest>(EMPTY)
  const [errors, setErrors]     = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]         = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const set = (k: keyof RegistrationRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = (): boolean => {
    const er: Errors = {}
    if (!form.orgName.trim())         er.orgName = 'Required'
    if (!form.country.trim())         er.country = 'Required'
    if (!form.websiteUrl.trim())      er.websiteUrl = 'Required'
    else if (!URL_RE.test(form.websiteUrl.trim())) er.websiteUrl = 'Enter a valid URL'
    if (!form.domain.trim())          er.domain = 'Required'
    else if (!DOMAIN_RE.test(form.domain.trim())) er.domain = 'Enter just the domain, e.g. epita.fr'
    if (!form.adminFirstName.trim())  er.adminFirstName = 'Required'
    if (!form.adminLastName.trim())   er.adminLastName = 'Required'
    if (!form.adminContactEmail.trim()) er.adminContactEmail = 'Required'
    else if (!EMAIL_RE.test(form.adminContactEmail.trim())) er.adminContactEmail = 'Enter a valid email'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await submitRegistration({
        ...form,
        orgName:            form.orgName.trim(),
        domain:             form.domain.trim().toLowerCase(),
        adminContactEmail:  form.adminContactEmail.trim().toLowerCase(),
      })
      setDone(true)
    } catch (err: any) {
      const msg = err.response?.data?.message ?? err.response?.data ?? 'Something went wrong. Please try again.'
      setSubmitError(typeof msg === 'string' ? msg : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="lp-form-page">
        <div className="lp-form-card lp-confirm">
          <CheckCircle2 size={42} className="lp-confirm-icon" />
          <h1>Request received</h1>
          <p>
            Thanks — your access request for <strong>{form.orgName}</strong> has been submitted.
            The platform team will review it and email <strong>{form.adminContactEmail}</strong> with the outcome.
          </p>
          <Link to="/" className="lp-btn lp-btn-primary">Back to home</Link>
        </div>
      </div>
    )
  }

  const field = (
    label: string,
    key: keyof RegistrationRequest,
    type = 'text',
    required = true,
    placeholder = '',
    hint?: string,
  ) => (
    <div className="lp-field">
      <label>{label}{required && ' *'}</label>
      <input
        className={`lp-input ${errors[key] ? 'error' : ''}`}
        type={type}
        value={form[key] ?? ''}
        onChange={set(key)}
        placeholder={placeholder}
      />
      {hint && !errors[key] && <span className="lp-field-hint">{hint}</span>}
      {errors[key] && <span className="lp-field-error">{errors[key]}</span>}
    </div>
  )

  const domainValue = form.domain.trim().toLowerCase()
  const lastName    = form.adminLastName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  const firstName   = form.adminFirstName.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
  const emailPreview = domainValue && lastName && firstName
    ? `${firstName}.${lastName}@${domainValue}`
    : null

  return (
    <div className="lp-form-page">
      <div className="lp-form-card">
        <Link to="/" className="lp-back"><ArrowLeft size={14} /> Back</Link>
        <div className="lp-brand lp-brand-center">
          <GraduationCap size={20} /> <span>ALC</span>
          <small>Action Learning Cockpit</small>
        </div>
        <h1 className="lp-form-title">Request platform access</h1>
        <p className="lp-form-sub">
          Tell us about your university. The platform team will review your request
          and set up your admin account on approval.
        </p>

        {submitError && <div className="lp-submit-error">{submitError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {field('University / organisation name', 'orgName')}

          <div className="lp-two-col">
            {field('Country', 'country')}
            <div className="lp-field">
              <label>University email domain *</label>
              <input
                className={`lp-input ${errors.domain ? 'error' : ''}`}
                type="text"
                value={form.domain}
                onChange={set('domain')}
                placeholder="e.g. epita.fr · cput.ac.za · google.com"
              />
              {!errors.domain && emailPreview && (
                <span className="lp-field-hint">
                  Your admin login will be: <strong>{emailPreview}</strong>
                </span>
              )}
              {errors.domain && <span className="lp-field-error">{errors.domain}</span>}
            </div>
          </div>

          {field('University website URL', 'websiteUrl', 'text', true, 'https://www.epita.fr')}

          <div className="lp-two-col">
            {field('Admin first name', 'adminFirstName')}
            {field('Admin last name',  'adminLastName')}
          </div>

          <div className="lp-two-col">
            {field('Admin contact email', 'adminContactEmail', 'email', true, '',
              'Approval and login credentials will be sent here.')}
            {field('Admin phone (optional)', 'adminPhone', 'text', false)}
          </div>

          <div className="lp-field">
            <label>Why do you want access? (optional)</label>
            <textarea
              className="lp-input"
              rows={3}
              value={form.description ?? ''}
              onChange={set('description')}
              placeholder="A short note about your programme and how you'll use the platform."
            />
          </div>

          <button className="lp-btn lp-btn-primary lp-btn-block" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit request'}
          </button>
        </form>

        <p className="lp-form-foot">Already approved? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  )
}
