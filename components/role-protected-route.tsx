'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: string | string[]; // Required role(s) to access this route
}

export function RoleProtectedRoute({ children, requiredRole }: RoleProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !loading) {
      router.push('/login');
      return;
    }

    // Check for required role if specified and user is loaded
    if (isAuthenticated && user && requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      // If user doesn't have the required role, redirect to unauthorized page
      if (!roles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, loading, router, user, requiredRole]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, render nothing
  if (!isAuthenticated) {
    return null;
  }
  
  // Check role requirements
  if (user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role)) {
      return null;
    }
  }
  
  // If authenticated and has required role, render children
  return <>{children}</>;
}
