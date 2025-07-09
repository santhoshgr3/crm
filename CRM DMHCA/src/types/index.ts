import { Lead as LeadType } from './lead';

export interface Lead extends LeadType {
  notesList: { date: string; time: string; text: string }[];
}

export interface FollowUp {
  id: string;
  leadId: string;
  date: string;
  note: string;
  counselor: string;
  nextReminderDate?: string;
  completed: boolean;
  whatsappSent?: boolean;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  category: 'Fellowship' | 'PG Diploma' | 'Certification';
  price: number;
  duration: string;
  eligibility: string;
  description: string;
  isActive: boolean;
}

export type UserRole =
  | 'senior_manager'
  | 'manager'
  | 'floor_manager'
  | 'team_leader'
  | 'counselor';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  reportsTo?: string; // userId of the direct manager
  department?: string;
  isActive: boolean;
  preferredLanguage: string;
  whatsappNumber?: string;
  createdAt: string;
  username?: string; // for login credentials
  password?: string; // for login credentials (store hashed in production)
  branch: string; // Branch for the user (Hyderabad, Delhi, Kashmir)
}

export interface Counselor extends User {}

export interface Payment {
  id: string;
  leadId: string;
  courseId: string;
  amount: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Refunded';
  paymentDate?: string;
  transactionId?: string;
  method: 'Online' | 'Cash' | 'Cheque' | 'Bank Transfer';
}

export type LeadStatus =
  | 'Admission done'
  | 'will enroll later'
  | 'Junk'
  | 'Fresh Lead'
  | 'Followup'
  | 'Hot Lead'
  | 'Not Answering'
  | 'Repeated Lead'
  | 'offline/cv'
  | 'Warm'
  | 'Not Interested'
  | 'Not Eligible'
  | 'Not Valid No.'
  | 'Interested, Detail Sent'
  | 'Detail Sent No responding'
  | 'Already enrolled'
  | 'Support query'
  | 'Call Back'
  | 'Fresh Leads'
  | 'Fresh leads'
  | 'Follow up Reassigned'
  | 'Fees issue'
  | 'Hot-Drop out'
  | 'Tried Multiple Times -No Response'
  | 'Fresh'
  | 'repeated lead';

export type LeadSource =
  | 'Website'
  | 'WhatsApp Campaign'
  | 'Instagram Ads'
  | 'Facebook Ads'
  | 'Reference'
  | 'Social Media'
  | 'facebook'
  | 'Web'
  | 'nan'
  | 'None'
  | 'whatsapp campaign'
  | 'ig'
  | 'fb';

export type Country =
  | 'LK'
  | 'IN'
  | 'NP'
  | 'India'
  | 'BD'
  | 'Nepal'
  | 'United States'
  | 'US'
  | 'Sri Lanka'
  | 'Bangladesh'
  | 'PK'
  | 'PH'
  | 'OM'
  | 'MM'
  | 'EG'
  | 'VN'
  | 'SD'
  | 'SG'
  | 'SA'
  | 'MY'
  | 'AM'
  | 'nan'
  | 'Узбекистан'
  | 'UZ'
  | 'Iraq'
  | 'CN'
  | 'Spain'
  | 'UAE'
  | 'Oman'
  | 'Syria'
  | 'Kuwait'
  | 'Qatar'
  | 'Bharain'
  | 'Iran'
  | 'USA'
  | 'Britain'
  | 'China'
  | 'Malaysia'
  | 'Yemen'
  | 'Cambodia'
  | 'Ghana'
  | 'Morocco'
  | 'AE'
  | 'YE'
  | 'Egypt'
  | 'CD'
  | 'JO'
  | 'LY'
  | 'CA'
  | 'RU'
  | 'GB'
  | 'QA'
  | 'PS'
  | 'RO'
  | 'BR'
  | 'DZ'
  | 'TN'
  | 'KW'
  | 'TH'
  | 'Uzbekistan'
  | 'Saudi arabia'
  | 'United State';

export type Qualification =
  | 'MBBS'
  | 'MD/MS/DNB'
  | 'AYUSH'
  | 'BDS/MDS'
  | 'Other'
  | 'Pharm D'
  | 'Nurse'
  | 'BPT / MPT'
  | 'MBBS FMG'
  | 'bsc radiology'
  | 'commerce side'
  | 'nan'
  | 'BAMS'
  | 'BNYS'
  | 'BDS'
  | 'BHMS'
  | 'BAMS MD'
  | 'BDS - MDS'
  | 'MBBS-DNB'
  | 'BAMS-MS'
  | 'MBBS-MD'
  | 'BUMS'
  | 'MBBS-FMG'
  | 'Others'
  | 'OT assistant'
  | 'MBBS/FMG'
  | 'msc'
  | 'other'
  | 'mbbs/fmg';

export interface DashboardStats {
  totalLeads: number;
  hotLeads: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
}