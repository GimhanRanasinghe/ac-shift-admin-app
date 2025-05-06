"use client"

import { ReactNode, useEffect } from 'react';
import { initializeApi } from '@/lib/api-init';

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  useEffect(() => {
    // Initialize the API configuration on component mount
    initializeApi();
  }, []);

  return <>{children}</>;
}
