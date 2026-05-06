# Deployment Guide - Cleaning Buddy

## Live URLs

| Service | URL |
|---|---|
| **Frontend (Amplify)** | https://main.dvg5rwtyx89kk.amplifyapp.com |
| **API (API Gateway)** | https://wrvp30car7.execute-api.us-east-1.amazonaws.com |
| **Supabase Project** | https://diimfyzkupypitnnodlk.supabase.co |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/diimfyzkupypitnnodlk |

## AWS Resource IDs

| Resource | ID / Name |
|---|---|
| **Amplify App ID** | `dvg5rwtyx89kk` |
| **API Gateway ID** | `wrvp30car7` |
| **Lambda Function** | `cleaning-buddy-api-prod-api` |
| **Secrets Manager Secret** | `cleaning-buddy/api/prod` |
| **Region** | `us-east-1` |

## Supabase Details

| Item | Value |
|---|---|
| **Project ID** | `diimfyzkupypitnnodlk` |
| **Project Name** | `cleaning-buddy` |
| **Region** | `us-east-1` |
| **Auth Provider** | Email OTP (magic link / 6-digit code) |

**Key tables:** `users`, `user_profiles`, `user_room_priorities`, `user_notification_preferences`, `task_templates`, `user_task_completions`, `user_custom_tasks`, `rooms`, `dwelling_types`, `cleaner_categories`

Migrations are in `supabase/migrations/`. Row Level Security (RLS) is enabled on all user data tables.

## Environment Variables

### Frontend — set in Amplify Console (Environment Variables)
```
VITE_SUPABASE_URL=https://diimfyzkupypitnnodlk.supabase.co
VITE_SUPABASE_ANON_KEY=[anon key — in Amplify console]
VITE_API_BASE_URL=https://wrvp30car7.execute-api.us-east-1.amazonaws.com
```

### Backend — stored in AWS Secrets Manager (`cleaning-buddy/api/prod`)
```
SUPABASE_URL
SUPABASE_SECRET_KEY
NODE_ENV
CORS_ORIGIN
```

No secrets are committed to git. The `.env` file in `client/` is gitignored.

## Deployment Commands

### Deploy Frontend
```bash
git push origin main
# Amplify auto-deploys on push to main
```

### Deploy API (Lambda via Serverless Framework)
```bash
cd api
npm install
serverless deploy
```

### Rollback API
```bash
cd api
serverless rollback --timestamp [TIMESTAMP]
```

### Rollback Frontend
AWS Amplify Console → App → main branch → Deployments → select a previous build → Redeploy

## Troubleshooting

| Symptom | Fix |
|---|---|
| CORS errors on API calls | Check `serverless.yml` `allowedOrigins` includes the Amplify URL; verify `VITE_API_BASE_URL` env var in Amplify console |
| Supabase connection fails | Check `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in Amplify env vars; verify secret in AWS Secrets Manager |
| OTP emails not arriving | Check Supabase → Authentication → Email rate limits; confirm redirect URL matches app domain in Supabase Auth settings |
| Amplify build fails | Check build logs in Amplify console; verify `client/` build command is `npm run build` with output dir `dist` |
| Lambda cold start errors | Check CloudWatch logs for the `cleaning-buddy-api-prod-api` function in `us-east-1` |
