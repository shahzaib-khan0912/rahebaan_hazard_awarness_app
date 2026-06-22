import { useState } from 'react';
import { supabase } from '../../lib/SupabaseClient';
import { useAuth } from '../../hooks/useAuth';
import { X, Mail, Lock, User as UserIcon, Loader, ShieldAlert } from 'lucide-react';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { loginAsGuest } = useAuth();

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let result;
      if (isLogin) {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
        if (result.data?.user && !result.data?.session) {
          setError('Signup successful! Please check your email for verification.');
          setLoading(false);
          return;
        }
      }

      if (result.error) throw result.error;
      onClose(); // Close modal on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    onClose();
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container glass-panel">
        <button onClick={onClose} className="auth-close-btn">
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-logo bg-primary/20">
            <img src="/green.png" alt="RAHEBAAN Logo" className="w-8 h-8 object-contain" />
          </div>
          <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p>{isLogin ? 'Login to manage your hazard reports' : 'Join the community to track your reports'}</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="auth-form">
          <div className="auth-input-group">
            <Mail className="auth-input-icon" size={18} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="auth-input-group">
            <Lock className="auth-input-icon" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="primary-button w-full justify-center" disabled={loading}>
            {loading ? <Loader className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button 
          onClick={handleGuestLogin}
          className="glass-button w-full justify-center text-[var(--color-text)] hover:bg-black/5 dark:hover:bg-white/5"
        >
          <UserIcon size={18} className="mr-2" />
          Continue as Guest
        </button>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-semibold">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
