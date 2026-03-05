'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="w-16 h-16 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Something went wrong!</h1>
        <p className="text-gray-600">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={() => reset()}>
            Try again
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
