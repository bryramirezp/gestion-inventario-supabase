'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { Permission, RoleId, getPermissionsForRole, hasPermission as checkPermission, hasAnyPermission, hasAllPermissions } from '@/lib/permissions';

export type Role = 'Administrador' | 'Operador' | 'Consulta';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role_id: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: SupabaseUser | null;
  profile: Profile | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  isLoading: boolean;
  signUpByAdmin: (
    email: string,
    password: string,
    userData?: { full_name: string; role?: Role }
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  hasRole: (roles: Role[]) => boolean;
  isAdmin: () => boolean;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  resendConfirmation: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      console.log(`🔍 [${new Date().toISOString()}] Fetching profile for userId: ${userId}`);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error(`❌ [${new Date().toISOString()}] Profile fetch error:`, error);
        return null;
      }

      if (data) {
        console.log(`✅ [${new Date().toISOString()}] Found profile:`, data);
        return {
          id: data.user_id,
          full_name: data.full_name,
          role_id: data.role_id,
          is_active: data.is_active,
          created_at: data.created_at,
          updated_at: data.updated_at,
        } as Profile;
      }

      console.log(`⚠️ [${new Date().toISOString()}] No profile found for userId: ${userId}`);
      return null;
    } catch (error) {
      console.error(`💥 [${new Date().toISOString()}] Profile fetch exception:`, error);
      return null;
    }
  };

  useEffect(() => {
    let isActive = true;
    let authSubscription: any;

    const handleSession = async (session: Session | null, event?: string) => {
      if (!isActive) return;

      console.log(`🔄 [${new Date().toISOString()}] Handling auth event: ${event || 'INIT'}`);

      try {
        const user = session?.user ?? null;
        setUser(user);

        if (user) {
          console.log(`👤 [${new Date().toISOString()}] User authenticated: ${user.email}`);
          
          // Always fetch profile on initial load or SIGNED_IN event
          const profile = await fetchProfile(user.id);
          
          if (isActive) {
            setProfile(profile);
            
            if (profile?.role_id) {
              const permissions = getPermissionsForRole(profile.role_id as RoleId);
              setPermissions(permissions);
            } else {
              setPermissions([]);
            }
          }
        } else {
          console.log(`🚫 [${new Date().toISOString()}] No authenticated user`);
          setProfile(null);
          setPermissions([]);
        }
      } catch (error) {
        console.error(`⚠️ [${new Date().toISOString()}] Session handling error:`, error);
      } finally {
        if (isActive) {
          setIsLoading(false);
          setIsInitializing(false);
          console.log(`🏁 [${new Date().toISOString()}] Auth initialization complete`);
        }
      }
    };

    // Initialize auth state
    const initAuth = async () => {
      try {
        // Get existing session if any
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        // Set up auth state listener
        authSubscription = supabase.auth.onAuthStateChange((event, session) => {
          handleSession(session, event);
        }).data.subscription;

        // Handle initial session
        await handleSession(session, 'INIT');
      } catch (error) {
        console.error(`💥 [${new Date().toISOString()}] Auth initialization failed:`, error);
        if (isActive) {
          setIsLoading(false);
          setIsInitializing(false);
        }
      }
    };

    initAuth();

    return () => {
      isActive = false;
      authSubscription?.unsubscribe();
    };
  }, []);

  const signUpByAdmin = async (
    email: string,
    password: string,
    userData?: { full_name: string; role?: Role }
  ) => {
    const redirectUrl = `${window.location.origin}/login`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: userData?.full_name || email.split('@')[0],
          role: userData?.role || 'Administrador',
        },
      },
    });
    return { error };
  };

  const resendConfirmation = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
      // Clear local state regardless of API call result
      setUser(null);
      setProfile(null);
      setPermissions([]);
    } catch (error) {
      console.error('Error in signOut:', error);
      // Still clear local state even if there's an error
      setUser(null);
      setProfile(null);
      setPermissions([]);
    }
  };

  // Map rol_id to role names (based on roles_usuario table)
  const getRoleName = (rolId: number): Role => {
    switch (rolId) {
      case 1: return 'Administrador'; // Administrador
      case 2: return 'Operador'; // Operador
      case 3: return 'Consulta'; // Consulta
      default: return 'Consulta'; // Default to basic access
    }
  };

  const hasRole = (roles: Role[]) => profile ? roles.includes(getRoleName(profile.role_id)) : false;
  const isAdmin = () => profile?.role_id === 1; // Solo Administrador

  // Funciones de permisos
  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermissionFunc = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some(perm => permissions.includes(perm));
  };

  const hasAllPermissionsFunc = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(perm => permissions.includes(perm));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        permissions,
        isAuthenticated: !!user,
        isLoading,
        signUpByAdmin,
        signIn,
        signOut,
        hasRole,
        isAdmin,
        hasPermission,
        hasAnyPermission: hasAnyPermissionFunc,
        hasAllPermissions: hasAllPermissionsFunc,
        resendConfirmation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
