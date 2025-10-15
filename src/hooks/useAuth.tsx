'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { Permission, RoleId, getPermissionsForRole, hasPermission, hasAnyPermission, hasAllPermissions } from '@/lib/permissions';

export type Role = 'administrador' | 'voluntario' | 'consulta';

export interface Profile {
  id: string;
  nombre: string;
  email: string;
  rol_id: number;
  activo: boolean;
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
    userData?: { nombre: string; rol?: Role }
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

  const fetchProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) return null;
      return data as Profile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const handleSessionChange = async (session: Session | null) => {
      if (!mounted) return;

      console.log('Handling session change:', session ? 'session exists' : 'no session');

      const user = session?.user ?? null;
      setUser(user);

      if (user) {
        // Set loading to false immediately to unblock UI
        console.log('Setting isLoading to false');
        setIsLoading(false);

        // Fetch profile asynchronously in background
        try {
          console.log('Fetching profile for user:', user.id);
          const userProfile = await fetchProfile(user.id);
          console.log('Profile fetched:', userProfile);
          setProfile(userProfile);

          // Load permissions based on role
          if (userProfile && userProfile.rol_id) {
            const userPermissions = getPermissionsForRole(userProfile.rol_id as RoleId);
            setPermissions(userPermissions);
          } else {
            setPermissions([]);
          }

          // TODO: Re-enable when set_user_context function is created
          // if (userProfile) await supabase.rpc('set_user_context', { user_id: user.id });
        } catch (error) {
          console.error('Profile fetch failed:', error);
          // Don't clear profile on failure - keep existing profile if available
          // Only clear if this is a fresh login (no existing profile)
          if (!profile) {
            setProfile(null);
            setPermissions([]);
          }
        }
      } else {
        console.log('No user, clearing profile and permissions');
        setProfile(null);
        setPermissions([]);
        console.log('Setting isLoading to false');
        setIsLoading(false);
      }
    };

    // Initialize loading state
    setIsLoading(true);

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      // Only handle session changes if component is still mounted
      if (mounted) {
        await handleSessionChange(session);
      }
    });

    // Then check for existing session
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setIsLoading(false);
          return;
        }
        // If there's a session, handle it directly since onAuthStateChange might not trigger
        if (session) {
          if (mounted) {
            await handleSessionChange(session);
          }
        } else {
          // No session found, set loading to false
          if (mounted) setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        if (mounted) setIsLoading(false);
      }
    };

    initializeSession();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signUpByAdmin = async (
    email: string,
    password: string,
    userData?: { nombre: string; rol?: Role }
  ) => {
    const redirectUrl = `${window.location.origin}/login`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nombre: userData?.nombre || email.split('@')[0],
          rol: userData?.rol || 'admin',
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
      case 1: return 'administrador'; // Administrador
      case 3: return 'consulta'; // Consulta
      default: return 'consulta'; // Default to basic access
    }
  };

  const hasRole = (roles: Role[]) => profile ? roles.includes(getRoleName(profile.rol_id)) : false;
  const isAdmin = () => profile?.rol_id === 1; // Solo Administrador

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
