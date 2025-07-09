import React, { createContext, useContext, useReducer, ReactNode, useEffect, useState } from 'react';
import { Lead, Course, User, FollowUp, UserRole } from '../types';
import { useDatabase } from '../hooks/useDatabase';

interface CRMState {
  leads: Lead[];
  courses: Course[];
  users: User[];
  followUps: FollowUp[];
  loading: boolean;
  currentUser: User;
}

type CRMAction = 
  | { type: 'SET_DATA'; payload: { leads: Lead[]; courses: Course[]; users: User[]; followUps: FollowUp[] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_LEAD'; payload: Lead }
  | { type: 'UPDATE_LEAD'; payload: Lead }
  | { type: 'DELETE_LEAD'; payload: string }
  | { type: 'UPDATE_LEAD_STATUS'; payload: { id: string; status: string } }
  | { type: 'ADD_FOLLOW_UP'; payload: FollowUp }
  | { type: 'UPDATE_FOLLOW_UP'; payload: FollowUp }
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_USER'; payload: CRMState['currentUser'] };

const initialState: CRMState = {
  leads: [],
  courses: [],
  users: [],
  followUps: [],
  loading: true,
  currentUser: {
    id: 'admin',
    name: 'System Admin',
    email: 'admin@example.com',
    phone: '',
    role: 'senior_manager',
    isActive: true,
    preferredLanguage: 'en',
    createdAt: new Date().toISOString(),
  }
};

function crmReducer(state: CRMState, action: CRMAction): CRMState {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload]
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => user.id === action.payload.id ? action.payload : user)
      };
    case 'ADD_LEAD':
      return {
        ...state,
        leads: [action.payload, ...state.leads]
      };
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(lead => 
          lead.id === action.payload.id ? action.payload : lead
        )
      };
    case 'DELETE_LEAD':
      return {
        ...state,
        leads: state.leads.filter(lead => lead.id !== action.payload)
      };
    case 'UPDATE_LEAD_STATUS':
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id 
            ? { ...lead, status: action.payload.status, updatedAt: new Date().toISOString() }
            : lead
        )
      };
    case 'ADD_FOLLOW_UP':
      return {
        ...state,
        followUps: [action.payload, ...state.followUps]
      };
    case 'UPDATE_FOLLOW_UP':
      return {
        ...state,
        followUps: state.followUps.map(followUp =>
          followUp.id === action.payload.id ? action.payload : followUp
        )
      };
    case 'ADD_COURSE':
      return {
        ...state,
        courses: [...state.courses, action.payload]
      };
    case 'UPDATE_COURSE':
      return {
        ...state,
        courses: state.courses.map(course =>
          course.id === action.payload.id ? action.payload : course
        )
      };
    case 'SET_USER':
      return {
        ...state,
        currentUser: action.payload
      };
    default:
      return state;
  }
}

// Add theme to context type
type CRMContextType = {
  state: CRMState;
  dispatch: React.Dispatch<CRMAction>;
  dbOperations: {
    addUser: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<User>;
    updateUser: (id: string, updates: Partial<User>) => Promise<void>;
    addLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Lead>;
    updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
    deleteLead: (id: string) => Promise<void>;
    refreshData: () => Promise<void>;
  };
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

const CRMContext = createContext<CRMContextType | null>(null);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(crmReducer, initialState);
  const { leads, courses, users, followUps, loading, addLead, updateLead, deleteLead, refreshData, addUser, updateUser } = useDatabase();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    dispatch({
      type: 'SET_DATA',
      payload: { leads, courses, users, followUps }
    });
  }, [leads, courses, users, followUps]);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [loading]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const dbOperations = {
    addUser,
    updateUser,
    addLead,
    updateLead,
    deleteLead,
    refreshData
  };

  return (
    <CRMContext.Provider value={{ state, dispatch, dbOperations, theme, setTheme }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}