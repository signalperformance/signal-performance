import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClientUser, AuthState } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Map DB profile to ClientUser type
  const mapProfileToClientUser = (profile: any): ClientUser => ({
    id: profile.id,
    email: profile.email,
    password: '',
    firstName: profile.first_name,
    lastName: profile.last_name,
    membershipPlan: profile.membership_plan,
    playerType: profile.player_type,
    isActive: profile.is_active,
    monthlyRenewalDate: profile.monthly_renewal_date ? new Date(profile.monthly_renewal_date) : undefined,
  });

  useEffect(() => {
    // Listen to auth state changes FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      
      if (newSession?.user) {
        // Defer fetching profile to avoid deadlocks
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', newSession.user!.id)
            .maybeSingle();

          if (profile) {
            const clientUser = mapProfileToClientUser(profile);
            setUser(clientUser);
            localStorage.setItem('client-user', JSON.stringify(clientUser));
          } else {
            setUser(null);
            localStorage.removeItem('client-user');
          }
        }, 0);
      } else {
        setUser(null);
        localStorage.removeItem('client-user');
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      
      if (existingSession?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', existingSession.user.id)
          .maybeSingle();
        if (profile) {
          const clientUser = mapProfileToClientUser(profile);
          setUser(clientUser);
          localStorage.setItem('client-user', JSON.stringify(clientUser));
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) return false;

    // Wait for session to be set by onAuthStateChange
    return new Promise((resolve) => {
      const checkSession = () => {
        if (session) {
          resolve(true);
        } else {
          setTimeout(checkSession, 50);
        }
      };
      checkSession();
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    localStorage.removeItem('client-user');
  };

  const value: AuthState = {
    user,
    isAuthenticated: !!session,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};