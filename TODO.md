# 🚀 Action Learning Cockpit (ALC)
> A multi-tenant SaaS platform for academic governance — centralizing submissions, automating validation, and providing AI-powered feedback across universities.

**Stack:** React (TypeScript) · Spring Boot (Maven) · PostgreSQL · AWS S3 · Python (FastAPI)

**Team:** DOORGA Trithikraj · NGUGI Janice · MEYE Jordy

---

## 📋 Project TODO — Full Development Checklist

> Check off tasks as you complete them. Work through phases in order — each phase depends on the previous one.

---

## ⚙️ Phase 0 — Environment & Project Setup

### Git & Repository
- [ ] Create a `.gitignore` file covering Java, Node, Python, and IDE files
- [ ] Add a `README.md` with project description and setup instructions
- [ ] Define branch strategy in the wiki: `main`, `dev`, `feature/*`, `fix/*`
- [ ] Set up branch protection rules on `main` (require PR + 1 review before merge)
- [ ] Create a GitHub Project board with columns: Backlog → In Progress → Review → Done
- [ ] Create GitHub issue labels: `frontend`, `backend`, `ai`, `devops`, `security`, `research`, `bug`

### Monorepo Structure
- [ ] Create top-level folders: `/frontend`, `/backend`, `/ai-service`, `/infra`, `/docs`
- [ ] Add a root-level `docker-compose.yml` for running all services locally
- [ ] Add a root-level `Makefile` with shortcuts: `make dev`, `make test`, `make build`

### Frontend Setup (React + TypeScript)
- [ ] Scaffold frontend with `npx create-react-app frontend --template typescript`
- [ ] Install React Router: `npm install react-router-dom`
- [ ] Install Axios for HTTP requests: `npm install axios`
- [ ] Install a UI component library (e.g. shadcn/ui or MUI): follow library setup guide
- [ ] Install React Query for server state management: `npm install @tanstack/react-query`
- [ ] Install a charting library for dashboards: `npm install recharts`
- [ ] Set up environment variable file `.env` with `REACT_APP_API_BASE_URL`
- [ ] Configure absolute imports in `tsconfig.json` using `baseUrl: "src"`
- [ ] Set up ESLint + Prettier with TypeScript rules
- [ ] Create `/src/api/`, `/src/components/`, `/src/pages/`, `/src/hooks/`, `/src/types/` folder structure
- [ ] Add a global `axios` instance in `/src/api/axiosClient.ts` with base URL and interceptors

### Backend Setup (Spring Boot + Maven)
- [ ] Generate Spring Boot project at `start.spring.io` with dependencies: Web, JPA, Security, Validation, PostgreSQL Driver, Lombok, Actuator
- [ ] Place generated project in `/backend` folder
- [ ] Verify project builds successfully: `mvn clean install`
- [ ] Configure `application.yml` with placeholders for DB URL, JWT secret, AWS keys
- [ ] Add `application-dev.yml` and `application-prod.yml` profiles
- [ ] Create package structure: `controller`, `service`, `repository`, `model`, `dto`, `config`, `security`, `exception`
- [ ] Add Maven wrapper (`mvnw`) so the project builds without a global Maven install
- [ ] Install Lombok and verify IDE annotation processing is enabled

### AI Service Setup (Python + FastAPI)
- [ ] Create `/ai-service` folder and initialize with `python -m venv venv`
- [ ] Create `requirements.txt` with: `fastapi`, `uvicorn`, `pydantic`, `python-multipart`, `python-docx`, `PyMuPDF`, `transformers`, `torch`, `scikit-learn`
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Create project structure: `/routers`, `/services`, `/schemas`, `/models`
- [ ] Create `main.py` with a root FastAPI app and a `/health` endpoint returning `{"status": "ok"}`
- [ ] Verify FastAPI runs: `uvicorn main:app --reload`
- [ ] Add `.env` file for Python service with `SPRING_GATEWAY_URL`

### Database Setup (PostgreSQL)
- [ ] Install PostgreSQL locally or run it via Docker: `docker run -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres`
- [ ] Create database: `alc_db`
- [ ] Create a dedicated database user with limited privileges: `alc_user`
- [ ] Add Flyway Maven dependency to `pom.xml` for database migrations
- [ ] Create `/backend/src/main/resources/db/migration/` folder for Flyway SQL scripts
- [ ] Test that Spring Boot connects to PostgreSQL on startup (check logs for Hibernate dialect)

### Docker & Local Dev
- [ ] Write `Dockerfile` for the Spring Boot backend (multi-stage: build with Maven, run with JRE)
- [ ] Write `Dockerfile` for the FastAPI AI service
- [ ] Write `Dockerfile` for the React frontend (build with Node, serve with nginx)
- [ ] Configure `docker-compose.yml` to start: `postgres`, `backend`, `ai-service`, `frontend`
- [ ] Test that `docker-compose up` starts all four services without errors
- [ ] Add a `docker-compose.override.yml` for local dev with volume mounts for hot reload

### AWS Setup
- [ ] Create an AWS account or use existing one
- [ ] Create an IAM user for the project with programmatic access only
- [ ] Attach a policy to the IAM user allowing only `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` on the project bucket
- [ ] Create an S3 bucket named `alc-documents-dev` in your chosen region
- [ ] Enable versioning on the S3 bucket
- [ ] Add a lifecycle policy to delete incomplete multipart uploads after 7 days
- [ ] Block all public access on the S3 bucket (files accessed only via pre-signed URLs)
- [ ] Store AWS credentials in `.env` — never commit them to git (verify `.gitignore` covers `.env`)

### CI/CD Pipeline (GitHub Actions)
- [ ] Create `.github/workflows/backend.yml`: runs `mvn test` on every push to `dev` and `main`
- [ ] Create `.github/workflows/frontend.yml`: runs `npm run build` and `npm test` on push
- [ ] Create `.github/workflows/ai-service.yml`: runs `pytest` on push
- [ ] Add GitHub Secrets for: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `DB_URL`, `JWT_SECRET`

---

## 📝 Phase 1 — Requirements & Design

### Stakeholder Research
- [ ] Write a list of 10 questions to ask students about their pain points with current tools
- [ ] Write a list of 10 questions to ask academic advisors about manual admin tasks
- [ ] Conduct at least 3 student interviews and document findings in `/docs/research/student-interviews.md`
- [ ] Conduct at least 2 advisor interviews and document findings in `/docs/research/advisor-interviews.md`
- [ ] Summarize pain points into a ranked list in `/docs/research/pain-points.md`

### Submission Rules Definition
- [ ] Document allowed file types: PDF, DOCX only
- [ ] Document file naming convention format (e.g. `LASTNAME_StudentID_Stage_v1.pdf`)
- [ ] Document word count rules per AL stage: minimum and maximum per stage
- [ ] Document required section headings per stage (Problem, Action, Reflection, Learning)
- [ ] Store all rules in `/docs/requirements/validation-rules.md`

### User Roles & Permissions
- [ ] List all user roles: Student, Lecturer, Academic Advisor, Tenant Admin, Super Admin
- [ ] Create a permission matrix table: rows = roles, columns = actions (view, submit, review, approve, configure, manage tenants)
- [ ] Define what data each role can see: own data only vs cohort data vs all tenants
- [ ] Document the permission matrix in `/docs/requirements/rbac-matrix.md`

### Wireframes
- [ ] Sketch the Student Dashboard layout: AL stage tracker, deadline countdown, recent submission status
- [ ] Sketch the Submission Form: file upload zone, validation result panel, stage selector
- [ ] Sketch the Faculty/Advisor Dashboard: cohort submission table, compliance rate, pending reviews
- [ ] Sketch the AI Feedback Panel: per-criterion scores, specific improvement suggestions
- [ ] Sketch the Admin Console: tenant list, tenant settings form, cohort management
- [ ] Sketch the Analytics Dashboard: charts for on-time rate, quality score, cross-institution benchmarks
- [ ] Upload all wireframes as images to `/docs/wireframes/`

### API Contract
- [ ] List all REST endpoints grouped by resource: `/auth`, `/users`, `/tenants`, `/cohorts`, `/submissions`, `/analytics`
- [ ] For each endpoint define: HTTP method, path, request body shape, response shape, required role
- [ ] Define standard error response format: `{ "code": "...", "message": "...", "details": {} }`
- [ ] Save the API contract in `/docs/requirements/api-contract.md`

### Architecture Decision Records
- [ ] Write ADR for: shared-schema multi-tenancy (tenant_id column) vs schema-per-tenant
- [ ] Write ADR for: React vs Angular (document final choice and why)
- [ ] Write ADR for: JWT stateless auth vs session-based auth
- [ ] Write ADR for: FastAPI standalone service vs embedding Python in Spring Boot via subprocess
- [ ] Save all ADRs in `/docs/adr/`

---

## 🔬 Phase 2 — Research & Architecture

### Literature Review
- [ ] Write a section on multi-tenant SaaS architecture patterns (shared, hybrid, silo)
- [ ] Write a section comparing existing academic platforms: Moodle, Turnitin, Canvas — identify gaps
- [ ] Write a section on microservices vs monolith — justify microservice choice for this project
- [ ] Write a section on NLP for educational text: reflection quality, structure detection, semantic scoring
- [ ] Write a section on learning analytics dashboard design principles
- [ ] Compile full literature review in `/docs/literature-review.md` with references

### NLP Research
- [ ] Identify and compare 3 pre-trained models for text quality scoring (e.g. BERT, RoBERTa, sentence-transformers)
- [ ] Test each model locally on a sample student reflection text
- [ ] Document inference time, accuracy, and resource usage for each model
- [ ] Choose a final model and document the decision in an ADR
- [ ] Research document parsing: compare `python-docx` for DOCX and `PyMuPDF` for PDF — test on sample files
- [ ] Research structure detection approaches: regex on headings vs ML-based classifier

### System Architecture
- [ ] Draw the full system architecture diagram: React → Spring Boot → PostgreSQL, FastAPI, S3, AWS
- [ ] Define all service-to-service communication: REST endpoints between Spring Boot and FastAPI
- [ ] Define the multi-tenant data schema: all tables with `tenant_id` column, indexes, foreign keys
- [ ] Draw the database entity-relationship diagram (ERD) for all tables
- [ ] Define the S3 folder structure: `/{tenant_id}/{student_id}/{stage}/{filename}`
- [ ] Save diagrams in `/docs/architecture/`

### Database Schema Design
- [ ] Design `tenants` table: id, name, subdomain, custom_rules (JSONB), created_at
- [ ] Design `users` table: id, tenant_id, email, password_hash, role, name, created_at
- [ ] Design `cohorts` table: id, tenant_id, name, lecturer_id, academic_year
- [ ] Design `cohort_students` join table: cohort_id, student_id
- [ ] Design `submissions` table: id, tenant_id, student_id, cohort_id, stage, s3_key, s3_version, status, submitted_at
- [ ] Design `validation_results` table: submission_id, rule_name, passed, message
- [ ] Design `ai_feedback` table: submission_id, criterion, score, suggestion, generated_at
- [ ] Design `milestones` table: cohort_id, stage, deadline
- [ ] Design `notifications` table: user_id, type, message, read, created_at
- [ ] Write all schema designs in `/docs/architecture/database-schema.md`

---

## 🔧 Phase 3 — Core Backend & Authentication

### Multi-Tenancy Implementation (Spring Boot)
- [ ] Create `Tenant` entity with all fields from the schema design
- [ ] Create `TenantRepository` extending `JpaRepository<Tenant, UUID>`
- [ ] Create a `TenantContext` class using `ThreadLocal<String>` to hold current tenant ID per request
- [ ] Create a `TenantFilter` (servlet filter) that extracts `tenant_id` from JWT and sets it in `TenantContext`
- [ ] Implement a `TenantAwareRepository` base class that automatically applies `WHERE tenant_id = ?` to all queries
- [ ] Write unit test: verify that a request with tenant A cannot retrieve data belonging to tenant B

### Flyway Database Migrations
- [ ] Create migration `V1__create_tenants_table.sql`
- [ ] Create migration `V2__create_users_table.sql`
- [ ] Create migration `V3__create_cohorts_and_cohort_students.sql`
- [ ] Create migration `V4__create_submissions_table.sql`
- [ ] Create migration `V5__create_validation_results_table.sql`
- [ ] Create migration `V6__create_ai_feedback_table.sql`
- [ ] Create migration `V7__create_milestones_table.sql`
- [ ] Create migration `V8__create_notifications_table.sql`
- [ ] Run all migrations and verify schema in PostgreSQL using a DB client (e.g. DBeaver)

### Authentication (JWT + Spring Security)
- [ ] Add `jjwt` library to `pom.xml` for JWT creation and validation
- [ ] Create `JwtService` with methods: `generateToken(user)`, `validateToken(token)`, `extractClaims(token)`
- [ ] Include `tenant_id` and `role` as custom claims in the JWT payload
- [ ] Create `JwtAuthFilter` extending `OncePerRequestFilter` to validate JWT on each request
- [ ] Configure `SecurityFilterChain` in `SecurityConfig`: permit `/auth/**`, require auth for everything else
- [ ] Create `AuthController` with `POST /auth/register` endpoint
- [ ] Create `AuthController` with `POST /auth/login` endpoint returning JWT
- [ ] Create `AuthController` with `POST /auth/refresh` endpoint for token refresh
- [ ] Hash passwords using `BCryptPasswordEncoder` — never store plain text passwords
- [ ] Write integration test for register → login → access protected endpoint flow

### RBAC (Role-Based Access Control)
- [ ] Create `Role` enum: `STUDENT`, `LECTURER`, `ADVISOR`, `TENANT_ADMIN`, `SUPER_ADMIN`
- [ ] Annotate each controller method with `@PreAuthorize("hasRole('...')")` per the permission matrix
- [ ] Create a `GlobalExceptionHandler` returning `403 Forbidden` with a clear message when role check fails
- [ ] Write unit tests for each role: verify a STUDENT cannot call advisor-only endpoints

### User Management Endpoints
- [ ] `GET /users/me` — return current user's profile
- [ ] `PUT /users/me` — update current user's name and profile
- [ ] `GET /users` — list all users in the tenant (TENANT_ADMIN only)
- [ ] `POST /users/invite` — invite a user by email to the tenant (TENANT_ADMIN only)
- [ ] `DELETE /users/{id}` — deactivate a user (TENANT_ADMIN only)
- [ ] Write unit + integration tests for each endpoint

### Tenant Management Endpoints
- [ ] `POST /tenants` — create a new tenant with name and subdomain (SUPER_ADMIN only)
- [ ] `GET /tenants` — list all tenants (SUPER_ADMIN only)
- [ ] `GET /tenants/{id}` — get a single tenant's settings
- [ ] `PUT /tenants/{id}/rules` — update validation rules for a tenant (TENANT_ADMIN only)
- [ ] Write unit + integration tests for each endpoint

### AWS S3 Integration (Spring Boot)
- [ ] Add `aws-java-sdk-s3` dependency to `pom.xml`
- [ ] Create `S3Config` bean with `AmazonS3` client configured from environment variables
- [ ] Create `S3Service` with method `generatePresignedUploadUrl(tenantId, studentId, stage, filename)` returning a pre-signed PUT URL valid for 15 minutes
- [ ] Create `S3Service` method `generatePresignedDownloadUrl(s3Key)` returning a pre-signed GET URL valid for 5 minutes
- [ ] Create `S3Service` method `deleteFile(s3Key)` for removing rejected submissions
- [ ] Store the returned S3 key and version ID in the `submissions` table after each upload
- [ ] Write unit tests for S3Service with mocked `AmazonS3` client

### Cohort Management Endpoints
- [ ] `POST /cohorts` — create a cohort (LECTURER only)
- [ ] `GET /cohorts` — list cohorts for the current tenant
- [ ] `POST /cohorts/{id}/students` — add a student to a cohort
- [ ] `DELETE /cohorts/{id}/students/{studentId}` — remove a student from a cohort
- [ ] `GET /cohorts/{id}/students` — list students in a cohort
- [ ] Write unit + integration tests for each endpoint

---

## 🛡️ Phase 4 — Smart-Gate Submission Validator & Prototype

### Smart-Gate (Spring Boot — Pre-Upload Validation)
- [ ] Create `ValidationService` in Spring Boot
- [ ] Implement rule: check file extension is `.pdf` or `.docx` — reject anything else
- [ ] Implement rule: check filename matches the tenant's configured naming pattern (regex from tenant rules)
- [ ] Create `POST /submissions/validate-metadata` endpoint that checks extension + filename before issuing S3 pre-signed URL
- [ ] Only return a pre-signed URL if metadata validation passes

### Smart-Gate (Python FastAPI — Document Content Validation)
- [ ] Create `/routers/validation.py` in the FastAPI service
- [ ] Create `POST /validate/document` endpoint that accepts a document (fetched from S3 by key)
- [ ] Implement DOCX text extraction using `python-docx`
- [ ] Implement PDF text extraction using `PyMuPDF`
- [ ] Implement word count check: extract full text, count words, compare to tenant min/max rules
- [ ] Implement section presence check: search extracted text for required headings using regex (case-insensitive)
- [ ] Return a structured JSON response: `{ "passed": bool, "results": [{ "rule": "...", "passed": bool, "message": "..." }] }`
- [ ] Write unit tests for each validation rule with sample DOCX and PDF files

### Submission Flow (Spring Boot)
- [ ] Create `Submission` entity and `SubmissionRepository`
- [ ] Create `POST /submissions/request-upload` endpoint: runs metadata validation → generates S3 pre-signed URL → creates a PENDING submission record
- [ ] Create `POST /submissions/{id}/confirm` endpoint: called by frontend after S3 upload — triggers async FastAPI document validation
- [ ] Create `GET /submissions` endpoint: list submissions for the current student (filtered by tenant)
- [ ] Create `GET /submissions/{id}` endpoint: get full submission detail including validation results
- [ ] Create `GET /cohorts/{id}/submissions` endpoint: list all submissions in a cohort (LECTURER/ADVISOR only)
- [ ] Implement async call from Spring Boot to FastAPI `/validate/document` using `WebClient`
- [ ] Store validation results in `validation_results` table after FastAPI responds
- [ ] Update submission status: `PENDING` → `COMPLIANT` or `NON_COMPLIANT` based on validation results
- [ ] Write integration test for the full submission + validation flow

### Frontend — Auth Screens
- [ ] Create `/pages/LoginPage.tsx` with email + password form
- [ ] Create `/pages/RegisterPage.tsx` with name, email, password form
- [ ] On login, store JWT in memory (React state + context) — never in `localStorage`
- [ ] Create `AuthContext.tsx` providing `user`, `login()`, `logout()` to the whole app
- [ ] Create a `PrivateRoute` component that redirects unauthenticated users to `/login`
- [ ] Implement silent token refresh using a refresh token stored in an HTTP-only cookie
- [ ] Add axios request interceptor to attach `Authorization: Bearer <token>` header to every request
- [ ] Add axios response interceptor to handle `401 Unauthorized` by redirecting to login

### Frontend — Student Dashboard
- [ ] Create `/pages/student/DashboardPage.tsx`
- [ ] Display the AL cycle stage tracker: four steps (Problem → Action → Reflection → Learning) with current stage highlighted
- [ ] Display a deadline countdown card for the current stage
- [ ] Display a list of past submissions with status badges (Pending, Compliant, Non-Compliant, Approved)
- [ ] Display the most recent validation result summary inline

### Frontend — Submission Form
- [ ] Create `/pages/student/SubmitPage.tsx`
- [ ] Build a drag-and-drop file upload zone using `react-dropzone` or native HTML drag events
- [ ] On file select, run client-side pre-checks: file extension and file size (max 10MB warning)
- [ ] On submit, call `POST /submissions/request-upload` to get the S3 pre-signed URL
- [ ] Upload the file directly to S3 using the pre-signed URL via `axios.put()`
- [ ] After S3 upload succeeds, call `POST /submissions/{id}/confirm`
- [ ] Poll `GET /submissions/{id}` every 3 seconds until status is no longer PENDING
- [ ] Display the validation result panel: green check or red cross per rule with explanation text
- [ ] Disable the submit button and show a spinner while validation is in progress

### Frontend — Faculty Dashboard (Basic)
- [ ] Create `/pages/faculty/DashboardPage.tsx`
- [ ] Display a table of all submissions in the lecturer's cohort with columns: Student Name, Stage, Submitted At, Status
- [ ] Add a filter bar: filter by stage, filter by status, search by student name
- [ ] Add a compliance rate summary card: "X of Y submissions are compliant"

---

## 🤖 Phase 5 — Full AL Cycle, AI Feedback & Analytics

### Action Learning Cycle Tracker (Backend)
- [ ] Add `current_stage` and `stage_status` columns to the `submissions` or a new `al_progress` table
- [ ] Create `POST /al-progress/{studentId}/advance` endpoint: move student to next stage (ADVISOR only, after approval)
- [ ] Create stage-locking logic: a student cannot submit to stage N+1 until stage N is in APPROVED status
- [ ] Create `GET /al-progress/{studentId}` endpoint: return current stage and status for the student
- [ ] Write unit tests for stage-locking logic with boundary cases

### AI Reflection Quality Scoring (Python FastAPI)
- [ ] Create `/routers/analysis.py` in FastAPI
- [ ] Load a sentence-transformer model (e.g. `all-MiniLM-L6-v2`) at service startup
- [ ] Implement `POST /analysis/reflection-quality` endpoint accepting a text body
- [ ] Score the reflection on 4 criteria: Depth, Coherence, Evidence of Learning, Actionability (0–10 each)
- [ ] Implement scoring logic using cosine similarity between the student's text and ideal-response embeddings per criterion
- [ ] Generate a plain-English suggestion for any criterion scoring below 6: e.g. "Your reflection does not describe what you would do differently next time. Try adding a section on future action."
- [ ] Return: `{ "overall_score": float, "criteria": [{ "name": "...", "score": float, "suggestion": "..." }] }`
- [ ] Write unit tests with sample reflections — verify low-quality text scores below 5, high-quality above 7

### AI Feedback Integration (Spring Boot)
- [ ] After a submission is confirmed and validated as COMPLIANT, call FastAPI `/analysis/reflection-quality` via WebClient
- [ ] Store results in `ai_feedback` table linked to the submission
- [ ] Create `GET /submissions/{id}/feedback` endpoint returning the stored AI feedback
- [ ] Write integration test for the full flow: submit → validate → AI score → store feedback

### Frontend — AI Feedback Panel
- [ ] Create `/components/AIFeedbackPanel.tsx`
- [ ] Display overall score with a circular progress indicator
- [ ] Display each criterion as a card with: criterion name, score bar (0–10), and suggestion text
- [ ] Highlight criteria scoring below 6 in amber, below 4 in red
- [ ] Add a "How to improve" expandable section per criterion
- [ ] Embed the panel in the Student Dashboard below the submission list

### Action Learning Cycle Tracker (Frontend)
- [ ] Create `/components/ALCycleTracker.tsx`
- [ ] Render four stage cards: Problem, Action, Reflection, Learning
- [ ] Each card shows: stage name, submission status, deadline, and a "Submit" button if active
- [ ] Lock the "Submit" button for stages not yet unlocked (grayed out with tooltip "Complete previous stage first")
- [ ] Show a "Waiting for advisor approval" badge when the stage submission is under review

### Advisor Review Panel (Frontend)
- [ ] Create `/pages/advisor/ReviewPage.tsx`
- [ ] Display submission content inline: extracted text from the document rendered as readable paragraphs
- [ ] Show the Smart-Gate validation results panel (rules passed/failed)
- [ ] Show the AI feedback panel with all criterion scores
- [ ] Add "Approve" and "Request Revision" buttons
- [ ] On approve: call `POST /al-progress/{studentId}/advance` to unlock the next stage
- [ ] On request revision: open a textarea for the advisor's comment, submit to `POST /submissions/{id}/comment`
- [ ] Display a history of all previous advisor comments for the submission

### Notifications (Backend)
- [ ] Add `spring-boot-starter-mail` or integrate AWS SES SDK
- [ ] Create `NotificationService` with method `sendEmail(to, subject, body)`
- [ ] Send email when: a submission is received (to advisor), validation result is ready (to student), advisor approves/rejects (to student), deadline is 48 hours away (to student)
- [ ] Create `POST /notifications/mark-read/{id}` endpoint
- [ ] Create `GET /notifications` endpoint returning unread notifications for the current user
- [ ] Add a notification bell icon in the frontend navbar showing unread count with a dropdown list

### Admin Console (Frontend)
- [ ] Create `/pages/admin/TenantsPage.tsx` (SUPER_ADMIN only): list all tenants, add new tenant button
- [ ] Create `/pages/admin/TenantSettingsPage.tsx` (TENANT_ADMIN): edit validation rules (file types, naming pattern, word counts, required sections)
- [ ] Create `/pages/admin/CohortsPage.tsx`: list cohorts, create cohort form, assign lecturer dropdown
- [ ] Create `/pages/admin/CohortDetailPage.tsx`: list students in cohort, add/remove student by email
- [ ] Create `/pages/admin/MilestonesPage.tsx`: set deadline per stage per cohort using a date picker

### Cross-Institution Analytics (Backend)
- [ ] Create `GET /analytics/cohort/{id}/summary` endpoint: returns on-time rate, compliance rate, average AI score for the cohort
- [ ] Create `GET /analytics/tenant/summary` endpoint: aggregated stats for the whole tenant
- [ ] Create `GET /analytics/global/benchmarks` endpoint (SUPER_ADMIN): cross-tenant averages — anonymized
- [ ] Create `GET /analytics/tenant/{id}/trends` endpoint: monthly submission volume and quality score over time
- [ ] Write unit tests for each analytics calculation

### Analytics Dashboard (Frontend)
- [ ] Create `/pages/analytics/AnalyticsPage.tsx`
- [ ] Add a line chart: submissions per week over the last 3 months (Recharts `LineChart`)
- [ ] Add a bar chart: average AI quality score per cohort (Recharts `BarChart`)
- [ ] Add a pie chart: submission status distribution — Compliant / Non-Compliant / Pending
- [ ] Add a metric card row: On-Time Rate %, Average Quality Score, Total Submissions This Month
- [ ] Add a benchmark comparison row: tenant average vs global average for quality score and on-time rate
- [ ] Make all charts responsive using Recharts `ResponsiveContainer`

### Compliance Report Export
- [ ] Add `itext7` or `apache-pdfbox` dependency to `pom.xml` for PDF generation
- [ ] Create `GET /reports/cohort/{id}/compliance` endpoint that generates a PDF report listing all students, their stage statuses, and compliance outcomes
- [ ] Add a "Download Report" button in the Faculty Dashboard that triggers this endpoint and downloads the PDF

### Load Testing
- [ ] Write a load test script using `k6` or `Locust` simulating 50 concurrent student submissions
- [ ] Run the test against the local docker-compose setup
- [ ] Check S3 upload success rate, Spring Boot response times, and FastAPI validation latency
- [ ] Document results in `/docs/testing/load-test-results.md`

---

## 🎨 Phase 6 — UX Refinement, Security & Final Delivery

### UX Testing
- [ ] Recruit 5 students and 2 advisors for usability testing sessions
- [ ] Prepare a task script: "Log in, submit a document to Stage 1, view your AI feedback"
- [ ] Observe and note any points where users hesitate, make errors, or express confusion
- [ ] Collect written feedback after each session using a simple form
- [ ] Categorize all feedback into: Navigation, Clarity, Performance, Missing Feature, Bug
- [ ] Create GitHub issues for each actionable feedback item

### UX Fixes & Polish
- [ ] Refine information hierarchy on the Student Dashboard — most critical info (next deadline, current status) must be visible without scrolling
- [ ] Add empty states for all lists: e.g. "No submissions yet — upload your first document to get started"
- [ ] Add confirmation dialogs before irreversible actions: delete submission, remove student from cohort
- [ ] Add loading skeleton screens for all dashboard data fetches
- [ ] Add error boundary components to prevent full-page crashes on API failures
- [ ] Add toast notifications for: successful submission, validation complete, approval received
- [ ] Implement responsive layout for all pages at 768px (tablet) and 375px (mobile) breakpoints
- [ ] Test every page in both light and dark mode if a theme toggle is implemented

### Accessibility
- [ ] Run automated accessibility audit using `axe-core` browser extension on all pages
- [ ] Fix any color contrast issues (minimum WCAG 2.1 AA: 4.5:1 for normal text)
- [ ] Add `aria-label` to all icon-only buttons (e.g. the notification bell, close modal button)
- [ ] Ensure all form inputs have associated `<label>` elements
- [ ] Test keyboard-only navigation: tab through all interactive elements on each page
- [ ] Add `alt` text to all images and diagrams

### Security Audit
- [ ] Test for IDOR (Insecure Direct Object Reference): log in as Student A, try to fetch Student B's submission by ID — should return 403
- [ ] Test for tenant data leakage: log in as a user from Tenant A, call endpoints with Tenant B's IDs — should return 403 or 404
- [ ] Test file upload security: try uploading a `.exe`, `.sh`, and a file with a manipulated MIME type — all should be rejected
- [ ] Test JWT forgery: modify the JWT payload (change role to SUPER_ADMIN) and sign with a wrong secret — should return 401
- [ ] Test SQL injection on all string input fields — Spring JPA parameterized queries should prevent this
- [ ] Review all endpoints: confirm none are publicly accessible without a valid JWT
- [ ] Implement rate limiting on `POST /auth/login` to prevent brute-force attacks (max 5 failed attempts per minute)
- [ ] Implement rate limiting on `POST /submissions/request-upload` (max 10 per student per hour)
- [ ] Ensure all API responses omit sensitive fields (password_hash, internal IDs) using DTOs

### AWS Production Setup
- [ ] Create an AWS RDS PostgreSQL instance (db.t3.micro for MVP) in a private subnet
- [ ] Create an ECS cluster with Fargate launch type
- [ ] Create ECS task definitions for backend and AI service containers
- [ ] Create an ECS service for each with desired count = 1 (scale up later)
- [ ] Create an Application Load Balancer with HTTPS listener (SSL certificate via AWS ACM)
- [ ] Set up Route 53 DNS records pointing your domain to the ALB
- [ ] Create production S3 bucket `alc-documents-prod` with the same settings as dev
- [ ] Deploy frontend build to S3 + CloudFront for static hosting
- [ ] Set up CloudWatch log groups for each ECS service
- [ ] Set up CloudWatch alarms: alert if backend error rate > 1% or latency > 2s

### Monitoring & Observability
- [ ] Enable Spring Boot Actuator endpoints: `/actuator/health`, `/actuator/metrics`
- [ ] Add a CloudWatch dashboard showing: ECS CPU/memory, RDS connections, S3 request count, API response times
- [ ] Set up an AWS SNS alert that emails the team when any CloudWatch alarm fires
- [ ] Add structured logging in Spring Boot using `logback` with JSON format for CloudWatch Logs Insights queries

### Documentation
- [ ] Write `/docs/setup-guide.md`: step-by-step local dev setup from scratch
- [ ] Write `/docs/api-reference.md`: full list of endpoints with curl examples
- [ ] Write `/docs/deployment-guide.md`: how to deploy to AWS from scratch
- [ ] Update this README with final architecture diagram, screenshots, and team contribution notes

### Thesis
- [ ] Write Chapter 1 — Introduction: problem statement, motivation, objectives
- [ ] Write Chapter 2 — Literature Review: compile research from Phase 2
- [ ] Write Chapter 3 — System Design: architecture, database schema, API design
- [ ] Write Chapter 4 — Implementation: key technical decisions, code snippets, challenges
- [ ] Write Chapter 5 — Results & Evaluation: load test results, usability test findings, AI scoring accuracy
- [ ] Write Chapter 6 — Conclusion: what was achieved, limitations, future work
- [ ] Format bibliography with all cited sources

### Final Presentation
- [ ] Record a demo video walkthrough: register → submit document → see validation result → receive AI feedback → advisor approves → next stage unlocks
- [ ] Prepare slides: Problem, Solution, Architecture, Live Demo, Results, Future Work
- [ ] Rehearse the presentation with all three team members

---

## 📊 Progress Summary

| Phase | Tasks | Status |
|-------|-------|--------|
| Phase 0 — Setup | 44 tasks | 🔲 Not started |
| Phase 1 — Requirements | 28 tasks | 🔲 Not started |
| Phase 2 — Research | 22 tasks | 🔲 Not started |
| Phase 3 — Core Backend | 38 tasks | 🔲 Not started |
| Phase 4 — Prototype | 35 tasks | 🔲 Not started |
| Phase 5 — MVP | 42 tasks | 🔲 Not started |
| Phase 6 — Delivery | 40 tasks | 🔲 Not started |

**Total: ~249 tasks**

---

## 🗂️ Folder Structure

```
alc/
├── frontend/               # React TypeScript app
├── backend/                # Spring Boot Maven project
├── ai-service/             # Python FastAPI service
├── infra/                  # Docker, Terraform, AWS configs
├── docs/
│   ├── adr/                # Architecture Decision Records
│   ├── architecture/       # Diagrams, ERD, schema
│   ├── requirements/       # RBAC matrix, API contract, validation rules
│   ├── research/           # Interview notes, pain points
│   ├── wireframes/         # UI sketches and mockups
│   └── testing/            # Load test results
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## 👥 Team

| Name | Role Focus |
|------|-----------|
| DOORGA Trithikraj | Backend (Spring Boot), Multi-tenancy, Security |
| NGUGI Janice | Frontend (React TypeScript), UI/UX, Analytics |
| MEYE Jordy | AI/NLP (FastAPI), Document Validation, Infra/DevOps |

---

*Generated for the Action Learning Cockpit project — EPITA*
