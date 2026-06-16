import "./FilterBar.css";

const HAZARD_TYPES = [
  { label: "All", color: "#01411c" },
  { label: "Pothole", color: "#e63946" },
  { label: "Broken Signal", color: "#f4a261" },
  { label: "Waterlogging", color: "#457b9d" },
  { label: "Road Crack", color: "#e9c46a" },
  { label: "Missing Manhole", color: "#6a0572" },
];

/**
 * Horizontal filter chips above the map.
 * @param {{ activeFilter: string, onFilterChange: (type: string) => void }} props
 */
export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="filter-bar">
      {HAZARD_TYPES.map(({ label, color }) => (
        <button
          key={label}
          className={`filter-bar__chip ${activeFilter === label ? "filter-bar__chip--active" : ""}`}
          onClick={() => onFilterChange(label)}
          style={{
            "--chip-color": color,
          }}
        >
          <span className="filter-bar__dot" style={{ background: color }} />
          {label}
        </button>
      ))}
    </div>
  );
}
