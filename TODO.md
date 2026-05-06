# 🚀 Action Learning Cockpit (ALC)
> A multi-tenant SaaS platform for academic governance — centralizing submissions, automating validation, and providing AI-powered feedback across universities.

**Stack:** React (TypeScript) · Spring Boot (Maven) · PostgreSQL · AWS S3 · Python (FastAPI)

**Team:** DOORGA Trithikraj · NGUGI Janice · MEYE Jordy

---

## 🗂️ Repositories

| Repo | Description | Tech |
|------|-------------|------|
| [`alc`](.) | Root coordination repo — shared docs, architecture, docker-compose, this TODO | — |
| [`alc-frontend`](https://github.com/YOUR_ORG/alc-frontend) | Student, faculty & admin dashboards | React TypeScript |
| [`alc-backend`](https://github.com/YOUR_ORG/alc-backend) | API gateway, auth, multi-tenancy, business logic | Spring Boot Maven |
| [`alc-ai-service`](https://github.com/YOUR_ORG/alc-ai-service) | Document validation & reflection quality scoring | Python FastAPI |

> This repo (`alc`) is the **root coordination repo** — it holds shared docs, architecture diagrams, the cross-repo `docker-compose.yml`, and this master TODO list. No application code lives here.

---

## 📋 Master TODO — Full Development Checklist

> Each task is tagged with the repo it belongs to:
> **`[root]`** = this repo · **`[frontend]`** = alc-frontend · **`[backend]`** = alc-backend · **`[ai]`** = alc-ai-service
>
> Work through phases in order — each phase depends on the previous one.

---

## ⚙️ Phase 0 — Environment & Project Setup

### GitHub Organisation & Repos
- [ ] `[root]` Create a GitHub Organisation (e.g. `alc-project`) and transfer all four repos into it
- [ ] `[root]` Replace the placeholder URLs in the Repositories table above with the real repo links
- [ ] `[root]` Apply the same branch strategy across all four repos: `main`, `dev`, `feature/*`, `fix/*`
- [ ] `[root]` Set up branch protection on `main` in every repo: require PR + at least 1 approval before merge
- [ ] `[root]` Create a GitHub Project board (org-level) with columns: Backlog → In Progress → Review → Done
- [ ] `[root]` Add the same issue labels to every repo: `frontend`, `backend`, `ai`, `devops`, `security`, `research`, `bug`
- [ ] `[root]` Add a `.gitignore` to this root repo covering OS files (`.DS_Store`, `Thumbs.db`) and env files (`.env`)

### Root Repo Structure
- [ ] `[root]` Create folder structure: `/docs`, `/infra`
- [ ] `[root]` Create `/docs/adr/` — Architecture Decision Records
- [ ] `[root]` Create `/docs/architecture/` — system diagrams, ERD, schema design
- [ ] `[root]` Create `/docs/requirements/` — RBAC matrix, API contract, validation rules
- [ ] `[root]` Create `/docs/research/` — interview notes and pain-point summaries
- [ ] `[root]` Create `/docs/wireframes/` — UI sketches and mockups
- [ ] `[root]` Create `/docs/testing/` — load test scripts and results
- [ ] `[root]` Create `docker-compose.yml` that starts all four services (frontend, backend, ai-service, postgres) for local development
- [ ] `[root]` Create a `Makefile` with shortcuts: `make dev` (docker-compose up), `make stop`, `make logs`
- [ ] `[root]` Add a `.env.example` at the root listing every required environment variable across all services

### `alc-frontend` Setup (React + TypeScript)
- [ ] `[frontend]` Add a Node `.gitignore` covering `node_modules/`, `build/`, `.env`
- [ ] `[frontend]` Scaffold the project in the repo root: `npx create-react-app . --template typescript`
- [ ] `[frontend]` Install React Router: `npm install react-router-dom`
- [ ] `[frontend]` Install Axios for HTTP requests: `npm install axios`
- [ ] `[frontend]` Install a UI component library (e.g. shadcn/ui or MUI) — follow its setup guide
- [ ] `[frontend]` Install React Query for server state: `npm install @tanstack/react-query`
- [ ] `[frontend]` Install a charting library for dashboards: `npm install recharts`
- [ ] `[frontend]` Install react-dropzone for file uploads: `npm install react-dropzone`
- [ ] `[frontend]` Create `.env` file (not committed) with `REACT_APP_API_BASE_URL=http://localhost:8080`
- [ ] `[frontend]` Create `.env.example` (committed) with the same keys but empty values
- [ ] `[frontend]` Configure absolute imports in `tsconfig.json`: set `"baseUrl": "src"`
- [ ] `[frontend]` Set up ESLint + Prettier with TypeScript rules and add a `lint` script to `package.json`
- [ ] `[frontend]` Create folder structure inside `src/`: `api/`, `components/`, `pages/`, `hooks/`, `types/`, `context/`
- [ ] `[frontend]` Create a global Axios instance at `src/api/axiosClient.ts` with the base URL and request/response interceptors
- [ ] `[frontend]` Verify the app starts with no errors: `npm start` — confirm it loads at `localhost:3000`
- [ ] `[frontend]` Write a `Dockerfile`: multi-stage — build with `node:20-alpine`, serve the `/build` output with `nginx:alpine`
- [ ] `[frontend]` Create `.github/workflows/ci.yml`: runs `npm run build` and `npm test -- --watchAll=false` on every push to `dev` and `main`

### `alc-backend` Setup (Spring Boot + Maven)
- [ ] `[backend]` Add a Java `.gitignore` covering `target/`, `.mvn/`, `*.class`, `.env`
- [ ] `[backend]` Generate the project at `start.spring.io` with: Spring Web, Spring Data JPA, Spring Security, Validation, PostgreSQL Driver, Lombok, Spring Boot Actuator, Spring WebFlux
- [ ] `[backend]` Unzip the generated project into the repo root and verify it builds: `./mvnw clean install -DskipTests`
- [ ] `[backend]` Create `src/main/resources/application.yml` with placeholder properties for DB URL, JWT secret, AWS credentials, AI service URL
- [ ] `[backend]` Create `src/main/resources/application-dev.yml` with local development values
- [ ] `[backend]` Create `src/main/resources/application-prod.yml` referencing environment variables only — no hardcoded secrets
- [ ] `[backend]` Create Java package structure under `com.alc.backend`: `controller`, `service`, `repository`, `model`, `dto`, `config`, `security`, `exception`
- [ ] `[backend]` Verify Lombok works: create a class with `@Data` and confirm no compilation errors
- [ ] `[backend]` Add Flyway dependency to `pom.xml` for versioned database migrations
- [ ] `[backend]` Create `src/main/resources/db/migration/` folder where all Flyway SQL scripts will live
- [ ] `[backend]` Write a `Dockerfile`: multi-stage — build with `maven:3.9-eclipse-temurin-21`, run with `eclipse-temurin:21-jre-alpine`
- [ ] `[backend]` Create `.github/workflows/ci.yml`: runs `./mvnw test` on every push to `dev` and `main`
- [ ] `[backend]` Add GitHub Secrets to the repo: `DB_URL`, `DB_USER`, `DB_PASS`, `JWT_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AI_SERVICE_URL`

### `alc-ai-service` Setup (Python + FastAPI)
- [ ] `[ai]` Add a Python `.gitignore` covering `venv/`, `__pycache__/`, `*.pyc`, `.env`, `*.egg-info`
- [ ] `[ai]` Create a virtual environment in the repo root: `python -m venv venv`
- [ ] `[ai]` Create `requirements.txt` with: `fastapi`, `uvicorn[standard]`, `pydantic`, `pydantic-settings`, `python-multipart`, `python-docx`, `PyMuPDF`, `sentence-transformers`, `torch`, `scikit-learn`, `httpx`, `boto3`, `pytest`, `pytest-asyncio`
- [ ] `[ai]` Install all dependencies: `pip install -r requirements.txt`
- [ ] `[ai]` Create folder structure in the repo root: `routers/`, `services/`, `schemas/`, `models/`, `tests/`
- [ ] `[ai]` Create `main.py` with a root `FastAPI` app, CORS middleware, and a `GET /health` endpoint returning `{"status": "ok"}`
- [ ] `[ai]` Create `.env` file (not committed) with `AWS_REGION`, `S3_BUCKET_NAME`, `BACKEND_URL`
- [ ] `[ai]` Create `.env.example` (committed) with the same keys and empty values
- [ ] `[ai]` Create `config.py` using `pydantic-settings BaseSettings` to load all env vars with type validation
- [ ] `[ai]` Verify the service starts: `uvicorn main:app --reload` — confirm `GET /health` returns `200 {"status": "ok"}`
- [ ] `[ai]` Write a `Dockerfile`: use `python:3.11-slim`, copy `requirements.txt`, install deps, copy source, run `uvicorn`
- [ ] `[ai]` Create `.github/workflows/ci.yml`: runs `pytest` on every push to `dev` and `main`
- [ ] `[ai]` Add GitHub Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME`

### Database Setup (PostgreSQL)
- [ ] `[root]` Add a `postgres` service to `docker-compose.yml` using the `postgres:16` image with a named volume for data persistence
- [ ] `[root]` Set environment variables in docker-compose: `POSTGRES_DB=alc_db`, `POSTGRES_USER=alc_user`, `POSTGRES_PASSWORD=dev_password`
- [ ] `[backend]` Point `application-dev.yml` to the docker-compose PostgreSQL instance: `jdbc:postgresql://localhost:5432/alc_db`
- [ ] `[backend]` Confirm Spring Boot connects on startup — look for Flyway and Hibernate logs with no errors

### AWS Setup
- [ ] `[root]` Create an IAM user with programmatic access only — no console login
- [ ] `[root]` Attach an inline policy allowing only `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject` on the project bucket ARN
- [ ] `[root]` Create an S3 bucket `alc-documents-dev` with versioning enabled
- [ ] `[root]` Enable "Block all public access" on the bucket — files served via pre-signed URLs only
- [ ] `[root]` Add a lifecycle rule to abort incomplete multipart uploads after 7 days
- [ ] `[root]` Store the IAM credentials in the `.env` of both `alc-backend` and `alc-ai-service` — never commit them

---

## 📝 Phase 1 — Requirements & Design

### Stakeholder Research
- [ ] `[root]` Write 10 interview questions for students covering pain points with Teams, Excel, and shared drives
- [ ] `[root]` Write 10 interview questions for advisors covering manual admin tasks and time spent on compliance checks
- [ ] `[root]` Conduct at least 3 student interviews — document findings in `/docs/research/student-interviews.md`
- [ ] `[root]` Conduct at least 2 advisor interviews — document findings in `/docs/research/advisor-interviews.md`
- [ ] `[root]` Summarize all findings into a ranked pain-point list in `/docs/research/pain-points.md`

### Submission Rules Definition
- [ ] `[root]` Document allowed file types: PDF and DOCX only
- [ ] `[root]` Document the file naming convention format (e.g. `LASTNAME_StudentID_Stage_v1.pdf`)
- [ ] `[root]` Document word count rules per Action Learning stage: minimum and maximum per stage
- [ ] `[root]` Document required section headings per stage: Problem, Action, Reflection, Learning
- [ ] `[root]` Document which rules are configurable per tenant vs fixed globally
- [ ] `[root]` Save everything in `/docs/requirements/validation-rules.md`

### User Roles & Permissions
- [ ] `[root]` List all user roles: Student, Lecturer, Academic Advisor, Tenant Admin, Super Admin
- [ ] `[root]` Create a permission matrix table — rows = roles, columns = actions (view, submit, review, approve, configure, manage tenants)
- [ ] `[root]` Define data visibility rules per role: own data only vs whole cohort vs all tenants
- [ ] `[root]` Save the complete RBAC matrix in `/docs/requirements/rbac-matrix.md`

### Wireframes
- [ ] `[root]` Sketch the Student Dashboard: AL stage tracker stepper, deadline card, recent submission status list
- [ ] `[root]` Sketch the Submission Form: drag-and-drop upload zone, validation result panel, stage selector
- [ ] `[root]` Sketch the Faculty Dashboard: cohort submission table with filters, compliance rate summary card
- [ ] `[root]` Sketch the AI Feedback Panel: per-criterion score bars, suggestion text, overall score indicator
- [ ] `[root]` Sketch the Advisor Review Panel: document content preview, validation results, approve/reject buttons
- [ ] `[root]` Sketch the Admin Console: tenant list, settings form, cohort and milestone management
- [ ] `[root]` Sketch the Analytics Dashboard: charts for trends, quality scores, benchmark comparisons
- [ ] `[root]` Save all wireframe images in `/docs/wireframes/`

### API Contract
- [ ] `[root]` List all backend REST endpoints grouped by resource: `/auth`, `/users`, `/tenants`, `/cohorts`, `/submissions`, `/analytics`, `/reports`
- [ ] `[root]` For each endpoint define: HTTP method, path, request body, success response, required role
- [ ] `[root]` Define the standard error response format: `{ "code": "...", "message": "...", "details": {} }`
- [ ] `[root]` List all AI service endpoints: `GET /health`, `POST /validate/document`, `POST /analysis/reflection-quality`
- [ ] `[root]` Save the full API contract in `/docs/requirements/api-contract.md`

### Architecture Decision Records
- [ ] `[root]` Write ADR: shared-schema multi-tenancy (`tenant_id` column) vs schema-per-tenant
- [ ] `[root]` Write ADR: JWT stateless auth vs session-based auth
- [ ] `[root]` Write ADR: FastAPI standalone service vs embedding Python in Spring Boot
- [ ] `[root]` Write ADR: S3 pre-signed URL upload vs server-side proxied upload
- [ ] `[root]` Save all ADRs in `/docs/adr/`

---

## 🔬 Phase 2 — Research & Architecture

### Literature Review
- [ ] `[root]` Write a section on multi-tenant SaaS architecture patterns: shared, hybrid, silo — justify your choice
- [ ] `[root]` Write a section comparing existing academic platforms: Moodle, Turnitin, Canvas — identify gaps ALC fills
- [ ] `[root]` Write a section justifying the multi-repo microservice approach over a monolith
- [ ] `[root]` Write a section on NLP for educational text: reflection quality, structure detection, semantic scoring
- [ ] `[root]` Write a section on learning analytics dashboard design: which charts aid academic decision-making
- [ ] `[root]` Compile all sections with references into `/docs/literature-review.md`

### NLP Research (`alc-ai-service`)
- [ ] `[ai]` Identify 3 candidate sentence-transformer models (e.g. `all-MiniLM-L6-v2`, `paraphrase-mpnet-base-v2`, `all-distilroberta-v1`)
- [ ] `[ai]` Test each model locally on a sample student reflection text — compare output quality
- [ ] `[ai]` Measure inference time and memory usage for each model
- [ ] `[ai]` Choose the final model and record the decision in a new ADR in the root repo
- [ ] `[ai]` Test `python-docx` on a sample DOCX file — verify text and heading extraction
- [ ] `[ai]` Test `PyMuPDF` on a sample PDF file — verify text extraction across multiple pages
- [ ] `[ai]` Research structure detection: compare regex-based heading detection vs a classifier — document the chosen approach

### System Architecture
- [ ] `[root]` Draw the full system architecture diagram: React → Spring Boot → PostgreSQL, FastAPI, S3, AWS
- [ ] `[root]` Document all cross-service calls: which Spring Boot endpoints call which FastAPI endpoints and when
- [ ] `[root]` Draw the database ERD: all tables with columns, data types, primary keys, and foreign keys
- [ ] `[root]` Define the S3 folder structure: `/{tenant_id}/{student_id}/{stage}/{filename}`
- [ ] `[root]` Save all diagrams in `/docs/architecture/`

### Database Schema Design
- [ ] `[root]` Design `tenants` table: `id`, `name`, `subdomain`, `custom_rules` (JSONB), `created_at`
- [ ] `[root]` Design `users` table: `id`, `tenant_id`, `email`, `password_hash`, `role`, `full_name`, `created_at`
- [ ] `[root]` Design `cohorts` table: `id`, `tenant_id`, `name`, `lecturer_id`, `academic_year`
- [ ] `[root]` Design `cohort_students` join table: `cohort_id`, `student_id`
- [ ] `[root]` Design `submissions` table: `id`, `tenant_id`, `student_id`, `cohort_id`, `stage`, `s3_key`, `s3_version_id`, `status`, `submitted_at`
- [ ] `[root]` Design `validation_results` table: `id`, `submission_id`, `rule_name`, `passed`, `message`
- [ ] `[root]` Design `ai_feedback` table: `id`, `submission_id`, `criterion`, `score`, `suggestion`, `generated_at`
- [ ] `[root]` Design `al_progress` table: `id`, `student_id`, `cohort_id`, `current_stage`, `stage_status`
- [ ] `[root]` Design `milestones` table: `id`, `cohort_id`, `stage`, `deadline`
- [ ] `[root]` Design `notifications` table: `id`, `user_id`, `type`, `message`, `read`, `created_at`
- [ ] `[root]` Save the complete schema in `/docs/architecture/database-schema.md`

---

## 🔧 Phase 3 — Core Backend & Authentication

### Database Migrations (`alc-backend`)
- [ ] `[backend]` Create `V1__create_tenants_table.sql`
- [ ] `[backend]` Create `V2__create_users_table.sql`
- [ ] `[backend]` Create `V3__create_cohorts_and_cohort_students.sql`
- [ ] `[backend]` Create `V4__create_submissions_table.sql`
- [ ] `[backend]` Create `V5__create_validation_results_table.sql`
- [ ] `[backend]` Create `V6__create_ai_feedback_table.sql`
- [ ] `[backend]` Create `V7__create_al_progress_table.sql`
- [ ] `[backend]` Create `V8__create_milestones_table.sql`
- [ ] `[backend]` Create `V9__create_notifications_table.sql`
- [ ] `[backend]` Run all migrations and verify the full schema in a PostgreSQL client (e.g. DBeaver or TablePlus)

### Multi-Tenancy (`alc-backend`)
- [ ] `[backend]` Create `Tenant` JPA entity with all fields from the schema design
- [ ] `[backend]` Create `TenantRepository` extending `JpaRepository<Tenant, UUID>`
- [ ] `[backend]` Create a `TenantContext` utility class using `ThreadLocal<String>` to hold the current tenant ID per request thread
- [ ] `[backend]` Create a `TenantFilter` (servlet filter) that extracts `tenant_id` from the JWT and stores it in `TenantContext`
- [ ] `[backend]` Apply `WHERE tenant_id = ?` filtering in all repository queries using `@Query` annotations
- [ ] `[backend]` Write a unit test: a request authenticated as Tenant A must not retrieve rows belonging to Tenant B

### Authentication & JWT (`alc-backend`)
- [ ] `[backend]` Add the `jjwt` library to `pom.xml`
- [ ] `[backend]` Create `JwtService` with methods: `generateToken(UserDetails)`, `validateToken(String)`, `extractClaims(String)`
- [ ] `[backend]` Include `tenant_id` and `role` as custom claims in the JWT payload
- [ ] `[backend]` Create `JwtAuthFilter` extending `OncePerRequestFilter` — validate the JWT and populate the `SecurityContext` on every request
- [ ] `[backend]` Configure `SecurityFilterChain` in `SecurityConfig`: permit `/auth/**` publicly, require auth for everything else
- [ ] `[backend]` Create `POST /auth/register` — accept name, email, password, tenant subdomain; return a JWT
- [ ] `[backend]` Create `POST /auth/login` — accept email and password; return a JWT and refresh token
- [ ] `[backend]` Create `POST /auth/refresh` — accept a valid refresh token; return a new JWT
- [ ] `[backend]` Hash all passwords with `BCryptPasswordEncoder` — never store or log plain-text passwords
- [ ] `[backend]` Write an integration test for the full flow: register → login → call a protected endpoint with the JWT

### RBAC (`alc-backend`)
- [ ] `[backend]` Create `Role` enum: `STUDENT`, `LECTURER`, `ADVISOR`, `TENANT_ADMIN`, `SUPER_ADMIN`
- [ ] `[backend]` Annotate every controller method with `@PreAuthorize("hasRole('...')")` per the permission matrix
- [ ] `[backend]` Create a `GlobalExceptionHandler` using `@RestControllerAdvice` returning a `403` JSON response on role check failures
- [ ] `[backend]` Write unit tests per role: verify a `STUDENT` token cannot reach advisor-only or admin-only endpoints

### User Management Endpoints (`alc-backend`)
- [ ] `[backend]` `GET /users/me` — return the current user's profile
- [ ] `[backend]` `PUT /users/me` — update the current user's name
- [ ] `[backend]` `GET /users` — list all users in the current tenant (`TENANT_ADMIN` only)
- [ ] `[backend]` `POST /users/invite` — invite a user by email to the current tenant (`TENANT_ADMIN` only)
- [ ] `[backend]` `DELETE /users/{id}` — deactivate a user account (`TENANT_ADMIN` only)
- [ ] `[backend]` Write unit and integration tests for each endpoint

### Tenant Management Endpoints (`alc-backend`)
- [ ] `[backend]` `POST /tenants` — create a new tenant (`SUPER_ADMIN` only)
- [ ] `[backend]` `GET /tenants` — list all tenants (`SUPER_ADMIN` only)
- [ ] `[backend]` `GET /tenants/{id}` — get a single tenant's details and current validation rules
- [ ] `[backend]` `PUT /tenants/{id}/rules` — update validation rules for a tenant (`TENANT_ADMIN` only)
- [ ] `[backend]` Write unit and integration tests for each endpoint

### AWS S3 Integration (`alc-backend`)
- [ ] `[backend]` Add `aws-java-sdk-s3` dependency to `pom.xml`
- [ ] `[backend]` Create `S3Config` bean that builds an `AmazonS3` client from environment variables
- [ ] `[backend]` Create `S3Service.generatePresignedUploadUrl(tenantId, studentId, stage, filename)` — returns a pre-signed PUT URL valid for 15 minutes
- [ ] `[backend]` Create `S3Service.generatePresignedDownloadUrl(s3Key)` — returns a pre-signed GET URL valid for 5 minutes
- [ ] `[backend]` Create `S3Service.deleteFile(s3Key)` for removing rejected or deleted submissions
- [ ] `[backend]` Write unit tests for `S3Service` using a mocked `AmazonS3` client

### Cohort Management Endpoints (`alc-backend`)
- [ ] `[backend]` `POST /cohorts` — create a cohort (`LECTURER` only)
- [ ] `[backend]` `GET /cohorts` — list all cohorts in the current tenant
- [ ] `[backend]` `GET /cohorts/{id}` — get cohort details
- [ ] `[backend]` `POST /cohorts/{id}/students` — add a student to a cohort
- [ ] `[backend]` `DELETE /cohorts/{id}/students/{studentId}` — remove a student from a cohort
- [ ] `[backend]` `GET /cohorts/{id}/students` — list all students in a cohort
- [ ] `[backend]` Write unit and integration tests for each endpoint

---

## 🛡️ Phase 4 — Smart-Gate Validator & Prototype

### Smart-Gate Metadata Validation (`alc-backend`)
- [ ] `[backend]` Create `ValidationService` in Spring Boot
- [ ] `[backend]` Implement rule: reject any file whose extension is not `.pdf` or `.docx`
- [ ] `[backend]` Implement rule: check the filename matches the tenant's naming pattern regex (stored in tenant rules JSONB)
- [ ] `[backend]` Create `POST /submissions/validate-metadata` — runs both rules; only returns a pre-signed S3 URL if both pass
- [ ] `[backend]` Return a structured response even on failure: `{ "passed": false, "results": [{ "rule": "file_extension", "passed": false, "message": "Only PDF and DOCX files are accepted." }] }`

### Smart-Gate Document Validation (`alc-ai-service`)
- [ ] `[ai]` Create `routers/validation.py` and register it in `main.py`
- [ ] `[ai]` Create `POST /validate/document` — accepts `{ "s3_key": "...", "tenant_rules": { ... } }`
- [ ] `[ai]` Implement S3 file download using `boto3` to fetch the file bytes by key
- [ ] `[ai]` Implement DOCX text and heading extraction using `python-docx`
- [ ] `[ai]` Implement PDF text extraction using `PyMuPDF`
- [ ] `[ai]` Implement word count rule: count words in extracted text and compare to tenant `min_words` and `max_words`
- [ ] `[ai]` Implement section presence rule: search extracted text for each required heading with case-insensitive regex
- [ ] `[ai]` Return: `{ "passed": bool, "results": [{ "rule": "...", "passed": bool, "message": "..." }] }`
- [ ] `[ai]` Write unit tests for each rule using small sample DOCX and PDF files in `tests/fixtures/`

### Submission Flow (`alc-backend`)
- [ ] `[backend]` Create `Submission` JPA entity and `SubmissionRepository`
- [ ] `[backend]` Create `POST /submissions/request-upload` — runs metadata validation, creates a `PENDING` submission record, returns the pre-signed S3 URL
- [ ] `[backend]` Create `POST /submissions/{id}/confirm` — called by the frontend after the S3 upload; triggers an async call to `POST /validate/document` on the AI service
- [ ] `[backend]` Implement the async call to FastAPI using `WebClient` — do not block the HTTP response thread
- [ ] `[backend]` Store each validation rule result in the `validation_results` table after FastAPI responds
- [ ] `[backend]` Update submission status to `COMPLIANT` or `NON_COMPLIANT` based on the validation results
- [ ] `[backend]` Create `GET /submissions` — list all submissions for the current student (tenant-scoped)
- [ ] `[backend]` Create `GET /submissions/{id}` — return full submission detail including all validation results
- [ ] `[backend]` Create `GET /cohorts/{id}/submissions` — list all submissions in a cohort (`LECTURER`/`ADVISOR` only)
- [ ] `[backend]` Write an integration test for the full flow: request-upload → confirm → validation result stored

### Frontend — Auth Screens (`alc-frontend`)
- [ ] `[frontend]` Create `src/pages/LoginPage.tsx` with an email + password form
- [ ] `[frontend]` Create `src/pages/RegisterPage.tsx` with name, email, and password fields
- [ ] `[frontend]` Create `src/context/AuthContext.tsx` providing `user`, `token`, `login()`, and `logout()` app-wide
- [ ] `[frontend]` Store the JWT in React state only — never in `localStorage` or `sessionStorage`
- [ ] `[frontend]` Create a `PrivateRoute` component that redirects unauthenticated users to `/login`
- [ ] `[frontend]` Add an Axios request interceptor to attach `Authorization: Bearer <token>` to every outgoing request
- [ ] `[frontend]` Add an Axios response interceptor: on `401`, clear auth state and redirect to `/login`

### Frontend — Student Dashboard (`alc-frontend`)
- [ ] `[frontend]` Create `src/pages/student/DashboardPage.tsx`
- [ ] `[frontend]` Display the AL cycle stage tracker: four steps (Problem → Action → Reflection → Learning) with the active stage highlighted
- [ ] `[frontend]` Display a deadline countdown card showing days remaining for the current stage
- [ ] `[frontend]` Display the student's past submissions with status badges: Pending, Compliant, Non-Compliant, Approved
- [ ] `[frontend]` Fetch data from `GET /submissions` and `GET /al-progress/{studentId}` on page load

### Frontend — Submission Form (`alc-frontend`)
- [ ] `[frontend]` Create `src/pages/student/SubmitPage.tsx`
- [ ] `[frontend]` Build a drag-and-drop file upload zone using `react-dropzone`
- [ ] `[frontend]` On file select, run client-side pre-checks: reject non-PDF/DOCX; warn if file exceeds 10MB
- [ ] `[frontend]` On submit, call `POST /submissions/request-upload` to receive the pre-signed S3 URL
- [ ] `[frontend]` Upload the file directly to S3 using the pre-signed URL: `axios.put(url, file, { headers: { 'Content-Type': file.type } })`
- [ ] `[frontend]` After S3 upload succeeds, call `POST /submissions/{id}/confirm`
- [ ] `[frontend]` Poll `GET /submissions/{id}` every 3 seconds until status changes from `PENDING`
- [ ] `[frontend]` Display the validation result panel: green checkmark or red cross per rule, with the failure message below each failing rule
- [ ] `[frontend]` Disable the submit button and show a loading spinner during upload and validation

### Frontend — Faculty Dashboard (`alc-frontend`)
- [ ] `[frontend]` Create `src/pages/faculty/DashboardPage.tsx`
- [ ] `[frontend]` Display a table of all submissions in the cohort: Student Name, Stage, Submitted At, Status
- [ ] `[frontend]` Add a filter bar: filter by stage, filter by status, search by student name
- [ ] `[frontend]` Display a compliance rate summary card: "X of Y submissions are compliant this week"

---

## 🤖 Phase 5 — Full AL Cycle, AI Feedback & Analytics

### Action Learning Cycle Tracker (`alc-backend`)
- [ ] `[backend]` Create `ALProgress` JPA entity linked to the `al_progress` table
- [ ] `[backend]` Create `GET /al-progress/{studentId}` — return the student's current stage and status
- [ ] `[backend]` Create `POST /al-progress/{studentId}/advance` — move to the next stage (`ADVISOR` only, only when current stage is `APPROVED`)
- [ ] `[backend]` Add stage-locking to `POST /submissions/request-upload`: reject a Stage N submission if Stage N-1 is not yet `APPROVED`
- [ ] `[backend]` Write unit tests for stage-locking with all boundary cases (first stage, middle, final stage)

### AI Reflection Quality Scoring (`alc-ai-service`)
- [ ] `[ai]` Create `services/model_loader.py` — load the chosen sentence-transformer model once at startup and cache it
- [ ] `[ai]` Create `routers/analysis.py` and register it in `main.py`
- [ ] `[ai]` Create `POST /analysis/reflection-quality` — accepts `{ "text": "...", "stage": "reflection" }`
- [ ] `[ai]` Define reference embeddings for four scoring criteria: Depth, Coherence, Evidence of Learning, Actionability
- [ ] `[ai]` Score each criterion by computing cosine similarity between the student's text embedding and the reference, scaled to 0–10
- [ ] `[ai]` Generate a plain-English suggestion for any criterion scoring below 6 (e.g. "Add a paragraph describing what you would do differently next time.")
- [ ] `[ai]` Return: `{ "overall_score": float, "criteria": [{ "name": "...", "score": float, "suggestion": "..." }] }`
- [ ] `[ai]` Write unit tests with sample high-quality and low-quality reflections — verify scoring direction is correct

### AI Feedback Integration (`alc-backend`)
- [ ] `[backend]` After a submission is validated as `COMPLIANT`, trigger an async `WebClient` call to `POST /analysis/reflection-quality`
- [ ] `[backend]` Store all returned criteria scores and suggestions in the `ai_feedback` table
- [ ] `[backend]` Create `GET /submissions/{id}/feedback` — return the stored AI feedback for a submission
- [ ] `[backend]` Write an integration test: submit a compliant document → verify AI feedback is stored and retrievable

### Frontend — AI Feedback Panel (`alc-frontend`)
- [ ] `[frontend]` Create `src/components/AIFeedbackPanel.tsx`
- [ ] `[frontend]` Display the overall score with a circular or arc progress indicator
- [ ] `[frontend]` Display each criterion as a card: criterion name, a score bar (0–10), and the suggestion text
- [ ] `[frontend]` Apply amber styling to cards scoring below 6 and red styling below 4
- [ ] `[frontend]` Add an expandable "How to improve" section per criterion
- [ ] `[frontend]` Fetch from `GET /submissions/{id}/feedback` and embed the panel in the Student Dashboard

### AL Cycle Tracker Frontend (`alc-frontend`)
- [ ] `[frontend]` Create `src/components/ALCycleTracker.tsx`
- [ ] `[frontend]` Render four stage cards: Problem, Action, Reflection, Learning
- [ ] `[frontend]` Each card shows: stage name, submission status badge, deadline, and a "Submit" button if active
- [ ] `[frontend]` Disable the "Submit" button on locked stages with tooltip: "Complete the previous stage first"
- [ ] `[frontend]` Show a "Waiting for advisor approval" badge when a stage submission is under review

### Advisor Review Panel (`alc-frontend`)
- [ ] `[frontend]` Create `src/pages/advisor/ReviewPage.tsx`
- [ ] `[frontend]` Fetch the submission document text from `GET /submissions/{id}` and render it as readable paragraphs
- [ ] `[frontend]` Display the Smart-Gate validation results panel
- [ ] `[frontend]` Display the AI Feedback Panel with all criterion scores
- [ ] `[frontend]` Add "Approve" and "Request Revision" buttons
- [ ] `[frontend]` On "Approve": call `POST /al-progress/{studentId}/advance` and show a success toast
- [ ] `[frontend]` On "Request Revision": show a textarea for the advisor's comment, then submit to `POST /submissions/{id}/comment`
- [ ] `[frontend]` Display a history of previous advisor comments below the action buttons

### Notifications (`alc-backend`)
- [ ] `[backend]` Add AWS SES SDK or `spring-boot-starter-mail` to `pom.xml`
- [ ] `[backend]` Create `NotificationService.sendEmail(to, subject, body)`
- [ ] `[backend]` Send email to advisor when a new submission arrives in their cohort
- [ ] `[backend]` Send email to student when their validation result is ready
- [ ] `[backend]` Send email to student when their submission is approved or revision is requested
- [ ] `[backend]` Create a `@Scheduled` job that sends deadline reminder emails 48 hours before each milestone
- [ ] `[backend]` Create `GET /notifications` — return all unread notifications for the current user
- [ ] `[backend]` Create `POST /notifications/{id}/read` — mark a notification as read

### Notifications Frontend (`alc-frontend`)
- [ ] `[frontend]` Add a notification bell icon in the top navbar
- [ ] `[frontend]` Show an unread count badge on the bell icon using data from `GET /notifications`
- [ ] `[frontend]` Clicking the bell opens a dropdown listing recent notifications
- [ ] `[frontend]` Clicking a notification calls `POST /notifications/{id}/read` and navigates to the relevant page

### Admin Console (`alc-frontend`)
- [ ] `[frontend]` Create `src/pages/admin/TenantsPage.tsx` (`SUPER_ADMIN` only): list all tenants and provide an "Add Tenant" form
- [ ] `[frontend]` Create `src/pages/admin/TenantSettingsPage.tsx` (`TENANT_ADMIN`): form to edit validation rules — file types, naming pattern, word count limits, required sections
- [ ] `[frontend]` Create `src/pages/admin/CohortsPage.tsx`: list cohorts, create cohort form, assign lecturer via dropdown
- [ ] `[frontend]` Create `src/pages/admin/CohortDetailPage.tsx`: list students in a cohort, add student by email, remove student
- [ ] `[frontend]` Create `src/pages/admin/MilestonesPage.tsx`: set and edit submission deadline per stage per cohort with a date picker

### Cross-Institution Analytics (`alc-backend`)
- [ ] `[backend]` Create `GET /analytics/cohort/{id}/summary` — on-time rate, compliance rate, average AI score for the cohort
- [ ] `[backend]` Create `GET /analytics/tenant/summary` — aggregated stats for the whole tenant
- [ ] `[backend]` Create `GET /analytics/tenant/trends` — monthly submission volume and average quality score over the past 6 months
- [ ] `[backend]` Create `GET /analytics/global/benchmarks` (`SUPER_ADMIN` only) — cross-tenant averages, anonymized
- [ ] `[backend]` Write unit tests for each analytics calculation including empty cohort edge cases

### Analytics Dashboard (`alc-frontend`)
- [ ] `[frontend]` Create `src/pages/analytics/AnalyticsPage.tsx`
- [ ] `[frontend]` Add a line chart: submissions per week over the past 3 months using `recharts LineChart`
- [ ] `[frontend]` Add a bar chart: average AI quality score per cohort using `recharts BarChart`
- [ ] `[frontend]` Add a pie chart: submission status distribution using `recharts PieChart`
- [ ] `[frontend]` Add a metric card row: On-Time Rate %, Average Quality Score, Total Submissions This Month
- [ ] `[frontend]` Add a benchmark comparison row: tenant average vs global average
- [ ] `[frontend]` Wrap all charts in `recharts ResponsiveContainer` so they resize with the browser window

### Compliance Report Export
- [ ] `[backend]` Add `itext7` or `apache-pdfbox` to `pom.xml`
- [ ] `[backend]` Create `GET /reports/cohort/{id}/compliance` — generates and streams a PDF listing all students, their stage statuses, and compliance outcomes
- [ ] `[frontend]` Add a "Download Compliance Report" button on the Faculty Dashboard that triggers this endpoint and saves the PDF

### Load Testing
- [ ] `[root]` Install `k6` locally: `brew install k6` or download from the k6 website
- [ ] `[root]` Write `infra/load-tests/submission-flow.js` simulating 50 virtual users: login → request-upload → confirm → poll
- [ ] `[root]` Run the test against the local docker-compose: `k6 run infra/load-tests/submission-flow.js`
- [ ] `[root]` Record p95 latency, error rate, and S3 success rate in `/docs/testing/load-test-results.md`

---

## 🎨 Phase 6 — UX Refinement, Security & Final Delivery

### UX Testing
- [ ] `[root]` Recruit 5 students and 2 advisors for 30-minute usability testing sessions
- [ ] `[root]` Prepare a task script: "Log in → submit to Stage 1 → read validation result → read AI feedback"
- [ ] `[root]` Note every point where a user hesitates, makes an error, or expresses confusion
- [ ] `[root]` Collect written feedback after each session using a short form
- [ ] `[root]` Categorize feedback into: Navigation, Clarity, Performance, Missing Feature, Bug
- [ ] `[root]` Open a labeled GitHub issue in the relevant repo for each actionable item

### UX Fixes & Polish (`alc-frontend`)
- [ ] `[frontend]` Ensure the Student Dashboard shows the next deadline and current stage status without scrolling
- [ ] `[frontend]` Add empty state components for all lists: e.g. "No submissions yet — upload your first document to get started"
- [ ] `[frontend]` Add confirmation dialogs before every irreversible action: delete submission, remove student from cohort
- [ ] `[frontend]` Replace loading spinners with skeleton screen components for all data-fetching pages
- [ ] `[frontend]` Add a global `ErrorBoundary` component to catch and display unexpected errors without crashing the whole app
- [ ] `[frontend]` Add toast notifications using `react-hot-toast` for: upload success, validation complete, advisor approval received
- [ ] `[frontend]` Test and fix layout at 768px (tablet) and 375px (mobile) breakpoints across every page

### Accessibility (`alc-frontend`)
- [ ] `[frontend]` Run the `axe-core` browser extension on every page — fix all critical violations
- [ ] `[frontend]` Verify all text meets WCAG 2.1 AA contrast ratio: minimum 4.5:1 for normal text
- [ ] `[frontend]` Add `aria-label` to all icon-only buttons: notification bell, close modal, drag-and-drop zone
- [ ] `[frontend]` Ensure every form input has an associated `<label>` element — not just placeholder text
- [ ] `[frontend]` Test full keyboard navigation on every page: every interactive element reachable via Tab and operable via Enter
- [ ] `[frontend]` Add descriptive `alt` text to all images

### Security Audit
- [ ] `[backend]` Test for IDOR: as Student A, call `GET /submissions/{id}` with Student B's ID — assert `403`
- [ ] `[backend]` Test tenant isolation: as Tenant A user, call endpoints with Tenant B resource IDs — assert `403` or `404`
- [ ] `[ai]` Test malicious file upload: send `.exe` and a file with a spoofed MIME type to the validation endpoint — assert both rejected
- [ ] `[backend]` Test JWT forgery: change `role` claim to `SUPER_ADMIN`, sign with wrong secret — assert `401`
- [ ] `[backend]` Test SQL injection: submit special characters in all free-text fields — Spring JPA parameterized queries should block this, confirm manually
- [ ] `[backend]` Review every controller: confirm no endpoint is reachable without a valid JWT
- [ ] `[backend]` Add login rate limiting to `POST /auth/login`: block after 5 failed attempts per IP in 60 seconds using `Bucket4j`
- [ ] `[backend]` Add upload rate limiting to `POST /submissions/request-upload`: max 10 per student per hour
- [ ] `[backend]` Audit all response DTOs: confirm `password_hash` and internal fields never appear in any response body

### AWS Production Setup
- [ ] `[root]` Provision AWS RDS PostgreSQL 16 (`db.t3.micro`) in a private subnet — no public access
- [ ] `[root]` Create an ECS cluster with Fargate launch type in the same VPC
- [ ] `[backend]` Push `alc-backend` Docker image to AWS ECR and create an ECS task definition
- [ ] `[ai]` Push `alc-ai-service` Docker image to AWS ECR and create an ECS task definition
- [ ] `[frontend]` Run `npm run build` and deploy the `/build` folder to an S3 bucket with static website hosting enabled
- [ ] `[root]` Create a CloudFront distribution in front of the frontend S3 bucket — enforce HTTPS
- [ ] `[root]` Create an Application Load Balancer with HTTPS listener — provision SSL certificate via AWS ACM
- [ ] `[root]` Add Route 53 DNS records: domain → ALB (backend/AI), domain → CloudFront (frontend)
- [ ] `[root]` Create production S3 bucket `alc-documents-prod` with same versioning and access-block settings as dev
- [ ] `[root]` Set up CloudWatch log groups for both ECS services
- [ ] `[root]` Set up CloudWatch alarms: alert if p95 latency > 2s or error rate > 1%

### Monitoring & Observability
- [ ] `[backend]` Enable Spring Boot Actuator in production: expose `/actuator/health` and `/actuator/metrics`
- [ ] `[backend]` Configure `logback-spring.xml` to output structured JSON logs for CloudWatch Logs Insights
- [ ] `[ai]` Add structured JSON logging to FastAPI using Python's `logging` module with a JSON formatter
- [ ] `[root]` Create a CloudWatch dashboard: ECS CPU/memory, RDS connections, S3 request count, API p95 latency
- [ ] `[root]` Create an AWS SNS topic, subscribe team email addresses, and link all CloudWatch alarms to it

### Documentation
- [ ] `[root]` Write `/docs/setup-guide.md`: clone all four repos and run everything locally with docker-compose
- [ ] `[root]` Write `/docs/api-reference.md`: every backend endpoint with method, path, required role, and a curl example
- [ ] `[root]` Write `/docs/ai-service-reference.md`: every AI service endpoint with example request and response payloads
- [ ] `[root]` Write `/docs/deployment-guide.md`: step-by-step AWS production deployment from scratch
- [ ] `[root]` Update this README: add the final architecture diagram, screenshots of key screens, and a "Quick Start" section

### Thesis
- [ ] `[root]` Write Chapter 1 — Introduction: problem statement, motivation, objectives
- [ ] `[root]` Write Chapter 2 — Literature Review: compile from Phase 2 research docs
- [ ] `[root]` Write Chapter 3 — System Design: architecture, multi-repo structure, DB schema, API design
- [ ] `[root]` Write Chapter 4 — Implementation: key decisions, code excerpts, challenges per service
- [ ] `[root]` Write Chapter 5 — Results & Evaluation: load test results, usability findings, AI scoring accuracy
- [ ] `[root]` Write Chapter 6 — Conclusion: achievements, limitations, future work
- [ ] `[root]` Format bibliography with all sources in the agreed citation style

### Final Presentation
- [ ] `[root]` Record a demo video: register → submit → validation result → AI feedback → advisor approves → next stage unlocks
- [ ] `[root]` Prepare slide deck: Problem, Solution, Architecture, Live Demo, Results, Future Work
- [ ] `[root]` Rehearse the full presentation with all three team members and time it

---

## 📊 Progress Summary

| Phase | Primary Repo(s) | Tasks | Status |
|-------|----------------|-------|--------|
| Phase 0 — Setup | all | 55 tasks | 🔲 Not started |
| Phase 1 — Requirements | root | 29 tasks | 🔲 Not started |
| Phase 2 — Research | root, ai | 24 tasks | 🔲 Not started |
| Phase 3 — Core Backend | backend | 41 tasks | 🔲 Not started |
| Phase 4 — Prototype | backend, ai, frontend | 37 tasks | 🔲 Not started |
| Phase 5 — MVP | all | 48 tasks | 🔲 Not started |
| Phase 6 — Delivery | all | 41 tasks | 🔲 Not started |

**Total: ~275 tasks**

---

## 🗂️ Root Repo Folder Structure

```
alc/                          ← this repo (coordination only)
├── docs/
│   ├── adr/                  ← Architecture Decision Records
│   ├── architecture/         ← System diagram, ERD, DB schema
│   ├── requirements/         ← RBAC matrix, API contract, validation rules
│   ├── research/             ← Interview notes, pain points
│   ├── wireframes/           ← UI sketches
│   └── testing/              ← Load test scripts and results
├── infra/
│   └── load-tests/           ← k6 scripts
├── docker-compose.yml        ← Starts all 4 services together for local dev
├── Makefile
└── README.md                 ← This file
```

Application code lives in separate repos:

```
alc-frontend/     ← React TypeScript
alc-backend/      ← Spring Boot Maven
alc-ai-service/   ← Python FastAPI
```

---

## 👥 Team

| Name | Focus |
|------|-------|
| DOORGA Trithikraj | Backend — Spring Boot, multi-tenancy, security |
| NGUGI Janice | Frontend — React TypeScript, UI/UX, analytics |
| MEYE Jordy | AI/NLP — FastAPI, document validation, DevOps/AWS |

---

*Action Learning Cockpit — EPITA*
