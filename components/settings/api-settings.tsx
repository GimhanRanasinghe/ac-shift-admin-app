"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getBaseUrl, updateBaseUrl } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export function ApiSettings() {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    // Get the current base URL when the component mounts
    setBaseUrl(getBaseUrl());
  }, []);

  const handleSave = () => {
    try {
      // Update the base URL in the API client
      updateBaseUrl(baseUrl);
      
      // Save to localStorage for persistence
      localStorage.setItem('api-base-url', baseUrl);
      
      // Show success message
      toast({
        title: "API Settings Updated",
        description: "The API base URL has been updated successfully.",
        variant: "default",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating API base URL:', error);
      
      // Show error message
      toast({
        title: "Error",
        description: "Failed to update API base URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    // Reset to the current base URL
    setBaseUrl(getBaseUrl());
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Configuration</CardTitle>
        <CardDescription>
          Configure the base URL for API requests. Changes will affect all API calls in the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="base-url">Base API URL</Label>
          <div className="flex gap-2">
            <Input
              id="base-url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              disabled={!isEditing}
              placeholder="https://api.example.com/v1"
              className="flex-1"
            />
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </>
            )}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Current API Status: <span className="font-medium text-green-500">Connected</span></p>
          <p className="mt-1">
            Note: Changing the API URL will affect all API requests. Make sure the new URL is correct and accessible.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
