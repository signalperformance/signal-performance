import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClientUser, AuthState } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ClientUser | null>(null);

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Defer fetching profile to avoid deadlocks
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user!.id)
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
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
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

    // Profile will be loaded by the onAuthStateChange listener
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('client-user');
  };

  const value: AuthState = {
    user,
    isAuthenticated: !!user,
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