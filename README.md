# 🇵🇰 Pakistan Road Hazard Reporter (MVP)

A crowd-sourced platform that empowers Pakistani citizens to report road hazards — potholes, broken signals, waterlogging, and more — on an interactive map. Built with **React + Vite**, **Leaflet.js**, **Supabase**, and AI-powered voice input.

---

## ✨ Features (Planned)

- 📍 **Interactive Map** — View and report hazards on a live Leaflet map centered on Pakistan.
- 🎙️ **Voice Reporting** — Describe hazards using the Web Speech API (Urdu & English).
- 🤖 **AI Classification** — Automatically categorize hazard type and severity via Claude/Gemini API.
- 🗄️ **Real-time Database** — All reports stored and synced through Supabase (PostgreSQL).
- 🔒 **Row Level Security** — Public read/insert access with RLS policies.

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | React 18, Vite 5                  |
| Maps       | Leaflet.js, React-Leaflet         |
| Database   | Supabase (PostgreSQL)             |
| Icons      | Lucide React                      |
| Voice      | Web Speech API (browser-native)   |
| AI/NLP     | Claude API or Google Gemini API   |

---

## 🚀 Setup Guide

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 9
- A free [Supabase](https://supabase.com) account
- Git installed on your machine

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/pakistan-road-hazard-reporter.git
cd pakistan-road-hazard-reporter
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# .env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

> **Where to find these values:**
>
> 1. Go to [supabase.com](https://supabase.com) → sign in → open your project.
> 2. Navigate to **Project Settings** → **API**.
> 3. Copy the **Project URL** → paste as `VITE_SUPABASE_URL`.
> 4. Copy the **anon / public** key → paste as `VITE_SUPABASE_ANON_KEY`.

### 4. Set Up the Database

1. In your Supabase dashboard, go to **SQL Editor**.
2. Paste the contents of `supabase/migrations/001_create_hazards_table.sql`.
3. Click **Run** to create the table and RLS policies.

### 5. Start the Dev Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. 🎉

---

## 📁 Project Structure

```
pakistan-road-hazard-reporter/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Map/             # Leaflet map component
│   │   ├── HazardForm/      # Report submission form
│   │   └── VoiceInput/      # Speech-to-text component
│   ├── lib/
│   │   └── SupabaseClient.js  # Supabase connection init
│   ├── pages/               # Page-level components
│   ├── App.jsx              # Root application component
│   ├── App.css              # Application styles
│   ├── main.jsx             # Vite entry point
│   └── index.css            # Global styles
├── supabase/
│   └── migrations/
│       └── 001_create_hazards_table.sql
├── .env                     # Environment variables (DO NOT COMMIT)
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🗓️ Development Roadmap

### Day 1 — Project Setup & Foundation
- [x] Initialize Vite + React project
- [x] Configure `package.json` with all dependencies
- [x] Create Supabase project and database schema
- [x] Set up `SupabaseClient.js` with environment variables
- [x] Write project README with setup instructions

### Day 2 — Interactive Map
- [ ] Integrate Leaflet.js with React-Leaflet
- [ ] Center the map on Pakistan (lat: 30.3753, lng: 69.3451)
- [ ] Display existing hazard markers from Supabase
- [ ] Add click-to-report functionality (capture lat/lng on click)

### Day 3 — Hazard Report Form
- [ ] Build the hazard submission form (type, description, location)
- [ ] Connect form to Supabase `INSERT` operation
- [ ] Add form validation and user feedback (success/error toasts)
- [ ] Style the form with a clean, mobile-friendly design

### Day 4 — Voice Input with Web Speech API
- [ ] Implement speech-to-text using the Web Speech API
- [ ] Support Urdu and English language input
- [ ] Auto-fill the description field from voice transcription
- [ ] Add a microphone button with recording state indicator

### Day 5 — AI-Powered Hazard Classification
- [ ] Integrate Claude or Gemini API for hazard classification
- [ ] Send voice/text input → receive structured hazard data
- [ ] Auto-select hazard type and severity from AI response
- [ ] Handle API errors gracefully with fallback to manual input

### Day 6 — Polish & UX Improvements
- [ ] Add hazard type icons on map markers (color-coded)
- [ ] Implement filtering by hazard type
- [ ] Add a sidebar/panel for hazard details on marker click
- [ ] Mobile-responsive design and touch optimization
- [ ] Loading states and skeleton screens

### Day 7 — Testing, Deployment & Demo
- [ ] End-to-end testing of the full reporting flow
- [ ] Deploy to Vercel / Netlify
- [ ] Final bug fixes and performance optimization
- [ ] Record a demo video / prepare presentation
- [ ] Submit the project 🚀

---

## 🔐 Security Notes

- The `anon` key is safe to expose in the frontend — it's rate-limited and governed by RLS policies.
- **Never commit your `.env` file.** It's already in `.gitignore`.
- Row Level Security (RLS) is enabled on the `hazards` table to allow public read and insert only.

---

## 📄 License

This project is built for educational and hackathon purposes. MIT License.

---

> **Built with ❤️ for the people of Pakistan.**
