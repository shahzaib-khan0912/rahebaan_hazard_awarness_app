import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/SupabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (userId) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      setIsAdmin(!!data);
    } catch (err) {
      console.error("Error checking admin status:", err);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is logged in, they are definitely not a guest
      if (session?.user) {
        setIsGuest(false);
        localStorage.removeItem('hazard_reporter_guest');
        checkAdminStatus(session.user.id).then(() => setLoading(false));
      } else {
        // Check if previously set as guest
        const guestStatus = localStorage.getItem('hazard_reporter_guest') === 'true';
        setIsGuest(guestStatus);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsGuest(false);
        localStorage.removeItem('hazard_reporter_guest');
        checkAdminStatus(session.user.id).then(() => setLoading(false));
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('hazard_reporter_guest', 'true');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsGuest(false);
    setIsAdmin(false);
    localStorage.removeItem('hazard_reporter_guest');
  };

  return (
    <AuthContext.Provider value={{ user, session, isGuest, isAdmin, loading, loginAsGuest, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
