# 🅰️ Person A — UI & Map Engineer

> **Your domain:** Everything the user **sees**. Map, markers, sidebar, detail panel, header, all CSS.

## 🔒 File Ownership

**YOU own (only edit these):**
- `src/components/Header/` — Header.jsx, Header.css
- `src/components/MapView/` — MapView.jsx, MapView.css
- `src/components/Sidebar/` — Sidebar.jsx, Sidebar.css
- `src/components/HazardDetail/` — HazardDetail.jsx, HazardDetail.css
- `src/components/FilterBar/` — FilterBar.jsx, FilterBar.css
- `src/App.jsx`, `src/App.css`, `src/index.css`
- `public/` (any static assets)

**DO NOT touch (Person B owns):**
- `src/components/HazardForm/`, `src/components/VoiceInput/`
- `src/hooks/`, `src/lib/`, `src/services/`
- `.env`, `supabase/`

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

### App.jsx State (You set up, Person B consumes)

```jsx
const [hazards, setHazards] = useState([]);
const [selectedHazard, setSelectedHazard] = useState(null);
const [isFormOpen, setIsFormOpen] = useState(false);
const [filterType, setFilterType] = useState("All");
const [mapClickLocation, setMapClickLocation] = useState(null);
```

### Component Props

| Component (You) | Props |
|---|---|
| `<Header />` | `onReportClick()` |
| `<MapView />` | `hazards`, `onMarkerClick(hazard)`, `onMapClick({lat,lng})`, `filterType` |
| `<Sidebar />` | `hazards`, `onHazardClick(hazard)`, `filterType` |
| `<HazardDetail />` | `hazard`, `onClose()` |
| `<FilterBar />` | `activeFilter`, `onFilterChange(type)` |
| `<HazardForm />` **(B)** | `isOpen`, `onClose()`, `location`, `onSubmitSuccess(newHazard)` |

---

## 📅 Day 1 — Foundation & Map

### 1.1: Update Global Styles (`src/index.css`)

Add Leaflet CSS and hazard color tokens to the existing file:

```css
/* Add at the very top */
@import "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

/* Add inside :root */
--hazard-pothole: #e63946;
--hazard-signal: #f4a261;
--hazard-water: #457b9d;
--hazard-crack: #e9c46a;
--hazard-manhole: #6a0572;
--hazard-other: #6b7280;
```

### 1.2: Header Component

**Files:** `src/components/Header/Header.jsx` + `Header.css`

- Fixed top bar, ~60px tall, z-index above map
- Pakistan green gradient background
- Left: `MapPin` icon (lucide-react) + title text
- Right: "🚨 Report Hazard" button → calls `onReportClick()`

### 1.3: MapView Component (⭐ Core Feature)

**Files:** `src/components/MapView/MapView.jsx` + `MapView.css`

Build the interactive Leaflet map:

1. **Setup:** `<MapContainer>` centered on `[30.3753, 69.3451]`, zoom `6`, OpenStreetMap tiles
2. **Markers:** Render colored `<Marker>` for each hazard using `L.divIcon` with CSS circles:
   ```js
   const getMarkerIcon = (type) => {
     const colors = { "Pothole": "#e63946", "Broken Signal": "#f4a261", "Waterlogging": "#457b9d", "Road Crack": "#e9c46a", "Missing Manhole": "#6a0572", "Other": "#6b7280" };
     return L.divIcon({
       className: "custom-marker",
       html: `<div style="width:24px;height:24px;background:${colors[type]||"#6b7280"};border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
       iconSize: [24, 24], iconAnchor: [12, 12],
     });
   };
   ```
3. **Click handler:** Use `useMapEvents` → on click call `onMapClick({lat, lng})`
4. **Filter:** If `filterType !== "All"`, only show markers matching that type
5. **Full viewport height** below header

### 1.4: Sidebar Component

**Files:** `src/components/Sidebar/Sidebar.jsx` + `Sidebar.css`

- Width ~320px, dark semi-transparent background with backdrop blur
- Title "Recent Reports" with count badge
- List of hazard items: colored dot + type (bold) + description (truncated 60 chars) + time ago
- Click item → calls `onHazardClick(hazard)`
- Sorted by `created_at` descending, max 20 items, scrollable
- Collapsible on mobile (toggle button)

Helper:
```js
function timeAgo(dateString) {
  const s = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}
```

### 1.5: App.jsx Layout

Wire up all components with dummy data for testing:

```jsx
// Use dummy hazards until Person B's Supabase hook is ready:
useEffect(() => {
  setHazards([
    { id: "1", hazard_type: "Pothole", description: "Huge pothole on GT Road near Lahore Cantonment", latitude: 31.5204, longitude: 74.3587, reported_by: "anonymous", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: "2", hazard_type: "Waterlogging", description: "Severe waterlogging near Karachi Saddar", latitude: 24.8607, longitude: 67.0011, reported_by: "anonymous", created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: "3", hazard_type: "Broken Signal", description: "Traffic signal not working at Islamabad F-8", latitude: 33.6844, longitude: 73.0479, reported_by: "anonymous", created_at: new Date(Date.now() - 10800000).toISOString() },
  ]);
}, []);
```

Layout CSS: flexbox with sidebar on left, map filling remaining space.

---

## 📅 Day 2 — Detail Panel, Filters, Polish

### 2.1: HazardDetail Slide-In Panel

**Files:** `src/components/HazardDetail/HazardDetail.jsx` + `HazardDetail.css`

- Slides in from right, ~400px wide, full height
- Close (X) button top-right
- Shows: hazard type with colored icon, full description, coordinates, reported_by + time, severity badge
- Backdrop overlay that closes on click
- Smooth 0.3s slide animation

### 2.2: FilterBar Component

**Files:** `src/components/FilterBar/FilterBar.jsx` + `FilterBar.css`

- Horizontal row of chip/pill buttons floating above the map
- Options: All, Pothole, Broken Signal, Waterlogging, Road Crack, Missing Manhole
- Each chip has a colored dot + label
- Active chip: filled background. Inactive: outlined
- Horizontally scrollable on mobile

### 2.3: Responsive Design

```css
@media (max-width: 768px) {
  .app-body { flex-direction: column; }
  .sidebar { width: 100%; max-height: 30vh; }
  .hazard-detail { width: 100%; }
}
```

### 2.4: Micro-Animations & Polish

- Markers: subtle bounce on appear
- Sidebar: slide-in from left
- Detail panel: slide-in from right (0.3s ease)
- Filter chips: scale up on hover
- Header: shadow deepens on scroll

---

## ✅ Day 1 Checklist

- [ ] Update `index.css` — Leaflet CSS + hazard colors
- [ ] Build `Header` — green gradient, title, report button
- [ ] Build `MapView` — Leaflet map, colored markers, click handlers
- [ ] Build `Sidebar` — recent reports list, time ago
- [ ] Set up `App.jsx` — all state, dummy data, layout
- [ ] `App.css` — flexbox layout

## ✅ Day 2 Checklist

- [ ] Build `HazardDetail` — slide-in panel
- [ ] Build `FilterBar` — colored chips
- [ ] Add responsive CSS
- [ ] Add micro-animations
- [ ] Test all UI with dummy data
- [ ] **MERGE** with Person B → uncomment `<HazardForm>`, replace dummy data with Supabase hook
- [ ] Integration test

---

## 🔀 Merge Instructions (End of Day 2)

```bash
git checkout main
git merge person-b-branch
```

After merge in `App.jsx`:
1. Uncomment `<HazardForm>` import and JSX
2. Replace dummy `useEffect` with Person B's `useHazards()` hook
3. Test full flow: map → click → form → submit → new marker appears

> **You can test everything independently with dummy data — no need to wait for Person B!**
