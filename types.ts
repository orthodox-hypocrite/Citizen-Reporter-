
export enum IssueStatus {
  REPORTED = 'REPORTED',
  VERIFYING = 'VERIFYING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export enum IssueCategory {
  POTHOLE = 'POTHOLE',
  WATER_LEAK = 'WATER_LEAK',
  WASTE_MGMT = 'WASTE_MGMT',
  STREET_LIGHT = 'STREET_LIGHT',
  OTHER = 'OTHER'
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface CivicIssue {
  id: string;
  category: IssueCategory;
  description: string;
  location: GeoLocation;
  imageUrl?: string;
  status: IssueStatus;
  priorityScore: number; // 0-100
  aiConfidence: number;
  reporterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  role: 'CITIZEN' | 'AUTHORITY';
  points: number;
  avatar: string;
}

export interface AIAnalysisResult {
  category: IssueCategory;
  severity: number;
  confidence: number;
  verificationStatus: boolean;
  estimatedImpact: string;
}
