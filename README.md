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





