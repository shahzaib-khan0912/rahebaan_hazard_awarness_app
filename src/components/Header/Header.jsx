import { useState, useEffect } from "react";
import { MapPin, AlertTriangle, Shield } from "lucide-react";
import "./Header.css";

/**
 * Fixed top header bar with app title and report button.
 * Shadow deepens on scroll for visual depth.
 * @param {{ onReportClick: () => void }} props
 */
export default function Header({ onReportClick }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__brand">
        <div className="header__logo">
          <Shield size={20} className="header__logo-icon" />
        </div>
        <div className="header__text">
          <h1 className="header__title">Road Hazard Reporter</h1>
          <span className="header__subtitle">Pakistan</span>
        </div>
      </div>

      <div className="header__actions">
        <div className="header__status">
          <span className="header__status-dot" />
          <span className="header__status-text">Live</span>
        </div>
        <button className="header__report-btn" onClick={onReportClick} id="report-hazard-btn">
          <AlertTriangle size={16} />
          <span>Report Hazard</span>
        </button>
      </div>
    </header>
  );
}
