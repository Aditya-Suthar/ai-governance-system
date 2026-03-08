'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  category: string;
  location: string;
  photo?: File;
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
  title: '',
  description: '',
  category: '',
  location: '',
  photo: undefined,
});


  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file,
      }));
      setFileName(file.name);
    }
  };

  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage(false);

    // Validate required fields
    if (!formData.title.trim()) {
      setErrorMessage('Please enter a title');
      return;
    }

    if (!formData.description.trim()) {
      setErrorMessage('Please enter a description');
      return;
    }

    if (!formData.category) {
      setErrorMessage('Please select a category');
      return;
    }

    if (!formData.location.trim()) {
      setErrorMessage('Please enter a location');
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
  title: formData.title,
  description: formData.description,
  category: formData.category,
  location: formData.location,
};

      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to submit complaint');
      }

      setSuccessMessage(true);
      setFormData({
  title: '',
  description: '',
  category: '',
  location: '',
  photo: undefined,
});
      setFileName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to submit complaint'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-slate-200 dark:border-slate-800 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-800 dark:to-slate-900 text-white rounded-t-lg">
            <CardTitle className="text-3xl">Report a Problem</CardTitle>
            <CardDescription className="text-slate-200">
              Submit a complaint to your local administration
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                <p className="text-green-800 dark:text-green-200 font-medium">
                  Complaint submitted successfully
                </p>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="text-red-800 dark:text-red-200 font-medium">
                  {errorMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Brief title of the complaint"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-slate-300 dark:border-slate-600"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  Description *
                </label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Detailed description of the issue"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={5}
                  className="border-slate-300 dark:border-slate-600 resize-none"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  Category *
                </label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    id="category"
                    className="border-slate-300 dark:border-slate-600"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Roads">Roads</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                    <SelectItem value="Electricity">Electricity</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Sanitation">Sanitation</SelectItem>
                    <SelectItem value="Safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  Location *
                </label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Address or location of the issue"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="border-slate-300 dark:border-slate-600"
                />
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <label
                  htmlFor="photo"
                  className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
                >
                  Upload Photo (optional)
                </label>
                <input
                  ref={fileInputRef}
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePhotoUploadClick}
                    disabled={isLoading}
                    className="border-slate-300 dark:border-slate-600"
                  >
                    Choose Photo
                  </Button>
                  {fileName && (
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {fileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold py-3 text-base"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Complaint'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
