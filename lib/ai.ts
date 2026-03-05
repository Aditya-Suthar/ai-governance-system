import { ComplaintCategory, ComplaintPriority } from './models/Complaint';

const categoryKeywords: Record<ComplaintCategory, string[]> = {
  Infrastructure: ['road', 'bridge', 'pothole', 'street', 'highway', 'construction', 'building', 'infrastructure', 'pavement', 'sidewalk'],
  Healthcare: ['hospital', 'clinic', 'doctor', 'medical', 'health', 'medicine', 'disease', 'patient', 'treatment', 'healthcare'],
  Education: ['school', 'college', 'university', 'student', 'teacher', 'education', 'class', 'exam', 'course', 'academic'],
  Safety: ['crime', 'accident', 'police', 'theft', 'assault', 'robbery', 'dangerous', 'safety', 'security', 'emergency'],
  Utilities: ['water', 'electricity', 'gas', 'power', 'supply', 'bill', 'meter', 'connection', 'utility', 'outage'],
  Other: [],
};

const priorityKeywords = {
  Critical: ['urgent', 'critical', 'emergency', 'immediate', 'severe', 'dangerous', 'life threatening', 'accident'],
  High: ['serious', 'important', 'major', 'significant', 'affecting many', 'widespread'],
  Medium: ['moderate', 'normal', 'regular', 'standard'],
  Low: ['minor', 'small', 'little', 'insignificant'],
};

export function categorizeComplaint(title: string, description: string): ComplaintCategory {
  const text = `${title} ${description}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === 'Other') continue;
    
    const matches = keywords.filter(keyword => text.includes(keyword));
    if (matches.length > 0) {
      return category as ComplaintCategory;
    }
  }
  
  return 'Other';
}

export function assignPriority(title: string, description: string, category: ComplaintCategory): ComplaintPriority {
  const text = `${title} ${description}`.toLowerCase();
  
  for (const [priority, keywords] of Object.entries(priorityKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword));
    if (matches.length > 0) {
      return priority as ComplaintPriority;
    }
  }
  
  // Default priority based on category
  if (category === 'Safety') return 'High';
  if (category === 'Healthcare') return 'High';
  
  return 'Medium';
}
