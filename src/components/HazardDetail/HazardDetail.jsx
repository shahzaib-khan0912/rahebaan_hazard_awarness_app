import { X, Clock, MapPin, AlertTriangle, TrafficCone, Droplets, Activity, CircleDot, HelpCircle, Edit2, Trash2, Camera, ExternalLink } from "lucide-react";
import VerificationBadge from "../VerificationBadge/VerificationBadge";
import "./HazardDetail.css";

const HAZARD_COLORS = {
  "Pothole": "#e63946",
  "Broken Signal": "#f4a261",
  "Waterlogging": "#457b9d",
  "Road Crack": "#e9c46a",
  "Missing Manhole": "#6a0572",
  "Other": "#6b7280",
};

const HAZARD_ICONS = {
  "Pothole": AlertTriangle,
  "Broken Signal": TrafficCone,
  "Waterlogging": Droplets,
  "Road Crack": Activity,
  "Missing Manhole": CircleDot,
  "Other": HelpCircle,
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
 * @param {{ hazard: Object|null, onClose: () => void, onEdit: (hazard) => void, onDelete: (hazard) => void }} props
 */
export default function HazardDetail({ hazard, onClose, onEdit, onDelete }) {
  if (!hazard) return null;

  const color = HAZARD_COLORS[hazard.hazard_type] || HAZARD_COLORS["Other"];
  const HazardIcon = HAZARD_ICONS[hazard.hazard_type] || HAZARD_ICONS["Other"];

  // Get AI analysis data
  const aiAnalysis = hazard.ai_analysis || {};
  const hasVerification = hazard.verification_status && hazard.verification_status !== "unverified";

  return (
    <>
      <div className="hazard-detail__backdrop" onClick={onClose} />
      <div className="hazard-detail">
        {/* Header */}
        <div className="hazard-detail__header" style={{ background: color }}>
          <div className="hazard-detail__header-content">
            <HazardIcon size={24} className="hazard-detail__icon" />
            <div className="hazard-detail__title-wrapper">
              <h2>{hazard.hazard_type}</h2>
              <div className="hazard-detail__badges-row">
                <span className="hazard-detail__severity-badge" style={{
                  backgroundColor: SEVERITY_COLORS[hazard.severity || aiAnalysis.severity] || SEVERITY_COLORS["Medium"]
                }}>
                  {hazard.severity || aiAnalysis.severity || "Medium"} Severity
                </span>
                {/* Verification Badge */}
                {(hasVerification || hazard.photo_url) && (
                  <VerificationBadge
                    status={hazard.verification_status || "unverified"}
                    score={hazard.verification_score}
                    size="sm"
                    showScore
                  />
                )}
                {hazard.is_ai_generated && (
                  <VerificationBadge isAiGenerated={true} size="sm" />
                )}
              </div>
            </div>
          </div>
          <button className="hazard-detail__close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="hazard-detail__body">
          {/* Photo Evidence */}
          {hazard.photo_url && (
            <div className="hazard-detail__section">
              <h3>
                <Camera size={16} /> Photo Evidence
              </h3>
              <div className="hazard-detail__photo-wrapper">
                <img
                  className="hazard-detail__photo"
                  src={hazard.photo_url}
                  alt={`Photo of ${hazard.hazard_type}`}
                  loading="lazy"
                />
                <a
                  href={hazard.photo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hazard-detail__photo-link"
                  title="View full size"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}

          {/* AI Verification Details */}
          {hasVerification && (
            <div className="hazard-detail__section">
              <h3>🤖 AI Verification</h3>
              <div className="hazard-detail__ai-grid">
                <div className="hazard-detail__ai-item">
                  <span className="hazard-detail__ai-label">Detected Type</span>
                  <span className="hazard-detail__ai-value">{aiAnalysis.verified_type || "—"}</span>
                </div>
                <div className="hazard-detail__ai-item">
                  <span className="hazard-detail__ai-label">AI Severity</span>
                  <span className="hazard-detail__ai-value">{aiAnalysis.severity || "—"}</span>
                </div>
                <div className="hazard-detail__ai-item">
                  <span className="hazard-detail__ai-label">Confidence</span>
                  <span className="hazard-detail__ai-value">{hazard.verification_score ?? "—"}%</span>
                </div>
                <div className="hazard-detail__ai-item">
                  <span className="hazard-detail__ai-label">Photo Auth.</span>
                  <span className="hazard-detail__ai-value">
                    {hazard.is_ai_generated ? "🤖 AI Generated" : "✓ Authentic"}
                  </span>
                </div>
              </div>
              {aiAnalysis.verification_description && (
                <p className="hazard-detail__ai-description">
                  {aiAnalysis.verification_description}
                </p>
              )}
              {aiAnalysis.ai_detection_reasoning && (
                <p className="hazard-detail__ai-reasoning">
                  <strong>Detection note:</strong> {aiAnalysis.ai_detection_reasoning}
                </p>
              )}
            </div>
          )}

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

          {/* Actions */}
          <div className="hazard-detail__actions">
            <button 
              className="hazard-detail__action-btn hazard-detail__action-btn--edit"
              onClick={() => onEdit?.(hazard)}
            >
              <Edit2 size={16} /> Edit
            </button>
            <button 
              className="hazard-detail__action-btn hazard-detail__action-btn--delete"
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this hazard report?")) {
                  onDelete?.(hazard);
                }
              }}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
