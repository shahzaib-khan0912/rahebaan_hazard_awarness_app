import { X, Clock, MapPin, AlertTriangle } from "lucide-react";
import "./HazardDetail.css";

const HAZARD_COLORS = {
  "Pothole": "#e63946",
  "Broken Signal": "#f4a261",
  "Waterlogging": "#457b9d",
  "Road Crack": "#e9c46a",
  "Missing Manhole": "#6a0572",
  "Other": "#6b7280",
};

const SEVERITY_COLORS = {
  "Low": "#22c55e",
  "Medium": "#f4a261",
  "High": "#e63946",
};

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

/**
 * Slide-in detail panel for a selected hazard.
 * @param {{ hazard: Object|null, onClose: () => void }} props
 */
export default function HazardDetail({ hazard, onClose }) {
  if (!hazard) return null;

  const color = HAZARD_COLORS[hazard.hazard_type] || HAZARD_COLORS["Other"];

  return (
    <>
      <div className="hazard-detail__backdrop" onClick={onClose} />
      <div className="hazard-detail">
        {/* Header */}
        <div className="hazard-detail__header" style={{ background: color }}>
          <div className="hazard-detail__header-content">
            <AlertTriangle size={22} />
            <h2>{hazard.hazard_type}</h2>
          </div>
          <button className="hazard-detail__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="hazard-detail__body">
          {/* Description */}
          <div className="hazard-detail__section">
            <h3>Description</h3>
            <p>{hazard.description || "No description provided."}</p>
          </div>

          {/* Location */}
          <div className="hazard-detail__section">
            <h3>
              <MapPin size={16} /> Location
            </h3>
            <p className="hazard-detail__coords">
              {hazard.latitude?.toFixed(4)}, {hazard.longitude?.toFixed(4)}
            </p>
            <img
              className="hazard-detail__map-preview"
              src={`https://staticmap.openstreetmap.de/staticmap.php?center=${hazard.latitude},${hazard.longitude}&zoom=15&size=400x200&markers=${hazard.latitude},${hazard.longitude},red-pushpin`}
              alt="Location preview"
              loading="lazy"
            />
          </div>

          {/* Meta info */}
          <div className="hazard-detail__meta">
            <div className="hazard-detail__meta-item">
              <Clock size={14} />
              <span>{timeAgo(hazard.created_at)}</span>
            </div>
            <div className="hazard-detail__meta-item">
              <span>Reported by: <strong>{hazard.reported_by || "Anonymous"}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
