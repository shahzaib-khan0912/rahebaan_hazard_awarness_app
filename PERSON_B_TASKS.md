# 🅱️ Person B — Backend & Logic Engineer

> **Your domain:** All data logic, Supabase, voice input, AI classification, and the report form.

## 🔒 File Ownership

**YOU own (only edit these):**
- `src/lib/SupabaseClient.js` (already exists)
- `src/services/hazardService.js` — Supabase CRUD functions
- `src/hooks/useHazards.js` — fetch hazards hook
- `src/hooks/useVoiceInput.js` — Web Speech API hook
- `src/hooks/useAIClassifier.js` — Claude/Gemini classification hook
- `src/components/HazardForm/` — HazardForm.jsx, HazardForm.css
- `src/components/VoiceInput/` — VoiceInput.jsx, VoiceInput.css
- `.env`, `supabase/`, any API config

**DO NOT touch (Person A owns):**
- `src/components/Header/`, `MapView/`, `Sidebar/`, `HazardDetail/`, `FilterBar/`
- `src/App.jsx`, `src/App.css`, `src/index.css`

---

## 🤝 Shared Data Contract

### Hazard Object Shape

```js
{
  id: "uuid-string",
  hazard_type: "Pothole",  // Pothole | Broken Signal | Waterlogging | Road Crack | Missing Manhole | Other
  description: "Large pothole near GT Road",
  latitude: 31.5204,
  longitude: 74.3587,
  reported_by: "anonymous",
  created_at: "2026-06-16T18:30:00Z"
}
```

### HazardForm Props (Person A will pass these to you)

```jsx
<HazardForm
  isOpen={boolean}                    // whether modal is visible
  onClose={() => void}                // close the modal
  location={{ lat: number, lng: number } | null}  // map click location
  onSubmitSuccess={(newHazard) => void}  // callback after successful insert
/>
```

### Hook Export Contract (Person A will consume these)

```js
// useHazards.js — Person A replaces dummy data with this
export function useHazards() {
  // returns { hazards: [], loading: boolean, error: string|null, refetch: () => void }
}
```

---

## 📅 Day 1 — Supabase + Form

### 1.1: Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) → create a project
2. Open **SQL Editor** → paste and run `supabase/migrations/001_create_hazards_table.sql` (already created)
3. Go to **Project Settings → API** → copy URL and anon key
4. Create `.env` in project root:
   ```
   VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

> `src/lib/SupabaseClient.js` already reads these env vars. It's ready to use.

### 1.2: Hazard Service (CRUD Functions)

**File:** `src/services/hazardService.js`

```js
import { supabase } from "../lib/SupabaseClient";

// Fetch all hazards, newest first
export async function fetchHazards() {
  const { data, error } = await supabase
    .from("hazards")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Insert a new hazard report
export async function insertHazard({ hazard_type, description, latitude, longitude, reported_by = "anonymous" }) {
  const { data, error } = await supabase
    .from("hazards")
    .insert([{ hazard_type, description, latitude, longitude, reported_by }])
    .select()
    .single();
  if (error) throw error;
  return data;
}
```

### 1.3: useHazards Hook

**File:** `src/hooks/useHazards.js`

```js
import { useState, useEffect } from "react";
import { fetchHazards } from "../services/hazardService";

export function useHazards() {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchHazards();
      setHazards(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { hazards, loading, error, refetch: load };
}
```

### 1.4: HazardForm Component (⭐ Core Feature)

**Files:** `src/components/HazardForm/HazardForm.jsx` + `HazardForm.css`

Build a modal form for submitting hazard reports:

```jsx
// Props: { isOpen, onClose, location, onSubmitSuccess }

// Form fields:
// 1. Hazard Type — <select> dropdown
const HAZARD_TYPES = ["Pothole", "Broken Signal", "Waterlogging", "Road Crack", "Missing Manhole", "Other"];

// 2. Description — <textarea>
// 3. Voice Input button (Day 2 — leave a placeholder div for now)
// 4. Location display — show lat/lng from props.location (read-only)
// 5. Submit button
```

**Behavior:**
- Modal overlay with white card, centered on screen
- If `location` is null, show "Click on the map to set location" message
- On submit → call `insertHazard()` → call `onSubmitSuccess(newHazard)` → close modal
- Show loading spinner on submit button while saving
- Show error toast if insert fails
- Close on backdrop click or X button

**Style it independently** — white card, rounded corners, green submit button, clean form layout. You own this CSS so no conflict with Person A.

### 1.5: Test the Form Standalone

Create a temporary test page or test in isolation:

```jsx
// Quick test — temporarily add to your own test file
import HazardForm from "./components/HazardForm/HazardForm";

function TestForm() {
  return (
    <HazardForm
      isOpen={true}
      onClose={() => console.log("closed")}
      location={{ lat: 31.52, lng: 74.35 }}
      onSubmitSuccess={(h) => console.log("Saved:", h)}
    />
  );
}
```

---

## 📅 Day 2 — Voice Input + AI + Polish

### 2.1: VoiceInput Component

**Files:** `src/components/VoiceInput/VoiceInput.jsx` + `VoiceInput.css`

Uses the browser's Web Speech API:

```js
// src/hooks/useVoiceInput.js
import { useState, useRef, useCallback } from "react";

export function useVoiceInput({ lang = "en-US", onResult }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser. Use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = lang;           // "en-US" or "ur-PK" for Urdu
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      onResult?.(text);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [lang, onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening };
}
```

**VoiceInput.jsx component:**
- Mic button (lucide-react `Mic` / `MicOff` icon)
- Pulsing red animation when recording
- Language toggle: English ↔ Urdu (switches `lang` between `en-US` and `ur-PK`)
- Shows live transcript text below the button
- Pass transcribed text up to HazardForm's description field

### 2.2: AI Classification Hook

**File:** `src/hooks/useAIClassifier.js`

Calls Claude or Gemini API to classify hazard text:

```js
import { useState } from "react";

export function useAIClassifier() {
  const [classifying, setClassifying] = useState(false);

  const classify = async (description) => {
    setClassifying(true);
    try {
      // Option A: Claude API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_CLAUDE_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          messages: [{
            role: "user",
            content: `Classify this road hazard report. Return ONLY valid JSON with keys "hazard_type" (one of: Pothole, Broken Signal, Waterlogging, Road Crack, Missing Manhole, Other) and "severity" (Low, Medium, High).\n\nReport: "${description}"`
          }]
        }),
      });
      const data = await response.json();
      const text = data.content[0].text;
      return JSON.parse(text);
    } catch (err) {
      console.error("AI classification failed:", err);
      return null;  // Fallback: user selects manually
    } finally {
      setClassifying(false);
    }
  };

  return { classify, classifying };
}
```

> [!IMPORTANT]
> Add `VITE_CLAUDE_API_KEY` (or `VITE_GEMINI_API_KEY`) to your `.env` file.
> If no API key, the form still works — user just selects type manually.

### 2.3: Integrate Voice + AI into HazardForm

Update `HazardForm.jsx` to:
1. Add `<VoiceInput>` component that fills the description textarea
2. After voice transcript (or manual typing), call `classify(description)`
3. If AI returns a result → auto-select the hazard type dropdown + show severity badge
4. If AI fails → user picks manually (graceful fallback)

Flow:
```
User taps 🎙️ → Speaks → transcript fills description
   → AI classify() → auto-selects "Pothole" + "High" severity
   → User reviews → Submits
```

### 2.4: Error Handling & Loading States

- `useHazards`: return `loading` and `error` states
- HazardForm: show spinner on submit, disable button while saving
- VoiceInput: show "Not supported" message in non-Chrome browsers
- AI: show "Classifying..." spinner, graceful fallback on error
- Network errors: show inline error messages (red text below form)

### 2.5: Add `.env` Variables

Final `.env` should have:
```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_CLAUDE_API_KEY=sk-ant-your-key-here    # Optional
# OR
VITE_GEMINI_API_KEY=your-gemini-key-here    # Optional
```

---

## ✅ Day 1 Checklist

- [ ] Set up Supabase project + run SQL migration
- [ ] Configure `.env` with Supabase credentials
- [ ] Build `hazardService.js` — `fetchHazards()` + `insertHazard()`
- [ ] Build `useHazards` hook
- [ ] Build `HazardForm` component — dropdown, textarea, location display, submit
- [ ] Test form submission → verify data appears in Supabase dashboard
- [ ] Test `useHazards` → verify it fetches data back

## ✅ Day 2 Checklist

- [ ] Build `useVoiceInput` hook (Web Speech API)
- [ ] Build `VoiceInput` component — mic button, language toggle, transcript display
- [ ] Build `useAIClassifier` hook — Claude/Gemini API call
- [ ] Integrate voice + AI into HazardForm
- [ ] Add error handling + loading states everywhere
- [ ] Test voice → AI → form → submit flow end-to-end
- [ ] **MERGE** with Person A
- [ ] Integration test: full app working

---

## 🔀 Merge Instructions (End of Day 2)

```bash
# Push your branch
git push origin person-b-branch

# Person A merges (or you merge together)
git checkout main
git pull
git merge person-b-branch
```

**After merge, Person A updates App.jsx:**
1. Import `useHazards` and replace dummy data:
   ```jsx
   import { useHazards } from "./hooks/useHazards";
   const { hazards, loading, refetch } = useHazards();
   ```
2. Uncomment `<HazardForm>` import and JSX
3. Pass `refetch` to `onSubmitSuccess` so new hazards appear immediately

**No file conflicts** because you touched completely different files! 🎉

---

> **You can test your form + hooks independently. Use a simple wrapper page or Supabase dashboard to verify data flows correctly — no need to wait for Person A's map UI!**
