import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header/Header";
import MapView from "./components/MapView/MapView";
import Sidebar from "./components/Sidebar/Sidebar";
import FilterBar from "./components/FilterBar/FilterBar";
import HazardDetail from "./components/HazardDetail/HazardDetail";
import HazardForm from "./components/HazardForm/HazardForm";
import { useHazards } from "./hooks/useHazards";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

// Dummy data for development (used when Supabase is not configured)
const DUMMY_HAZARDS = [
  { id: "1", hazard_type: "Pothole", description: "Huge pothole on GT Road near Lahore Cantonment. Approximately 2 feet deep.", latitude: 31.5204, longitude: 74.3587, reported_by: "Ahmad", created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: "2", hazard_type: "Waterlogging", description: "Severe waterlogging near Karachi Saddar after heavy rain.", latitude: 24.8607, longitude: 67.0011, reported_by: "anonymous", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "3", hazard_type: "Broken Signal", description: "Traffic signal not working at Islamabad F-8 Markaz intersection.", latitude: 33.7104, longitude: 73.0479, reported_by: "Fatima", created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: "4", hazard_type: "Missing Manhole", description: "Open manhole cover on Peshawar University Road.", latitude: 34.0151, longitude: 71.5249, reported_by: "anonymous", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "5", hazard_type: "Road Crack", description: "Large crack spanning across both lanes on Multan Bosan Road.", latitude: 30.1575, longitude: 71.5249, reported_by: "Hassan", created_at: new Date(Date.now() - 43200000).toISOString() },
];

export default function Dashboard() {
  const [selectedHazard, setSelectedHazard] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterType, setFilterType] = useState("All");
  const [mapClickLocation, setMapClickLocation] = useState(null);
  const [flyTo, setFlyTo] = useState(null);
  const navigate = useNavigate();

  const { hazards: supabaseHazards, loading, error, refetch } = useHazards();
  const [localHazards, setLocalHazards] = useState([]);

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
    refetch?.();
  }, [refetch]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setMapClickLocation(null);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-dark-bg overflow-hidden relative">
      {/* Back to Home Button (Floating) */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 z-[1000] w-10 h-10 bg-dark-card border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-md shadow-lg"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Adjust Header to have padding left to accommodate back button */}
      <div className="pl-16">
        <Header onReportClick={() => setIsFormOpen(true)} />
      </div>

      <div className="flex flex-1 mt-[var(--header-height)] relative overflow-hidden">
        <Sidebar
          hazards={hazards}
          onHazardClick={handleSidebarClick}
          filterType={filterType}
        />

        <main className="flex-1 flex flex-col relative h-full">
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
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] glass-panel px-6 py-3 flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading live data...</span>
        </div>
      )}
    </div>
  );
}
