<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

# PCareer Microservices

<em>Job portal backend split into independent services</em>

</div>
<br>

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
    - [Project Index](#project-index)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

This project is a microservices-based job portal backend built with Node.js (Express) and TypeScript. It supports authentication + profiles, job posting, job applications, event-driven email notifications (Kafka), and utility endpoints for file uploads and AI assistance.

Services:
- `auth`: registration/login/OTP verification + forgot/reset password (Redis) + Kafka producer for email events
- `user`: user profile, skills, resume/profile-pic upload (forwarded to an upload service)
- `job`: recruiter job + company CRUD and job application management
- `utils`: upload service (Cloudinary), Kafka consumer to send emails, and AI endpoints (Gemini)

---

## Features

- JWT-based authentication with role-based access (`jobseeker`, `recruiter`)
- OTP verification flow for recruiter registration
- Forgot/reset password flow using short-lived tokens stored in Redis
- File upload pipeline for resume (PDF) and profile pictures (images) using in-memory `multer` + external upload service
- Relational data model in Neon Postgres (users, skills, companies, jobs, applications)
- Job application workflow with duplicate protection + subscription-aware ordering
- Event-driven email notifications using Kafka (`send-mail` topic)
- AI-powered utilities (career advice + resume analyzer) via Google Gemini

---

## Project Structure

```sh
└── Microservice/
    ├── frontend/
    ├── services/
    │   ├── auth/
    │   ├── user/
    │   ├── job/
    │   ├── utils/
    │   └── docker-compose.yaml
    └── README.md
```

### Project Index

<details open>
	<summary><b><code>services/</code></b></summary>
	<blockquote>
		<table style='width: 100%; border-collapse: collapse;'>
		<thead>
			<tr style='background-color: #f8f9fa;'>
				<th style='width: 30%; text-align: left; padding: 8px;'>Service</th>
				<th style='text-align: left; padding: 8px;'>Responsibilities</th>
			</tr>
		</thead>
			<tr style='border-bottom: 1px solid #eee;'>
				<td style='padding: 8px;'><b><code>auth</code></b></td>
				<td style='padding: 8px;'>Auth, OTP verification, password reset, Kafka producer</td>
			</tr>
			<tr style='border-bottom: 1px solid #eee;'>
				<td style='padding: 8px;'><b><code>user</code></b></td>
				<td style='padding: 8px;'>Profile management, skills, resume/profile-pic upload</td>
			</tr>
			<tr style='border-bottom: 1px solid #eee;'>
				<td style='padding: 8px;'><b><code>job</code></b></td>
				<td style='padding: 8px;'>Recruiter APIs for companies/jobs + application updates</td>
			</tr>
			<tr style='border-bottom: 1px solid #eee;'>
				<td style='padding: 8px;'><b><code>utils</code></b></td>
				<td style='padding: 8px;'>Upload service (Cloudinary), Kafka consumer (emails), Gemini endpoints</td>
			</tr>
		</table>
	</blockquote>
</details>

---

## Getting Started

### Prerequisites

- Node.js (for local dev / frontend)
- Docker + Docker Compose (to run Kafka and service containers)
- External dependencies:
  - Neon Postgres connection string (`DB_URL`)
  - Redis (`REDIS_URL`) for forgot/reset password tokens
  - Cloudinary credentials (`CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`)
  - Google Gemini API key (`GEMINI_API_KEY`)
  - SMTP credentials for nodemailer (`NODEMAILER_USER`, `NODEMAILER_PASS`)

### Installation

1. Start the microservices stack (Kafka + containers):

```sh
cd services
docker compose up --build
```

2. Ensure the following environment variables are configured for the containers:

- Common:
  - `DB_URL` (Neon Postgres)
- `auth`:
  - `REDIS_URL` (Redis)
  - `JWT_SECRET`, `JWT_RESET_SECRET`
  - `FRONTEND_URL`
- `job` and `user`:
  - `UPLOAD_SERVICE` (base URL of `utils` upload endpoint)
- `utils`:
  - `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `GEMINI_API_KEY`

### Usage

- `auth` API: `http://localhost:8002`
- `utils` API: `http://localhost:8003`
- `user` API: `http://localhost:8004`
- `job` API: `http://localhost:8005`
- Frontend (Next.js): from `frontend/` run:

```sh
cd frontend
npm install
npm run dev
```

---

## Roadmap

- Add health checks + readiness endpoints for each microservice
- Add request/response logging with correlation IDs across services
- Add automated integration tests for Kafka email flow

---

## Contributing

- Fork the repository
- Create a feature branch
- Submit a pull request

If you want, describe which workflows you implemented and we can expand the `Features` section accordingly.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- KafkaJS, Express, Neon Postgres serverless, Cloudinary, Nodemailer, and Google Gemini

<div align="right">

[![][back-to-top]](#top)

</div>

[back-to-top]: https://img.shields.io/badge/-BACK_TO_TOP-151515?style=flat-square

