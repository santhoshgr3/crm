import { useState, useEffect } from 'react';
import axios from 'axios';
import { Lead, Course, User, FollowUp } from '../types';
import { sampleLeads, sampleCourses, sampleCounselors, sampleFollowUps } from '../data/sampleData';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export function useDatabase() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data from backend
  const loadData = async () => {
    setLoading(true);
    try {
      const [leadsRes, coursesRes, usersRes, followUpsRes] = await Promise.all([
        axios.get(`${API_BASE}/leads`),
        axios.get(`${API_BASE}/courses`),
        axios.get(`${API_BASE}/users`),
        axios.get(`${API_BASE}/followups`)
      ]);
      setLeads(leadsRes.data);
      setCourses(coursesRes.data);
      setUsers(usersRes.data);
      setFollowUps(followUpsRes.data);
    } catch (error) {
      toast.error('Failed to load data from backend.');
      setLeads(sampleLeads);
      setCourses(sampleCourses);
      setUsers(sampleCounselors.map(c => ({ ...c, role: 'counselor', preferredLanguage: c.preferredLanguage || 'en', isActive: c.isActive, branch: 'Hyderabad' })));
      setFollowUps(sampleFollowUps);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Lead CRUD
  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> => {
    const res = await axios.post(`${API_BASE}/leads`, leadData);
    setLeads(l => [res.data, ...l]);
    toast.success('Lead added!');
    return res.data;
  };
  const updateLead = async (id: string, updates: Partial<Lead>): Promise<void> => {
    const res = await axios.put(`${API_BASE}/leads/${id}`, updates);
    setLeads(l => l.map(lead => lead.id === id ? res.data : lead));
    toast.success('Lead updated!');
  };
  const deleteLead = async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE}/leads/${id}`);
    setLeads(l => l.filter(lead => lead.id !== id));
    toast.success('Lead deleted!');
  };

  // User CRUD
  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    const res = await axios.post(`${API_BASE}/users`, userData);
    setUsers(u => [...u, res.data]);
    toast.success('User added!');
    return res.data;
  };
  const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
    const res = await axios.put(`${API_BASE}/users/${id}`, updates);
    setUsers(u => u.map(user => user.id === id ? res.data : user));
    toast.success('User updated!');
  };

  // FollowUp CRUD (add as needed)

  const refreshData = loadData;

  return { leads, courses, users, followUps, loading, addLead, updateLead, deleteLead, refreshData, addUser, updateUser };
}