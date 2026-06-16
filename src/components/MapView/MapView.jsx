import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

// Pakistan center coordinates
const PAKISTAN_CENTER = [30.3753, 69.3451];
const DEFAULT_ZOOM = 6;

// Color map for hazard types
const HAZARD_COLORS = {
  "Pothole": "#e63946",
  "Broken Signal": "#f4a261",
  "Waterlogging": "#457b9d",
  "Road Crack": "#e9c46a",
  "Missing Manhole": "#6a0572",
  "Other": "#6b7280",
};

/**
 * Create a colored circle marker icon for a hazard type.
 */
function createMarkerIcon(hazardType) {
  const color = HAZARD_COLORS[hazardType] || HAZARD_COLORS["Other"];
  return L.divIcon({
    className: "hazard-marker",
    html: `
      <div class="hazard-marker__dot" style="
        width: 28px;
        height: 28px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s ease;
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}

/**
 * Component to handle map click events.
 */
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

/**
 * Component to fly to a specific location on the map.
 */
function FlyToLocation({ location }) {
  const map = useMap();
  if (location) {
    map.flyTo([location.lat, location.lng], 14, { duration: 1 });
  }
  return null;
}

/**
 * Interactive Leaflet map showing hazard markers.
 * @param {Object} props
 * @param {Array} props.hazards - Array of hazard objects
 * @param {(hazard: Object) => void} props.onMarkerClick - Marker click handler
 * @param {({ lat, lng }) => void} props.onMapClick - Map click handler
 * @param {string} props.filterType - Active filter type
 * @param {{ lat: number, lng: number } | null} props.flyTo - Location to fly to
 */
export default function MapView({ hazards, onMarkerClick, onMapClick, filterType, flyTo }) {
  // Filter hazards by type
  const filteredHazards = useMemo(() => {
    if (!filterType || filterType === "All") return hazards;
    return hazards.filter((h) => h.hazard_type === filterType);
  }, [hazards, filterType]);

  return (
    <div className="map-view">
      <MapContainer
        center={PAKISTAN_CENTER}
        zoom={DEFAULT_ZOOM}
        className="map-view__container"
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapClickHandler onMapClick={onMapClick} />
        {flyTo && <FlyToLocation location={flyTo} />}

        {filteredHazards.map((hazard) => (
          <Marker
            key={hazard.id}
            position={[hazard.latitude, hazard.longitude]}
            icon={createMarkerIcon(hazard.hazard_type)}
            eventHandlers={{
              click: () => onMarkerClick?.(hazard),
            }}
          >
            <Popup className="map-view__popup">
              <div className="map-view__popup-content">
                <span
                  className="map-view__popup-dot"
                  style={{ background: HAZARD_COLORS[hazard.hazard_type] }}
                />
                <strong>{hazard.hazard_type}</strong>
                <p>{hazard.description?.substring(0, 80)}…</p>
                <small>Click marker for details</small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
