import { Lead, Course, Counselor, FollowUp } from '../types';

export const sampleCounselors: Counselor[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@dmhca.edu',
    phone: '+91 9876543210',
    department: 'Admissions',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Mr. Rajesh Kumar',
    email: 'rajesh.kumar@dmhca.edu',
    phone: '+91 9876543211',
    department: 'Student Affairs',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'Ms. Sunita Reddy',
    email: 'sunita.reddy@dmhca.edu',
    phone: '+91 9876543212',
    department: 'Course Coordinator',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'Dr. Amit Patel',
    email: 'amit.patel@dmhca.edu',
    phone: '+91 9876543213',
    department: 'Fellowship Programs',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const sampleCourses: Course[] = [
  // Fellowship Programs
  {
    id: '1',
    name: 'Fellowship in Emergency Medicine',
    category: 'Fellowship',
    price: 450000,
    duration: '2 Years',
    eligibility: 'MBBS with 1 year experience',
    description: 'Comprehensive fellowship program in emergency medicine with hands-on training',
    isActive: true
  },
  {
    id: '2',
    name: 'Fellowship in Critical Care Medicine',
    category: 'Fellowship',
    price: 500000,
    duration: '2 Years',
    eligibility: 'MD/MS or DNB',
    description: 'Advanced training in intensive care unit management and critical care protocols',
    isActive: true
  },
  {
    id: '3',
    name: 'Fellowship in Interventional Cardiology',
    category: 'Fellowship',
    price: 650000,
    duration: '1 Year',
    eligibility: 'DM Cardiology or equivalent',
    description: 'Specialized training in cardiac interventional procedures',
    isActive: true
  },
  {
    id: '4',
    name: 'Fellowship in Trauma Surgery',
    category: 'Fellowship',
    price: 480000,
    duration: '18 Months',
    eligibility: 'MS General Surgery',
    description: 'Comprehensive trauma surgery training with emergency protocols',
    isActive: true
  },
  {
    id: '5',
    name: 'Fellowship in Pediatric Surgery',
    category: 'Fellowship',
    price: 520000,
    duration: '2 Years',
    eligibility: 'MS General Surgery with pediatric experience',
    description: 'Specialized pediatric surgical procedures and patient care',
    isActive: true
  },
  // PG Diploma Programs
  {
    id: '6',
    name: 'PG Diploma in Hospital Administration',
    category: 'PG Diploma',
    price: 180000,
    duration: '1 Year',
    eligibility: 'MBBS or MBA',
    description: 'Healthcare management and hospital administration skills',
    isActive: true
  },
  {
    id: '7',
    name: 'PG Diploma in Medical Ethics',
    category: 'PG Diploma',
    price: 120000,
    duration: '6 Months',
    eligibility: 'MBBS or healthcare background',
    description: 'Ethics in medical practice and healthcare delivery',
    isActive: true
  },
  {
    id: '8',
    name: 'PG Diploma in Public Health',
    category: 'PG Diploma',
    price: 150000,
    duration: '1 Year',
    eligibility: 'MBBS or health sciences degree',
    description: 'Community health management and public health policies',
    isActive: true
  },
  {
    id: '9',
    name: 'PG Diploma in Clinical Research',
    category: 'PG Diploma',
    price: 200000,
    duration: '1 Year',
    eligibility: 'MBBS, BDS, or life sciences graduate',
    description: 'Clinical trial management and research methodologies',
    isActive: true
  },
  {
    id: '10',
    name: 'PG Diploma in Medical Education',
    category: 'PG Diploma',
    price: 160000,
    duration: '1 Year',
    eligibility: 'Medical degree with teaching interest',
    description: 'Medical teaching methodologies and curriculum development',
    isActive: true
  },
  // Certification Programs
  {
    id: '11',
    name: 'Basic Life Support (BLS) Certification',
    category: 'Certification',
    price: 5000,
    duration: '2 Days',
    eligibility: 'Healthcare professionals',
    description: 'Essential life-saving techniques and emergency response',
    isActive: true
  },
  {
    id: '12',
    name: 'Advanced Cardiac Life Support (ACLS)',
    category: 'Certification',
    price: 12000,
    duration: '3 Days',
    eligibility: 'BLS certified healthcare professionals',
    description: 'Advanced cardiovascular emergency procedures',
    isActive: true
  },
  {
    id: '13',
    name: 'Pediatric Advanced Life Support (PALS)',
    category: 'Certification',
    price: 15000,
    duration: '2 Days',
    eligibility: 'ACLS certified with pediatric experience',
    description: 'Pediatric emergency care and resuscitation techniques',
    isActive: true
  },
  {
    id: '14',
    name: 'Medical Simulation Training',
    category: 'Certification',
    price: 25000,
    duration: '5 Days',
    eligibility: 'Medical professionals',
    description: 'Hands-on simulation-based medical training',
    isActive: true
  },
  {
    id: '15',
    name: 'Infection Control Certification',
    category: 'Certification',
    price: 8000,
    duration: '2 Days',
    eligibility: 'Healthcare workers',
    description: 'Hospital infection prevention and control protocols',
    isActive: true
  }
];

export const sampleLeads: Lead[] = [
  {
    id: '5794',
    fullName: 'Hesham ibrahim',
    email: 'heshamnoh@hotmail.com',
    phone: '+971507313042',
    country: 'AE',
    qualification: 'MD/MS/DNB',
    source: 'Facebook Ads',
    courseInterest: '',
    status: 'Followup',
    assignedTo: 'Santhosh',
    followUpDate: '2025-06-16T10:30',
    createdAt: '2025-03-09T22:11',
    updatedAt: '2025-06-12T12:52',
    notes: `sd , Didn't answer the call
not answering 5/5/25
not responding 26/5/25
didn't connected 27/5/25
not ans 28/5/25
not ans 30/5/25
NA 2/6/25
na   12/6/25`,
    notesList: []
  },
  {
    id: '16810',
    fullName: 'vishnu harikrishna',
    email: 'vishnuharikrishnan1210@gmail.com',
    phone: '9605468466',
    country: 'IN',
    qualification: 'MD/MS/DNB',
    source: '',
    courseInterest: 'Fellowship in Arthroscopy & Arthroplasty',
    status: '',
    assignedTo: 'Santhosh',
    followUpDate: '2025-05-31T12:30',
    createdAt: '2025-05-31T11:05',
    updatedAt: '2025-05-31T11:05',
    notes: `call ended 31/5/25`,
    notesList: []
  },
  {
    id: '16713',
    fullName: 'Dr Anuashraf',
    email: 'dranuashraf@gmail.com',
    phone: '+919400442325',
    country: 'IN',
    qualification: 'Others',
    source: 'Facebook Ads',
    courseInterest: '',
    status: 'Followup',
    assignedTo: 'Santhosh',
    followUpDate: '2025-06-13T10:30',
    createdAt: '2025-05-30T06:47',
    updatedAt: '2025-06-10T10:47',
    notes: `not ans/ not ans / details shared on whatsapp  30/5/25
not ans / 31/5/25
asking for more discounts (asking for 50k ) 
switch off 2/6/25
switch off 4/6/25
switch off / t 9/6/25
switch off / t 10/6/25`,
    notesList: []
  },
  {
    id: '2139',
    fullName: 'Mahendra Pandey',
    email: '',
    phone: '919117987485',
    country: 'Diabetology / Endocrinology',
    qualification: '+919117987485,',
    source: '',
    courseInterest: '',
    status: 'Followup',
    assignedTo: 'Santhosh',
    followUpDate: '2025-06-16T06:30',
    createdAt: '2025-02-19T08:18',
    updatedAt: '2025-06-12T10:05',
    notes: `cut the call
busy
not answering 5/5/25 
NOT RESPONDING ON CALL ,DETAILS SENT ON WHATSAPP 6/5/25
reminded on whatsapp 8/5/25
not ans 27/5/25
NA / T  4/6/25
na/t 9/6/25
NA / T 10/6/25
NA  12/6/25`,
    notesList: []
  },
  {
    id: '14416',
    fullName: 'Sushree Sangita Mallick (Repeat Lead)',
    email: 'ssmallick499@gmail.com',
    phone: '07077065864',
    country: '',
    qualification: '',
    source: 'Website',
    courseInterest: 'Pg Diploma In Dermatology',
    status: 'Followup',
    assignedTo: 'Santhosh',
    followUpDate: '2025-06-16T06:30',
    createdAt: '2025-05-07T06:37',
    updatedAt: '2025-06-12T13:16',
    notes: `not answering , details sent on whatsapp 7/5/25
line busy 14/5/25
not answering 15/5/25
CURRENTLY BUSY 19/5/25
CURRENTLY BUSY 21/5/25
CURRENTLY BUSY 23/5/25
CURRENTLY BUSY 26/5/25
call again later 29/5/25
didn't connected 2/6/25
na / texted 3/6/25
na 12/6/25`,
    notesList: []
  },
  // ...add more leads as needed...
];

export const sampleFollowUps: FollowUp[] = [
  {
    id: '1',
    leadId: '5794',
    date: '2025-06-16T10:30',
    note: 'Called, no answer. Will try again tomorrow.',
    counselor: 'Santhosh',
    nextReminderDate: '2025-06-17T10:30',
    completed: false,
    whatsappSent: false,
    createdAt: '2025-06-16T10:31'
  },
  {
    id: '2',
    leadId: '16713',
    date: '2025-06-13T10:30',
    note: 'Requested more discount, follow up in 2 days.',
    counselor: 'Santhosh',
    nextReminderDate: '2025-06-15T10:30',
    completed: false,
    whatsappSent: false,
    createdAt: '2025-06-13T10:31'
  }
  // ...add more follow-ups as needed...
];
