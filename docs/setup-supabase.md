# Supabase Setup Guide

This guide walks through setting up Supabase for the VC LinkedIn Intelligence Platform.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in project details:
   - **Name**: `vc-linkedin-intel` (or your preferred name)
   - **Database Password**: Generate a strong password and save it securely
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

5. Wait 2-3 minutes for project provisioning

## Step 2: Get Connection Credentials

Once your project is created:

### Get API Credentials

1. Go to **Project Settings** → **API**
2. Copy the following values:
   - **Project URL**: `https://[your-project-ref].supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)

### Get Database Connection String

1. Go to **Project Settings** → **Database**
2. Scroll to **Connection string**
3. Select **Connection pooling** mode (recommended for serverless)
4. Copy the connection string (looks like):
   ```
   postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
   ```

## Step 3: Configure Environment Variables

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_CONNECTION_STRING=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
WEBHOOK_SECRET=your-random-secret-for-n8n
```

Generate a random webhook secret:

```bash
openssl rand -hex 32
```

## Step 4: Install Supabase CLI

```bash
npm install -g supabase
```

Or use Homebrew (macOS):

```bash
brew install supabase/tap/supabase
```

## Step 5: Link Your Project

```bash
supabase login
supabase link --project-ref [your-project-ref]
```

Find your project ref in the Project URL: `https://[project-ref].supabase.co`

## Step 6: Run Database Migrations

Apply the database schema from our migration files:

```bash
supabase db push
```

This will:
- Create the `vc_companies` table
- Create the `post_categories` table
- Create the `posts` table
- Seed initial post categories

Verify the migration succeeded:

```bash
supabase db pull
```

## Step 7: Verify Database Setup

### Option A: Using Supabase Dashboard

1. Go to **Table Editor** in your Supabase dashboard
2. You should see three tables:
   - `vc_companies`
   - `post_categories`
   - `posts`
3. Click on `post_categories` - it should have 6 pre-seeded rows

### Option B: Using SQL Editor

1. Go to **SQL Editor**
2. Run this query:

```sql
SELECT * FROM post_categories;
```

You should see 6 categories: Events, Portfolio, Founders, Thought Leadership, Hiring, Other.

## Step 8: Set Up Row Level Security (RLS)

RLS is already enabled in the migrations, but policies are permissive (allow all).

For production, you'll want to add authentication and restrict access:

```sql
-- Example: Only allow authenticated users to read
DROP POLICY IF EXISTS "Allow all operations on posts" ON public.posts;

CREATE POLICY "Authenticated users can read posts" ON public.posts
    FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert posts" ON public.posts
    FOR INSERT
    WITH CHECK (auth.role() = 'service_role');
```

## Step 9: Test Database Connection

### Using psql

```bash
psql "$SUPABASE_CONNECTION_STRING"
```

Then run:

```sql
SELECT COUNT(*) FROM post_categories;
```

Should return `6`.

### Using Next.js API

Once the app is running:

```bash
npm run dev
```

Navigate to `http://localhost:3000/api/webhook` (should return 405 Method Not Allowed - expected).

## Step 10: (Optional) Local Development with Supabase CLI

For local development without using the cloud database:

```bash
supabase init
supabase start
```

This starts a local Supabase instance with Docker. Update `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=[shown in terminal output]
```

## Troubleshooting

### Issue: "Migration failed"

**Solution:** Check if tables already exist:

```sql
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS post_categories CASCADE;
DROP TABLE IF EXISTS vc_companies CASCADE;
```

Then re-run `supabase db push`.

### Issue: "Connection timeout"

**Solution:** Ensure you're using the **Connection pooling** string (port 6543), not the direct connection (port 5432).

### Issue: "Password authentication failed"

**Solution:** Reset your database password in **Project Settings** → **Database** → **Reset Database Password**.

## Next Steps

- Read `docs/schema.md` for detailed table structures
- Read `docs/architecture.md` for data flow
- Set up n8n webhook to start ingesting LinkedIn data

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
