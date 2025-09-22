import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClientUser, AuthState } from '@/types/client';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Map DB profile to ClientUser type
  const mapProfileToClientUser = (profile: any): ClientUser => ({
    id: profile.id,
    email: profile.email,
    password: '',
    firstName: profile.first_name,
    lastName: profile.last_name,
    playerType: profile.player_type,
    isActive: profile.is_active,
    monthlyRenewalDate: profile.monthly_renewal_date ? new Date(profile.monthly_renewal_date) : undefined,
  });

  // Create profile from auth user metadata if missing
  const createProfileFromAuth = async (authUser: any): Promise<ClientUser | null> => {
    try {
      console.log('Creating missing profile for user:', authUser.id);
      
      const { data: newProfile, error } = await supabase
        .from('user_profiles')
        .insert({
          id: authUser.id,
          email: authUser.email,
          first_name: authUser.user_metadata?.firstName || authUser.email.split('@')[0],
          last_name: authUser.user_metadata?.lastName || '',
          player_type: 'amateur',
          is_active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create profile:', error);
        return null;
      }

      return mapProfileToClientUser(newProfile);
    } catch (err) {
      console.error('Error creating profile:', err);
      return null;
    }
  };

  // Fetch or create user profile
  const fetchUserProfile = async (authUser: any): Promise<ClientUser | null> => {
    try {
      console.log('Fetching profile for user:', authUser.id);
      
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (profile) {
        console.log('Profile found:', profile.email);
        return mapProfileToClientUser(profile);
      } else {
        console.log('No profile found, attempting to create one');
        return await createProfileFromAuth(authUser);
      }
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
      return null;
    }
  };

  // Fetch profile with retry and timeout logic
  const fetchProfileWithRetry = async (authUser: any, retries = 2) => {
    setIsLoadingProfile(true);
    setProfileError(null);
    
    // Set a 10-second timeout
    const timeoutId = setTimeout(() => {
      console.error('Profile fetch timed out after 10 seconds');
      setIsLoadingProfile(false);
      setProfileError(isOnline ? 'Profile loading timed out. Please try again.' : 'No internet connection. Please check your network and try again.');
    }, 10000);

    try {
      const clientUser = await fetchUserProfile(authUser);
      clearTimeout(timeoutId); // Clear timeout if successful
      
      if (clientUser) {
        setUser(clientUser);
        localStorage.setItem('client-user', JSON.stringify(clientUser));
        setProfileError(null);
        console.log('Profile loaded successfully');
      } else {
        console.error('Failed to fetch or create user profile');
        setUser(null);
        localStorage.removeItem('client-user');
        setProfileError('Failed to load user profile. Please try again.');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Profile fetch error:', err);
      
      if (retries > 0 && isOnline) {
        console.log(`Retrying profile fetch, ${retries} attempts remaining`);
        setTimeout(() => fetchProfileWithRetry(authUser, retries - 1), 1000);
        return; // Don't set error state during retries
      } else {
        setUser(null);
        localStorage.removeItem('client-user');
        setProfileError(isOnline ? 'Failed to load user profile after multiple attempts.' : 'No internet connection. Please check your network and try again.');
      }
    } finally {
      if (!timeoutId) { // Only clear loading if timeout didn't trigger
        setIsLoadingProfile(false);
      }
    }
  };

  // Manual retry function for user-triggered retries
  const retryProfileLoad = () => {
    if (session?.user) {
      fetchProfileWithRetry(session.user, 2);
    }
  };

  useEffect(() => {
    // Network status listeners
    const handleOnline = () => {
      console.log('Network status: online');
      setIsOnline(true);
      // Retry profile load if we were offline and have a session but no user
      if (session?.user && !user && profileError) {
        retryProfileLoad();
      }
    };
    
    const handleOffline = () => {
      console.log('Network status: offline');
      setIsOnline(false);
      setProfileError('No internet connection. Please check your network and try again.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen to auth state changes FIRST - SYNCHRONOUS callback to avoid deadlocks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('Auth state change:', _event, newSession?.user?.email);
      setSession(newSession);
      
      if (newSession?.user) {
        // Defer profile fetching to avoid deadlock
        setTimeout(() => {
          fetchProfileWithRetry(newSession.user);
        }, 0);
      } else {
        setUser(null);
        localStorage.removeItem('client-user');
        setIsLoadingProfile(false);
        setProfileError(null);
      }
    });

    // Then check for existing session - also defer profile fetching
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      console.log('Initial session check:', existingSession?.user?.email);
      setSession(existingSession);
      
      if (existingSession?.user) {
        setTimeout(() => {
          fetchProfileWithRetry(existingSession.user);
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [session?.user, user, profileError]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (!data.session || !data.user) {
        console.error('No session or user returned from login');
        return false;
      }

      console.log('Login successful - auth state handler will fetch profile');
      return true;
    } catch (err) {
      console.error('Login exception:', err);
      return false;
    }
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
    isLoadingProfile,
    profileError,
    isOnline,
    retryProfileLoad,
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