import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, CameraOff } from "lucide-react";
import { VerificationBadges } from "../VerificationBadge/VerificationBadge";
import "./Sidebar.css";

const HAZARD_COLORS = {
  "Pothole": "#e63946",
  "Broken Signal": "#f4a261",
  "Waterlogging": "#457b9d",
  "Road Crack": "#e9c46a",
  "Missing Manhole": "#6a0572",
  "Other": "#6b7280",
};

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Sidebar listing recent hazard reports.
 * @param {Object} props
 * @param {Array} props.hazards
 * @param {(hazard: Object) => void} props.onHazardClick
 * @param {string} props.filterType
 */
export default function Sidebar({ hazards, onHazardClick, filterType }) {
  const [collapsed, setCollapsed] = useState(false);

  const filtered = filterType && filterType !== "All"
    ? hazards.filter((h) => h.hazard_type === filterType)
    : hazards;

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const displayHazards = sorted.slice(0, 20);

  return (
    <>
      <button
        className={`sidebar__toggle ${collapsed ? "sidebar__toggle--collapsed" : ""}`}
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Show sidebar" : "Hide sidebar"}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
        <div className="sidebar__header">
          <h2 className="sidebar__title">Recent Reports</h2>
          <span className="sidebar__count">{filtered.length}</span>
        </div>

        <div className="sidebar__list">
          {displayHazards.length === 0 ? (
            <div className="sidebar__empty">
              <MapPin size={24} />
              <p>No hazards reported yet</p>
              <small>Click on the map to report one!</small>
            </div>
          ) : (
            displayHazards.map((hazard) => (
              <button
                key={hazard.id}
                className="sidebar__item"
                onClick={() => onHazardClick?.(hazard)}
              >
                <span
                  className="sidebar__dot"
                  style={{ background: HAZARD_COLORS[hazard.hazard_type] || "#6b7280" }}
                />
                {hazard.photo_url ? (
                  <div className="sidebar__item-thumb">
                    <img src={hazard.photo_url} alt="" loading="lazy" />
                  </div>
                ) : (
                  <div className="sidebar__item-thumb sidebar__item-thumb--empty">
                    <CameraOff size={16} color="rgba(255, 255, 255, 0.3)" />
                  </div>
                )}
                <div className="sidebar__item-content">
                  <span className="sidebar__item-type">{hazard.hazard_type}</span>
                  <VerificationBadges hazard={hazard} size="sm" />
                  <p className="sidebar__item-desc">
                    {hazard.description?.length > 60
                      ? hazard.description.substring(0, 60) + "…"
                      : hazard.description}
                  </p>
                  <span className="sidebar__item-time">
                    <Clock size={12} />
                    {timeAgo(hazard.created_at)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
