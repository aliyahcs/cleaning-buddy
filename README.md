# Cleaning Buddy

A mobile-first web application for managing cleaning tasks and schedules.

## Tech Stack

- **Client**: React PWA with Vite
- **API**: Express.js (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Deployment**: TBD

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
