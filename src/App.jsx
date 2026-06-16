import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header/Header";
import MapView from "./components/MapView/MapView";
import Sidebar from "./components/Sidebar/Sidebar";
import FilterBar from "./components/FilterBar/FilterBar";
import HazardDetail from "./components/HazardDetail/HazardDetail";
import HazardForm from "./components/HazardForm/HazardForm";
import { useHazards } from "./hooks/useHazards";
import "./App.css";

// Dummy data for development (used when Supabase is not configured)
const DUMMY_HAZARDS = [
  { id: "1", hazard_type: "Pothole", description: "Huge pothole on GT Road near Lahore Cantonment. Approximately 2 feet deep, very dangerous for motorcyclists.", latitude: 31.5204, longitude: 74.3587, reported_by: "Ahmad", created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: "2", hazard_type: "Waterlogging", description: "Severe waterlogging near Karachi Saddar after heavy rain. Road completely submerged, cars getting stuck.", latitude: 24.8607, longitude: 67.0011, reported_by: "anonymous", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "3", hazard_type: "Broken Signal", description: "Traffic signal not working at Islamabad F-8 Markaz intersection. Causing major traffic jams during rush hours.", latitude: 33.7104, longitude: 73.0479, reported_by: "Fatima", created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: "4", hazard_type: "Missing Manhole", description: "Open manhole cover on Peshawar University Road. No warning signs or barriers placed. Extremely dangerous at night.", latitude: 34.0151, longitude: 71.5249, reported_by: "anonymous", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "5", hazard_type: "Road Crack", description: "Large crack spanning across both lanes on Multan Bosan Road near Bahauddin Zakariya University gate.", latitude: 30.1575, longitude: 71.5249, reported_by: "Hassan", created_at: new Date(Date.now() - 43200000).toISOString() },
  { id: "6", hazard_type: "Pothole", description: "Series of potholes near Faisal Mosque, Islamabad. Multiple vehicles have been damaged this week.", latitude: 33.7295, longitude: 73.0372, reported_by: "Ali", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "7", hazard_type: "Waterlogging", description: "Chronic waterlogging on Shahra-e-Faisal near Nursery area. Every monsoon rain causes flooding here.", latitude: 24.8725, longitude: 67.0581, reported_by: "Sara", created_at: new Date(Date.now() - 5400000).toISOString() },
  { id: "8", hazard_type: "Broken Signal", description: "Traffic lights at Mall Road Lahore near Shimla Hill are flashing yellow only. Not cycling properly.", latitude: 31.5546, longitude: 74.3572, reported_by: "anonymous", created_at: new Date(Date.now() - 14400000).toISOString() },
];

function App() {
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [mapClickLocation, setMapClickLocation] = useState(null);
  const [flyTo, setFlyTo] = useState(null);

  // Try Supabase first, fall back to dummy data
  const { hazards: supabaseHazards, loading, error, refetch } = useHazards();
  const [localHazards, setLocalHazards] = useState([]);

  // Use Supabase data if available, otherwise dummy data
  const hazards = supabaseHazards.length > 0 ? supabaseHazards : (loading ? [] : [...localHazards, ...DUMMY_HAZARDS]);

  useEffect(() => {
    if (error) {
      console.warn("Supabase not configured, using dummy data:", error);
    }
  }, [error]);

  const handleMapClick = useCallback((location) => {
    setMapClickLocation(location);
    setIsFormOpen(true);
  }, []);

  const handleMarkerClick = useCallback((hazard) => {
    setSelectedHazard(hazard);
  }, []);

  const handleSidebarClick = useCallback((hazard) => {
    setSelectedHazard(hazard);
    setFlyTo({ lat: hazard.latitude, lng: hazard.longitude });
  }, []);

  const handleSubmitSuccess = useCallback((newHazard) => {
    setLocalHazards(prev => [newHazard, ...prev]);
    setIsFormOpen(false);
    setMapClickLocation(null);
    // Try refetch from Supabase
    refetch?.();
  }, [refetch]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setMapClickLocation(null);
  }, []);

  return (
    <div className="app">
      <Header onReportClick={() => setIsFormOpen(true)} />

      <div className="app-body">
        <Sidebar
          hazards={hazards}
          onHazardClick={handleSidebarClick}
          filterType={filterType}
        />

        <main className="app-main">
          <FilterBar activeFilter={filterType} onFilterChange={setFilterType} />
          <MapView
            hazards={hazards}
            onMarkerClick={handleMarkerClick}
            onMapClick={handleMapClick}
            filterType={filterType}
            flyTo={flyTo}
          />
        </main>
      </div>

      <HazardDetail
        hazard={selectedHazard}
        onClose={() => setSelectedHazard(null)}
      />

      <HazardForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        location={mapClickLocation}
        onSubmitSuccess={handleSubmitSuccess}
      />

      {loading && (
        <div className="app-loading">
          <div className="app-loading__spinner" />
          <span>Loading hazards…</span>
        </div>
      )}
    </div>
  );
}

export default App;
