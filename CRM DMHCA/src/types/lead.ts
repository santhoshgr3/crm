export interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  qualification: string;
  source: string;
  courseInterest: string;
  status: string;
  assignedTo: string;
  followUpDate?: string;
  createdAt?: string;
  updatedAt?: string;
  fees?: number;
  totalFees?: number;
  feesCollected?: number;
  modifiedAt?: string; // ISO date string for last modification
  notesList: { date: string; time: string; text: string }[];
}