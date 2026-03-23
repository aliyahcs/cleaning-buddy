# Cleaning Buddy - Deployment Guide

## 1. Overview

This guide covers the deployment process for the Cleaning Buddy application, including the React PWA client, Express API, and Supabase database setup.

## 2. Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- Domain name (for production)
- SSL certificate (for production)
- CI/CD pipeline (recommended)

## 3. Environment Configuration

### 3.1 Environment Variables

#### Client Environment Variables (.env)
```bash
# API Configuration
VITE_API_BASE_URL=https://api.cleaningbuddy.com/v1

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
VITE_APP_NAME=Cleaning Buddy
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Mobile-first cleaning task management app

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
```

#### API Environment Variables (.env)
```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Security
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=https://cleaningbuddy.com

# Logging
LOG_LEVEL=info
```

## 4. Database Setup (Supabase)

### 4.1 Create Supabase Project

1. Sign up for a Supabase account at https://supabase.com
2. Create a new project
3. Note down the project URL and API keys

### 4.2 Run Database Migrations

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push

# Seed data (optional)
supabase db seed
```

### 4.3 Configure Authentication

1. Go to Authentication > Settings in Supabase dashboard
2. Configure your site URL: `https://cleaningbuddy.com`
3. Configure redirect URLs: `https://cleaningbuddy.com/auth/callback`
4. Enable email/password authentication
5. Configure email templates as needed

### 4.4 Set Up Row Level Security (RLS)

The migration files include RLS policies. Verify they are enabled:
1. Go to Authentication > Policies in Supabase dashboard
2. Ensure all tables have RLS enabled
3. Review policy configurations

## 5. API Deployment

### 5.1 Build for Production

```bash
cd api
npm run build
```

### 5.2 Deployment Options

#### Option 1: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option 2: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option 3: DigitalOcean App Platform
1. Create a new App in DigitalOcean dashboard
2. Connect your GitHub repository
3. Configure build command: `npm run build`
4. Configure run command: `npm start`
5. Set environment variables
6. Deploy

#### Option 4: Custom VPS (Docker)
```dockerfile
# Dockerfile for API
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t cleaning-buddy-api .
docker run -p 3001:3001 --env-file .env cleaning-buddy-api
```

### 5.3 API Health Check

After deployment, verify the API is running:
```bash
curl https://api.cleaningbuddy.com/api/health
```

## 6. Client Deployment

### 6.1 Build for Production

```bash
cd client
npm run build
```

### 6.2 Deployment Options

#### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option 2: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option 3: GitHub Pages
```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run deploy
```

#### Option 4: Custom CDN/Hosting
1. Upload the `dist` folder to your hosting provider
2. Configure single-page application routing
3. Set up proper caching headers
4. Configure HTTPS

### 6.3 PWA Configuration

Ensure PWA features are properly configured:

#### Service Worker Registration
```javascript
// src/main.ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

#### Manifest Configuration
```json
// public/manifest.json
{
  "name": "Cleaning Buddy",
  "short_name": "CleaningBuddy",
  "description": "Mobile-first cleaning task management app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 7. CI/CD Pipeline

### 7.1 GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Cleaning Buddy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd client && npm ci
          cd ../api && npm ci
      
      - name: Run tests
        run: |
          cd client && npm test
          cd ../api && npm test

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy API to Railway
        uses: railway-app/railway-action@v1
        with:
          api-token: ${{ secrets.RAILWAY_TOKEN }}
          service: cleaning-buddy-api

  deploy-client:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install and build
        run: |
          cd client
          npm ci
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./client
```

### 7.2 Environment Secrets

Configure these secrets in your CI/CD platform:
- `RAILWAY_TOKEN`
- `VERCEL_TOKEN`
- `ORG_ID`
- `PROJECT_ID`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 8. Monitoring and Logging

### 8.1 Application Monitoring

#### API Monitoring
```javascript
// Add monitoring middleware
import { createPrometheusMetrics } from './monitoring';

app.use(createPrometheusMetrics());
```

#### Error Tracking (Sentry)
```javascript
// Client-side error tracking
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV,
});
```

### 8.2 Logging

#### Structured Logging
```javascript
// API logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## 9. Security Considerations

### 9.1 HTTPS
- Enforce HTTPS on all endpoints
- Use HSTS headers
- Configure proper SSL certificates

### 9.2 CORS Configuration
```javascript
// API CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### 9.3 Rate Limiting
```javascript
// Add rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 9.4 Input Validation
```javascript
// Validate all inputs
import { body, validationResult } from 'express-validator';

app.post('/tasks', [
  body('title').notEmpty().trim().escape(),
  body('description').optional().trim().escape(),
  body('priority').isIn(['low', 'medium', 'high']),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

## 10. Performance Optimization

### 10.1 Caching Strategy
- Implement API response caching
- Use CDN for static assets
- Enable browser caching with proper headers

### 10.2 Database Optimization
- Add database indexes
- Optimize queries
- Implement connection pooling

### 10.3 Asset Optimization
- Compress images
- Minify CSS and JavaScript
- Use lazy loading for images

## 11. Backup and Recovery

### 11.1 Database Backups
- Enable automatic backups in Supabase
- Test backup restoration regularly
- Document recovery procedures

### 11.2 Disaster Recovery
- Maintain multiple deployment environments
- Document rollback procedures
- Create incident response plan

## 12. Maintenance

### 12.1 Regular Tasks
- Update dependencies
- Monitor security vulnerabilities
- Review and optimize performance
- Update SSL certificates

### 12.2 Updates and Patches
- Schedule regular maintenance windows
- Test updates in staging environment
- Communicate maintenance to users

## 13. Troubleshooting

### 13.1 Common Issues

#### API Not Responding
- Check server logs
- Verify environment variables
- Test database connectivity

#### PWA Not Installing
- Verify manifest.json configuration
- Check service worker registration
- Ensure HTTPS is properly configured

#### Authentication Issues
- Verify Supabase configuration
- Check CORS settings
- Review JWT token handling

### 13.2 Debugging Tools
- Browser developer tools
- API testing tools (Postman, curl)
- Database query analysis
- Performance monitoring tools

## 14. Scaling Considerations

### 14.1 Horizontal Scaling
- Load balancer configuration
- Multiple API instances
- Database read replicas

### 14.2 Vertical Scaling
- Monitor resource usage
- Upgrade server specifications
- Optimize database performance

### 14.3 CDN Usage
- Distribute static assets globally
- Reduce server load
- Improve user experience
