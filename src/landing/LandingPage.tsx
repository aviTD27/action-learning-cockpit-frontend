import { Link } from 'react-router-dom'
import {
  GraduationCap, ClipboardList, CheckCircle2, Users, Bell, ShieldCheck,
  Building2, BookOpen, UploadCloud, ArrowRight,
} from 'lucide-react'
import './styles/landing.css'

const FEATURES = [
  { icon: Building2, title: 'Multi-university', text: 'Each university runs its own programmes, cohorts, lecturers and students in an isolated workspace.' },
  { icon: ClipboardList, title: 'Assignments', text: 'Lecturers create submissions with rules, deadlines and allowed file types for their cohorts.' },
  { icon: CheckCircle2, title: 'Grading & review', text: 'Grade with feedback, keep grades as drafts, then release them to students — Fail / Pass / Good / Distinction.' },
  { icon: Users, title: 'Student tracking', text: 'See cohort progress, who has submitted, and grading status at a glance.' },
  { icon: Bell, title: 'Notifications', text: 'Automated deadline reminders and notifications keep students on track.' },
  { icon: ShieldCheck, title: 'Role-based access', text: 'Platform Admin, Uni Admin, Lecturer and Student each see only what they should.' },
]

const STEPS = [
  { icon: Building2, title: 'Request access', text: 'A university submits a request from this page.' },
  { icon: ShieldCheck, title: 'Get approved', text: 'The platform team reviews and approves the request, creating the Uni Admin account.' },
  { icon: BookOpen, title: 'Build the structure', text: 'The Uni Admin sets up programmes, cohorts, lecturers and students.' },
  { icon: UploadCloud, title: 'Teach & learn', text: 'Lecturers set work and grade it; students submit and receive results.' },
]

export default function LandingPage() {
  return (
    <div className="lp">
      <header className="lp-nav">
        <div className="lp-brand">
          <GraduationCap size={22} /> <span>ALC</span>
          <small>Action Learning Cockpit</small>
        </div>
        <nav className="lp-nav-links">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <Link to="/login" className="lp-btn lp-btn-ghost">Login</Link>
          <Link to="/request-access" className="lp-btn lp-btn-primary">Request Access</Link>
        </nav>
      </header>

      <section className="lp-hero">
        <div className="lp-hero-inner">
          <span className="lp-pill">Multi-university learning platform</span>
          <h1>Run teaching, submissions and grading<br />for every cohort — in one place.</h1>
          <p>
            The Action Learning Cockpit is a multi-tenant LMS that lets universities manage
            programmes, cohorts, lecturers and students, with assignment management, grading
            and student tracking built in.
          </p>
          <div className="lp-hero-cta">
            <Link to="/request-access" className="lp-btn lp-btn-primary lp-btn-lg">
              Request Access <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="lp-btn lp-btn-outline lp-btn-lg">I already have an account</Link>
          </div>
          <p className="lp-hero-note">Universities request access; the platform team approves and sets up your admin account.</p>
        </div>
      </section>

      <section className="lp-section" id="features">
        <h2>Everything a programme needs</h2>
        <div className="lp-grid">
          {FEATURES.map(f => (
            <div className="lp-card" key={f.title}>
              <span className="lp-card-icon"><f.icon size={20} /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-section lp-section-alt" id="how">
        <h2>How it works</h2>
        <div className="lp-steps">
          {STEPS.map((s, i) => (
            <div className="lp-step" key={s.title}>
              <span className="lp-step-num">{i + 1}</span>
              <span className="lp-step-icon"><s.icon size={18} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lp-final">
        <h2>Bring your university onto the platform</h2>
        <p>Submit an access request and the platform team will get you set up.</p>
        <Link to="/request-access" className="lp-btn lp-btn-primary lp-btn-lg">Request Access <ArrowRight size={16} /></Link>
      </section>

      <footer className="lp-footer">
        <div className="lp-brand"><GraduationCap size={18} /> <span>ALC</span></div>
        <span>© {new Date().getFullYear()} Action Learning Cockpit</span>
        <Link to="/login">Login</Link>
      </footer>
    </div>
  )
}
