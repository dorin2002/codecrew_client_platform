# Deployment Guide

This guide explains how to deploy CodeCrew Portal using free tiers of Vercel, Render, and Neon.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     Vercel      │     │     Render      │     │      Neon       │
│   (Frontend)    │────▶│     (API)       │────▶│   (Database)    │
│   Next.js 16    │     │    NestJS       │     │   PostgreSQL    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Prerequisites

- GitHub account (with repo access or fork)
- Vercel account (free): https://vercel.com
- Render account (free): https://render.com
- Neon account (free): https://neon.tech

## Step 1: Setup Neon Database

1. Go to https://console.neon.tech
2. Sign up with GitHub
3. Click **Create Project**
   - Name: `codecrew-portal`
   - Region: Select closest to you (e.g., `eu-central-1` for Europe)
4. Once created, copy the **Connection String** (looks like):
   ```
   postgresql://username:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
5. Save this - you'll need it for Render

### Neon Free Tier Limits (2025)
- 0.5 GB storage per project
- 100 compute hours/month
- Auto-scales to zero when idle

## Step 2: Deploy API on Render

1. Go to https://dashboard.render.com
2. Click **New → Web Service**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| Name | `codecrew-api` |
| Region | `Frankfurt (EU Central)` |
| Branch | `main` |
| Root Directory | `apps/api` |
| Runtime | `Node` |
| Build Command | `cd ../.. && pnpm install && pnpm run build --filter=api` |
| Start Command | `node dist/main.js` |
| Plan | `Free` |

5. Add Environment Variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `DATABASE_URL` | *(paste your Neon connection string)* |
| `DB_SYNCHRONIZE` | `true` |
| `FRONTEND_URL` | *(leave empty, add after Vercel deploy)* |
| `JWT_SECRET` | *(click Generate)* |

6. Click **Create Web Service**
7. Wait for deploy (5-10 minutes)
8. Copy your API URL: `https://codecrew-api.onrender.com`

### Render Free Tier Notes
- Spins down after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- 750 hours/month free

## Step 3: Deploy Frontend on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:

| Setting | Value |
|---------|-------|
| Framework Preset | `Next.js` |
| Root Directory | `apps/web` |
| Build Command | *(leave default, uses vercel.json)* |
| Install Command | *(leave default, uses vercel.json)* |

4. Add Environment Variable:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://codecrew-api.onrender.com/api` |

5. Click **Deploy**
6. Wait for deploy (2-3 minutes)
7. Copy your frontend URL: `https://your-project.vercel.app`

## Step 4: Connect Frontend URL to API

1. Go back to Render → Your API service → Environment
2. Add/Update:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://your-project.vercel.app` |

3. Click **Save Changes** → Service will redeploy

## Step 5: Run Database Migrations

After first deploy, you need to create database tables:

### Option A: Via Render Shell
1. Go to Render → Your API service → Shell
2. Run: `cd ../.. && pnpm run migration:run --filter=api`

### Option B: Auto-sync (Development only)
The `DB_SYNCHRONIZE=true` setting auto-creates tables from entities.
> ⚠️ Set to `false` in production after initial setup!

## Verification

1. **API Health Check**: Visit `https://codecrew-api.onrender.com/api/health`
   - Should return: `{"status":"ok"}`

2. **Frontend**: Visit your Vercel URL
   - Should show the dashboard

3. **API Connection**: Check dashboard stats load correctly

## Troubleshooting

### "CORS Error" in browser console
- Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Include `https://` prefix

### "Database connection failed"
- Verify `DATABASE_URL` is correct in Render
- Ensure Neon project is active
- Check if `?sslmode=require` is in the connection string

### "Module not found" on build
- Ensure `pnpm-lock.yaml` is committed
- Check Root Directory setting is correct

### First request is slow
- Normal for Render free tier (cold start)
- Service spins down after 15 min inactivity

## Environment Variables Summary

### Render (API)
```
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://...@neon.tech/...?sslmode=require
DB_SYNCHRONIZE=true
FRONTEND_URL=https://your-project.vercel.app
JWT_SECRET=<generated>
```

### Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://codecrew-api.onrender.com/api
```

## Auto-Deploy

Both Vercel and Render auto-deploy when you push to the `main` branch:
- Push code → GitHub webhook → Automatic rebuild & deploy
- Preview deployments available for pull requests (Vercel)

## Costs

| Service | Free Tier |
|---------|-----------|
| Vercel | Unlimited hobby projects |
| Render | 750 hours/month |
| Neon | 0.5 GB storage, 100 compute hours/month |

All services are free for development and small production apps.
