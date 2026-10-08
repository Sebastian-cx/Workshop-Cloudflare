# 🚀 OSINT Workshop Registration Platform

A production-ready, Cloudflare-compatible **OSINT Workshop Registration Website** built with React, Vite, TypeScript, Tailwind CSS, Cloudflare Workers API, and Cloudflare D1 SQLite database.

Features a dark cybersecurity-inspired UI (cyan glow accents, terminal badges, glassmorphism panels, countdown timer) and an interactive **Admin Control Dashboard** where every workshop setting and registration field can be dynamically toggled without editing source code.

---

## ⚡ Tech Stack & Cloudflare Architecture

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Canvas-Confetti, React Hook Form, Zod.
- **Backend API**: Cloudflare Workers (ES Modules format).
- **Database**: Cloudflare D1 (Serverless SQLite).
- **Security & Bot Protection**: Cloudflare Turnstile integration & Admin Password Token Authentication.
- **CLI & Deployment**: Wrangler CLI, Vite bundler.

---

## 🛠️ Local Development & Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

> 💡 **Dual-Mode Local Fallback**: In local dev mode, the app uses an internal reactive LocalStorage mock so you can test all public forms, admin toggles, registrations, and CSV export without needing an active Cloudflare login!

---

## ☁️ Cloudflare D1 & Deployment Setup

### Step 1: Login to Cloudflare Wrangler
```bash
npx wrangler login
```

### Step 2: Create Cloudflare D1 Database
Create a D1 database named `osint-workshop-db`:
```bash
npx wrangler d1 create osint-workshop-db
```
*Note down the returned `database_id` and update `wrangler.jsonc` if needed.*

### Step 3: Apply D1 Database Migrations
Initialize database tables for workshop settings, field configurations, and participant registrations:

```bash
# Apply to local Wrangler D1 database:
npm run d1:migrate:local

# Apply to Cloudflare Remote Production D1 database:
npm run d1:migrate:prod
```

### Step 4: Configure Production Admin Password (Optional)
Set a custom secret password for the admin dashboard:
```bash
npx wrangler secret put ADMIN_PASSWORD
```

### Step 5: Deploy to Cloudflare Workers & Pages
Build the production frontend bundle and deploy the worker API:
```bash
npm run deploy
```

---

## 🔒 Admin Dashboard Usage

1. Click **Admin Portal** in the top navigation header or footer.
2. Select your administrative role (**Super Admin** or **Event Moderator**) and enter your secure access key.
3. Use the tabs inside the Admin Console:
   - **Analytics & Overview**: View total registered seats, capacity, spots left, college breakdown, and master registration ON/OFF switch.
   - **Workshop Info & Toggles**: Edit Workshop Name, Description, Date, Time, Venue, Fee, Deadline, Limit, Organizer, and toggle visibility ON/OFF for each detail card.
   - **Registration Form Fields**: Enable/Disable any of the 8 registration fields, toggle Required/Optional, customize field labels & placeholders, and preview the live form in real-time.
   - **Registrations Table**: Search attendees by name/email/college, view participant profiles, delete entries, and **Export to CSV**.
   - **Cloudflare Guide**: Quick copy-paste commands for Wrangler deployment.

---

## 📋 Available npm Scripts

- `npm run dev` - Start local Vite dev server
- `npm run build` - Compile TypeScript and build production assets
- `npm run preview` - Preview production build locally
- `npm run wrangler:dev` - Run local Cloudflare Worker environment with D1 bindings
- `npm run d1:migrate:local` - Run D1 database migration locally
- `npm run d1:migrate:prod` - Run D1 database migration on Cloudflare remote D1
- `npm run deploy` - Build and deploy to Cloudflare
