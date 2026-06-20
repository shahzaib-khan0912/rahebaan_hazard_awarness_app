import { useState, useEffect } from "react";
import { MapPin, AlertTriangle, Shield, Sun, Moon, User as UserIcon, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import AuthModal from "../Auth/AuthModal";
import "./Header.css";

/**
 * Fixed top header bar with app title and report button.
 * Shadow deepens on scroll for visual depth.
 * @param {{ onReportClick: () => void }} props
 */
export default function Header({ onReportClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isGuest, logout } = useAuth();

  useEffect(() => {
    // Check initial dark mode state
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

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
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full bg-dark-card border border-dark-border text-[var(--color-text)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        {/* User Profile Badge */}
        {user ? (
          <div className="header__user-badge">
            <div className="header__user-avatar">
              <UserIcon size={16} />
            </div>
            <span className="header__user-email">{user.email.split('@')[0]}</span>
            <button onClick={logout} className="header__logout-btn" title="Log Out">
              <LogOut size={16} />
            </button>
          </div>
        ) : isGuest ? (
          <div className="header__user-badge header__user-badge--guest">
            <div className="header__user-avatar">
              <UserIcon size={16} />
            </div>
            <span className="header__user-email">Guest</span>
            <button onClick={() => setShowAuthModal(true)} className="header__login-btn" title="Sign In">
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          </div>
        ) : (
          <button onClick={() => setShowAuthModal(true)} className="header__report-btn">
            <LogIn size={16} />
            <span>Log In</span>
          </button>
        )}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
}
