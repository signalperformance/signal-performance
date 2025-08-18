import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
}

interface AdminAuthState {
  adminUser: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthState | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Check if user is an admin
        setTimeout(async () => {
          const { data: adminData } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', session.user!.email)
            .maybeSingle();

          if (adminData) {
            const admin: AdminUser = {
              id: adminData.id,
              email: adminData.email,
            };
            setAdminUser(admin);
            localStorage.setItem('admin-user', JSON.stringify(admin));
          } else {
            setAdminUser(null);
            localStorage.removeItem('admin-user');
          }
          setIsLoading(false);
        }, 0);
      } else {
        setAdminUser(null);
        localStorage.removeItem('admin-user');
        setIsLoading(false);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', session.user.email)
          .maybeSingle();

        if (adminData) {
          const admin: AdminUser = {
            id: adminData.id,
            email: adminData.email,
          };
          setAdminUser(admin);
          localStorage.setItem('admin-user', JSON.stringify(admin));
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // First check if user exists in admin_users table
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (!adminData) {
        return false; // Not an admin user
      }

      // Then authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error || !data.session) {
        return false;
      }

      // AdminUser will be set by the onAuthStateChange listener
      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
    localStorage.removeItem('admin-user');
  };

  const value: AdminAuthState = {
    adminUser,
    isAuthenticated: !!adminUser,
    login,
    logout,
    isLoading,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};