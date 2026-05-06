# Cleaning Buddy - Site Map

## Pages & Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing page | No (redirects to `/dashboard` if logged in) |
| `/login` | Login | No (redirects to `/dashboard` if logged in) |
| `/register` | Register | No (redirects to `/dashboard` if logged in) |
| `/otp-verification?email=` | Email OTP verification | No |
| `/reset-password` | Password reset | No |
| `/setup` | Initial setup flow | No |
| `/dashboard` | Dashboard | Yes |
| `/tasks` | My Tasks | Yes |
| `/room-checklists` | Room Checklists | Yes |
| `/analytics` | Analytics | Yes |
| `/tips` | Cleaning Tips | Yes |
| `/settings` | Settings | Yes |
| `/help` | Help & FAQs | Yes |
| `*` | Catch-all redirect → `/` | — |

---

## Page Descriptions

### Landing (`/`)
Marketing landing page. Redirects authenticated users to `/dashboard`.

### Login (`/login`)
Email + password login form with "Forgot password" link → `/reset-password`.

### Register (`/register`)
Email, password, first/last name. On success navigates to `/otp-verification`.

### OTP Verification (`/otp-verification?email=`)
6-digit code entry with countdown timer (5 min), paste support, resend option. On success navigates to `/setup`.

### Password Reset (`/reset-password`)
Email entry to receive a reset link via Supabase Auth.

### Initial Setup Flow (`/setup`)
Multi-step wizard:
1. Cleanliness quiz (8 questions → Neat Freak Score 0–100, one of 5 categories)
2. Dwelling type selection (Studio, Apartment, House)
3. Priority room selection (top 2 rooms)
4. Cleaning day + time selection

### Dashboard (`/dashboard`)
- Priority room cards with live completion counts
- Total tasks and completed tasks across all rooms
- Link to Room Checklists

### My Tasks (`/tasks`)
- One card per room showing task count and completion count
- Links to Room Checklists filtered to each room

### Room Checklists (`/room-checklists`)
- Room selector (Kitchen, Bathroom, Bedroom, Living Room, Laundry)
- Task list with checkboxes per room (36 tasks total)
- Postpone button per task (opens date picker)
- Quick-add custom tasks per room (synced to DB)
- Tip tasks applied from the Tips page appear here

### Analytics (`/analytics`)
- Weekly Health Score (from Neat Freak quiz)
- Tasks This Week count
- Room Performance — per-room completion progress bars
- Monthly Trends — bar chart of completion % for last 6 months

### Tips (`/tips`)
- Cleaning tips library
- Each tip can be applied as a custom task to a specific room

### Settings (`/settings`)
Three tabs:
- **Profile**: First/last name, email (read-only), cleaning day, cleaning time, dwelling type, priority rooms (read-only), Save Profile, Sign Out
- **Notifications**: Push on/off, in-app on/off, sound selection, reminder time display, Save Notifications
- **About**: App info, version, features list

### Help (`/help`)
FAQs and usage documentation.

---

## Navigation

All authenticated pages share a top header nav:
**Cleaning Buddy logo** → Dashboard | My Tasks | Checklists | Analytics | Tips | Settings | Help | **Sign Out**

The active page is highlighted in the nav.

---

## Auth Flow

```
Register → OTP Verification → Setup → Dashboard
Login → Dashboard
Forgot Password → Password Reset email → /reset-password (link from email)
Any page → Sign Out → /login
```
