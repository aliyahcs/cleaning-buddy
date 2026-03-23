# Cleaning Buddy - Product Requirements Document

## Project Overview

**Project Title:** Cleaning Buddy

**Description:** Cleaning Buddy is a mobile-first web application that helps users manage and track cleaning tasks on a weekly basis. Users take a cleanliness quiz to determine their "Neat Freak Score" (rated 0-100 across five categories: Minimalist Maintainer, Casual Cleaner, Routine Ready, Neat Freak, and Spotless Specialist), select their dwelling type, prioritize their top 2 rooms, and choose their weekly cleaning day. The app provides room-specific task checklists, limited postponement options, push notifications, a cleanliness health score, analytics on completion trends, and cleaning tips.

## Technical Architecture

### Frontend
- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Deployment:** Progressive Web App (PWA) for mobile-first experience
- **Styling:** Responsive CSS for mobile, tablet, and desktop
- **Key Features:** Offline access to current week's checklist via service workers

### Backend
- **Framework:** Express.js with Node.js
- **API Design:** RESTful API endpoints
- **Authentication:** Supabase Auth for user registration, login, and password reset
- **Real-time Features:** Supabase Realtime for live updates

### Database
- **Platform:** Supabase (PostgreSQL)
- **Schema:** Users, tasks, rooms, checklists, completion tracking, analytics data
- **Features:** Row-level security, automated timestamps, task scheduling

### Key Constraints
- **Mobile-first design:** Optimized for smartphones with responsive desktop support
- **Weekly scheduling:** Tasks organized by week to minimize notification overload
- **Limited postponement:** Only two options allowed ("This time tomorrow" or "This time next week")
- **Notification limits:** One push notification per week maximum
- **Offline functionality:** Basic checklist access and task completion without internet
- **Predefined checklists:** Room-specific task lists (Kitchen: 11 tasks, Bathroom: 7, Bedroom: 8, Living Room: 5, Laundry: 5)

## User Constituencies

- **Single daters:** Users who want to maintain a clean living space to impress dates
- **College students:** Students who need organized cleaning schedules alongside coursework
- **Organization-focused individuals:** Anyone wanting to stay organized and prevent cleaning tasks from piling up