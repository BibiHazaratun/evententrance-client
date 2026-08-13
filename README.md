# EventEntrance

A QR-based event attendance management system. Organizers create events and track attendance in real time. Attendees register and receive a unique QR code for entry.

**Live app:** https://evententrance-client-p3kn.vercel.app
**Backend API:** https://evententrance-server.onrender.com

## Features

- JWT-based authentication with role-based access (organizer / attendee)
- Event creation, listing, and detail views
- QR code registration — each attendee gets a unique code on sign-up
- Email confirmation with embedded QR code (Resend API)
- Camera-based QR scanning for check-in
- Organizer dashboard with live registration and attendance stats
- Duplicate registration protection

## Tech Stack

**Frontend:** React (Vite), React Router, Axios, Tailwind CSS, html5-qrcode
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, Resend API, `qrcode`
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Architecture

Two separate repositories, deployed independently:

- `evententrance-client` — React SPA, calls the backend through a configurable `VITE_API_URL` environment variable
- `evententrance-server` — Express REST API, connects to MongoDB Atlas and Resend for email

## API Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive JWT | Public |
| POST | `/api/events` | Create an event | Organizer |
| GET | `/api/events` | List all events | Public |
| GET | `/api/events/:id` | Get event details | Public |
| GET | `/api/events/dashboard/my` | Organizer's events with stats | Organizer |
| POST | `/api/registrations/:eventId` | Register for an event (generates QR) | Authenticated |
| GET | `/api/registrations/my` | Get logged-in user's registrations | Authenticated |
| POST | `/api/registrations/scan/:qrCode` | Mark attendance via QR scan | Organizer |

## Setup

Clone both repos and install dependencies:

```bash
git clone https://github.com/BibiHazaratun/evententrance-server.git
git clone https://github.com/BibiHazaratun/evententrance-client.git
```

**Server** — create a `.env` file in `evententrance-server`:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RESEND_API_KEY=your_resend_api_key
CLIENT_URL=http://localhost:5173
PORT=5000
```

```bash
cd evententrance-server
npm install
node server.js
```

**Client** — create a `.env` file in `evententrance-client`:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
cd evententrance-client
npm install
npm run dev
```

## Key Challenges Solved

A few bugs surfaced during deployment and testing that were worth documenting:

**Hardcoded API base URL.** The Axios instance had `baseURL: 'http://localhost:5000/api'` written directly into the code instead of reading from `import.meta.env.VITE_API_URL`. Setting the environment variable in Vercel had no effect because the code never checked for it — every request from the deployed frontend was silently going to `localhost:5000`, which only worked by coincidence when a local server happened to be running. Fixed by reading the env variable with a local fallback: `import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`.

**Stale registration state after revisit.** The event details page only tracked "already registered" in local component state, set right after a successful POST. Refreshing the page or navigating back lost that state, so the register button reappeared and a second registration attempt was possible. Fixed by fetching the user's existing registrations on page load and checking for a match against the current event before rendering the button.

**QR code missing from "My Registrations."** The QR image was generated and returned only inside the POST /registrations response (and emailed), never persisted to the database or included in the GET /registrations/my response. Fixed by regenerating the QR image server-side from the stored `qrCode` value whenever registrations are fetched.

**404 on direct navigation to client-side routes.** Vercel served a 404 for any URL other than the root (`/my-registrations`, `/events/:id`) because it had no way of knowing these were React Router routes rather than real files. Fixed by adding a `vercel.json` rewrite rule that serves `index.html` for all paths, letting React Router handle routing client-side.

## Related

Backend repository: [evententrance-server](https://github.com/BibiHazaratun/evententrance-server)