import { MapPin } from "lucide-react";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <MapPin size={28} className="header-icon" />
        <h1>Pakistan Road Hazard Reporter</h1>
      </header>
      <main className="app-main">
        <p className="tagline">
          🚧 Report road hazards. Help your community. Make roads safer.
        </p>
        <p className="status">
          ✅ Project foundation is ready — start building on Day 2!
        </p>
      </main>
    </div>
  );
}

export default App;
