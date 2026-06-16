import { MapPin, AlertTriangle } from "lucide-react";
import "./Header.css";

/**
 * Fixed top header bar with app title and report button.
 * @param {{ onReportClick: () => void }} props
 */
export default function Header({ onReportClick }) {
  return (
    <header className="header">
      <div className="header__brand">
        <MapPin size={24} className="header__icon" />
        <h1 className="header__title">Pakistan Road Hazard Reporter</h1>
      </div>
      <button className="header__report-btn" onClick={onReportClick}>
        <AlertTriangle size={18} />
        <span>Report Hazard</span>
      </button>
    </header>
  );
}
