# Cleaning Buddy

A mobile-first web application for managing cleaning tasks and schedules.

## Tech Stack

- **Client**: React PWA
- **API**: Express.js (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: 5/6/2026

## Project Structure

```
cleaning-buddy/
├── client/          # React PWA (Vite for local dev)
├── api/             # Express API (Node)
├── supabase/        # SQL migrations + seeds
├── docs/            # PRD, site map, OpenAPI, deployment notes
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/cleaning-buddy.git
   cd cleaning-buddy
   ```

2. Install dependencies:
   ```bash
   # Client
   cd client
   npm install
   
   # API
   cd ../api
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env files in both client/ and api/ directories
   # See .env.example files for required variables
   ```

4. Set up Supabase:
   - Create a new project in Supabase dashboard
   - Run migrations from `supabase/migrations/`
   - Update environment variables with your Supabase credentials

### Development

1. Start the API server:
   ```bash
   cd api
   npm run dev
   ```

2. Start the client development server:
   ```bash
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Features

- [ ] Task management and scheduling
- [ ] Mobile-responsive design
- [ ] PWA capabilities (offline support, installable)
- [ ] User authentication
- [ ] Real-time updates
- [ ] Task categorization and prioritization



## Deployed Application

**Live site:** [https://main.dvg5rwtyx89kk.amplifyapp.com](https://main.dvg5rwtyx89kk.amplifyapp.com)

### Features Implemented
- OTP email authentication (register → 6-digit code → verify)
- Cleanliness quiz with 5 neatness categories
- Dwelling type selection (Studio, Apartment, House) with room sets
- Room-based task checklists with cross-device sync via Supabase
- Quick-add custom tasks per room (synced to DB)
- Task postponement with calendar date picker (synced to DB)
- Weekly cleaning health score and analytics dashboard
- Cleaning tips library with per-tip task application
- Notification settings (push on/off, in-app on/off, sound preference) synced across devices
- Browser notifications with service worker for PWA install support
- Sign out from header or Profile settings tab
- Settings page: profile edits, cleaning day/time, dwelling type, notification preferences

### Known Issues / Limitations
- Browser notifications only fire while the app is open or running in the background as a PWA. Notifications when the app is fully closed would require a Web Push backend (not implemented).
- No real-time sync across open tabs — changes made in one tab appear on the other after a page refresh.
- Analytics health score reflects the current week's completions; historical trend data is not stored.

### Incomplete Features
- Web Push (server-side push notifications when app is closed)
- Real-time multi-tab sync (would require Supabase Realtime subscriptions)

---

## Local Setup

### Prerequisites
- Node.js v18+
- npm
- A Supabase project (or use the shared one — ask for credentials)

### Installation

```bash
git clone https://github.com/YOUR-USERNAME/cleaning-buddy.git
cd cleaning-buddy

# Install client dependencies
cd client && npm install

# Install API dependencies
cd ../api && npm install
```

### Environment Variables

Create `client/.env` (copy from `client/.env.example`):
```
VITE_SUPABASE_URL=https://diimfyzkupypitnnodlk.supabase.co
VITE_SUPABASE_ANON_KEY=[get from Supabase dashboard → Settings → API]
VITE_API_BASE_URL=http://localhost:3000
```

### Run Locally

```bash
# Terminal 1 — API
cd api && npm run dev

# Terminal 2 — Client
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Troubleshooting

**OTP email not arriving**
- Check your spam folder
- Supabase has a rate limit of 3 emails/hour on the free plan — wait and retry
- Confirm your email was entered correctly on the register page

**"NetworkError" / API calls failing**
- Verify `VITE_API_BASE_URL` is set correctly in your `.env`
- For production: confirm the env var is set in the Amplify console (not just locally)

**Tasks not saving / loading**
- Open browser DevTools → Console for error details
- Supabase RLS requires a valid session — make sure you're logged in
- If you cleared cookies/localStorage, log out and back in

**Notifications not prompting**
- The browser permission dialog appears once on first login — if you dismissed it, go to Settings → Notifications → Save Notifications (with Push enabled) to re-trigger it
- On iOS, the app must be installed to your home screen (Add to Home Screen) for notifications to work

---

## Support
For questions or issues: **aliyahcardenas66@gmail.com**