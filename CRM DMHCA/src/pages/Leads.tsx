import React, { useState, useEffect } from 'react';
import { Plus, Filter, Download } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { Lead } from '../types';
import { useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import Select from 'react-select';
import toast from 'react-hot-toast';

export default function Leads() {
  const { state, dispatch, dbOperations } = useCRM();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [counselorFilter, setCounselorFilter] = useState<string>('All');
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [saving, setSaving] = useState(false);
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [detailFollowUpDate, setDetailFollowUpDate] = useState('');
  const [detailFollowUpTime, setDetailFollowUpTime] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Lead>>({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    qualification: '',
    source: '',
    status: '',
    assignedTo: '',
    courseInterest: '',
  });
  const [adding, setAdding] = useState(false);
  const [showHotLeads, setShowHotLeads] = useState(false);
  const [leadView, setLeadView] = useState<'all' | 'hot' | 'warm' | 'followup'>('all');
  const location = useLocation();

  // --- FETCH LEADS FROM BACKEND API ---
  useEffect(() => {
    dbOperations.refreshData();
    // eslint-disable-next-line
  }, []);
  // --- END FETCH LEADS ---

  // Persist filters in localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem('leadStatusFilter');
    const savedCounselor = localStorage.getItem('leadCounselorFilter');
    if (savedStatus) setStatusFilter(savedStatus);
    if (savedCounselor) setCounselorFilter(savedCounselor);
  }, []);
  useEffect(() => {
    localStorage.setItem('leadStatusFilter', statusFilter);
    localStorage.setItem('leadCounselorFilter', counselorFilter);
  }, [statusFilter, counselorFilter]);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status && allStatuses.includes(status)) {
      setStatusFilter(status);
    }
  }, [location.search]);

  // Additional filters
  const [createdOnFilter, setCreatedOnFilter] = useState('');
  const [updatedOnFilter, setUpdatedOnFilter] = useState('');
  const [modifiedDate, setModifiedDate] = useState('');
  const [modifiedType, setModifiedType] = useState<'on' | 'before' | 'after' | 'between'>('on');
  const [modifiedDateStart, setModifiedDateStart] = useState('');
  const [modifiedDateEnd, setModifiedDateEnd] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'fullName',
    'phone',
    'country',
    'qualification',
    'source',
    'status',
    'assignedTo',
    'createdAt',
    'updatedAt',
  ]);
  useEffect(() => {
    if (selectedColumns.length === 0) {
      setSelectedColumns([
        'id',
        'fullName',
        'phone',
        'country',
        'qualification',
        'source',
        'status',
        'assignedTo',
        'createdAt',
        'updatedAt',
      ]);
    }
  }, [selectedColumns]);

  // Unique options for dropdowns
  const countryOptions = Array.from(new Set((state.leads || []).map(l => l.country).filter(Boolean)));
  const sourceOptions = Array.from(new Set((state.leads || []).map(l => l.source).filter(Boolean)));
  const qualificationOptions = Array.from(new Set((state.leads || []).map(l => l.qualification).filter(Boolean)));
  const courseOptions = (state.courses || []);
  const currentUser = state.currentUser;
  const [statusMulti, setStatusMulti] = useState<string[]>([]);
  const [counselorMulti, setCounselorMulti] = useState<string[]>([]);
  const [countryMulti, setCountryMulti] = useState<string[]>([]);
  const [sourceMulti, setSourceMulti] = useState<string[]>([]);
  const [qualificationMulti, setQualificationMulti] = useState<string[]>([]);
  const [dateType, setDateType] = useState<'on' | 'after' | 'before' | 'between'>('on');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // All statuses for filter and dropdowns
  const allStatuses = [
    'All',
    'Admission done',
    'will enroll later',
    'Junk',
    'Fresh Lead',
    'Followup',
    'Hot Lead',
    'Not Answering',
    'Repeated Lead',
    'offline/cv',
    'Warm',
    'Not Interested',
    'Not Eligible',
    'Not Valid No.',
    'Interested, Detail Sent',
    'Detail Sent No responding',
    'Already enrolled',
    'Support query',
    'Call Back',
    'Fresh Leads',
    'Fresh leads',
    'Follow up Reassigned',
    'Fees issue',
    'Hot-Drop out',
    'Tried Multiple Times -No Response',
    'Fresh',
    'Hot',
    'Follow-Up'
  ];

  // Helper: get assignable users based on current user's role
  const roleLabels: Record<string, string> = {
    senior_manager: 'Senior Manager',
    manager: 'Manager',
    floor_manager: 'Floor Manager',
    team_leader: 'Team Leader',
    counselor: 'Counselor',
  };
  const roleHierarchy = [
    'senior_manager',
    'manager',
    'floor_manager',
    'team_leader',
    'counselor',
  ];
  const myRoleIdx = roleHierarchy.indexOf(currentUser.role);
  function getAssignableUsers() {
    if (myRoleIdx === -1) return [];
    const assignableRoles = roleHierarchy.slice(myRoleIdx + 1);
    return (state.users || []).filter(u => assignableRoles.includes(u.role));
  }
  function getHierarchyDisplay(assignedToId?: string) {
    if (!assignedToId) return null;
    const user = (state.users || []).find(u => u.id === assignedToId);
    if (!user) return null;
    const manager = (state.users || []).find(u => u.id === user.reportsTo);
    if (manager) {
      return <span>Reports to: <b>{manager.name}</b> ({roleLabels[manager.role]})</span>;
    }
    return null;
  }

  // Filtered leads with all filters and role-based visibility
  const filteredLeads = React.useMemo(() => {
    let visibleLeads = state.leads;
    if (currentUser.role !== 'senior_manager' && currentUser.role !== 'manager') {
      const getAllReportIds = (userId: string): string[] => {
        const directReports = (state.users || []).filter(u => u.reportsTo === userId).map(u => u.id);
        let all = [...directReports];
        for (const dr of directReports) {
          all = all.concat(getAllReportIds(dr));
        }
        return all;
      };
      const allowedUserIds = [currentUser.id, ...getAllReportIds(currentUser.id)];
      visibleLeads = state.leads.filter((lead: Lead) => allowedUserIds.includes(lead.assignedTo));
    }
    return visibleLeads.filter((lead: Lead) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !term ||
        (lead.fullName && lead.fullName.toLowerCase().includes(term)) ||
        (lead.email && lead.email.toLowerCase().includes(term)) ||
        (lead.phone && lead.phone.toLowerCase().includes(term)) ||
        (lead.courseInterest && lead.courseInterest.toLowerCase().includes(term)) ||
        (lead.country && lead.country.toLowerCase().includes(term)) ||
        (lead.status && lead.status.toLowerCase().includes(term));
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesCounselor = counselorFilter === 'All' || lead.assignedTo === counselorFilter;
      const matchesCreated = !createdOnFilter || (lead.createdAt && lead.createdAt.startsWith(createdOnFilter));
      const matchesUpdated = !updatedOnFilter || (lead.updatedAt && lead.updatedAt.startsWith(updatedOnFilter));
      let matchesModified = true;
      const leadDate = lead.updatedAt ? lead.updatedAt.slice(0, 10) : '';
      if (modifiedType === 'on' && modifiedDate) matchesModified = leadDate === modifiedDate;
      else if (modifiedType === 'before' && modifiedDate) matchesModified = leadDate < modifiedDate;
      else if (modifiedType === 'after' && modifiedDate) matchesModified = leadDate > modifiedDate;
      else if (modifiedType === 'between' && modifiedDateStart && modifiedDateEnd) matchesModified = leadDate >= modifiedDateStart && leadDate <= modifiedDateEnd;
      const matchesStatusMulti = statusMulti.length === 0 || statusMulti.includes(lead.status);
      const matchesCounselorMulti = counselorMulti.length === 0 || counselorMulti.includes(lead.assignedTo);
      const matchesCountryMulti = countryMulti.length === 0 || countryMulti.includes(lead.country);
      const matchesSourceMulti = sourceMulti.length === 0 || sourceMulti.includes(lead.source);
      const matchesQualificationMulti = qualificationMulti.length === 0 || qualificationMulti.includes(lead.qualification);
      return matchesSearch && matchesStatus && matchesCounselor && matchesCreated && matchesUpdated && matchesModified && matchesStatusMulti && matchesCounselorMulti && matchesCountryMulti && matchesSourceMulti && matchesQualificationMulti;
    });
  }, [state.leads, searchTerm, statusFilter, counselorFilter, createdOnFilter, updatedOnFilter, state.users, currentUser, modifiedDate, modifiedType, statusMulti, counselorMulti, countryMulti, sourceMulti, qualificationMulti]);

  const handleEditLead = (lead: Lead) => {
    setEditLead(lead);
    setEditForm({ ...lead });
  };
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };
  const handleAddFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm(f => ({ ...f, [name]: value }));
  };

  // Edit Lead Save
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editForm.status === 'Admission done' && (!editForm.totalFees || !editForm.feesCollected)) {
      alert('Please enter both Total Fees and Fees Collected for Admission done leads.');
      return;
    }
    if (!editLead) return;
    setSaving(true);
    try {
      await dbOperations.updateLead(editLead.id, editForm);
      dispatch({ type: 'UPDATE_LEAD', payload: { ...editLead, ...editForm } });
      setEditLead(null);
      toast.success('Lead updated!');
    } catch (err) {
      alert('Failed to update lead');
    } finally {
      setSaving(false);
    }
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await dbOperations.deleteLead(leadId);
        dispatch({ type: 'DELETE_LEAD', payload: leadId });
        toast.success('Lead deleted!');
      } catch {
        toast.error('Failed to delete lead');
      }
    }
  };

  // Add Lead
  async function handleAddLead(e: React.FormEvent) {
    e.preventDefault();
    if (addForm.status === 'Admission done' && (!addForm.totalFees || !addForm.feesCollected)) {
      alert('Please enter both Total Fees and Fees Collected for Admission done leads.');
      return;
    }
    setAdding(true);
    try {
      const newLead = await dbOperations.addLead(addForm as Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>);
      dispatch({ type: 'ADD_LEAD', payload: newLead });
      setShowAddModal(false);
      setAddForm({ fullName: '', email: '', phone: '', country: '', qualification: '', source: '', status: allStatuses[1], assignedTo: '', courseInterest: '' });
      toast.success('Lead added!');
    } catch {
      toast.error('Failed to add lead');
    } finally {
      setAdding(false);
    }
  }

  // CSV Import (REST API)
  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const { data } = results;
        try {
          // Batch import via backend API
          await Promise.all(data.map((row: any) => dbOperations.addLead(row)));
          toast.success('Leads imported and saved to database!');
          dbOperations.refreshData();
        } catch (error) {
          toast.error('Error importing leads.');
        }
      }
    });
  };

  // Save notes and follow-up date/time in the detail modal
  async function handleDetailSave() {
    if (!detailLead) return;
    if (!detailFollowUpDate || !detailFollowUpTime) {
      alert('Please enter both date and time for the note.');
      return;
    }
    const notesDate = `${detailFollowUpDate} ${detailFollowUpTime}`;
    try {
      await dbOperations.updateLead(detailLead.id, { ...detailLead, updatedAt: new Date().toISOString(), notesDate });
      dispatch({ type: 'UPDATE_LEAD', payload: { ...detailLead, updatedAt: new Date().toISOString(), notesDate } });
      setDetailLead(null);
      setDetailFollowUpDate('');
      setDetailFollowUpTime('');
      toast.success('Lead details saved!');
    } catch {
      toast.error('Failed to save lead details.');
    }
  }

  // Check for due follow-ups every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      (state.leads || []).forEach(lead => {
        if (lead.notesDate) {
          const followupDate = new Date(lead.notesDate);
          // Show popup if follow-up is due within the next 2 minutes
          if (
            Math.abs(now.getTime() - followupDate.getTime()) < 2 * 60 * 1000 &&
            followupDate.getTime() <= now.getTime()
          ) {
            toast(
              <div>
                <b>Follow-up Reminder</b>
                <div className="mt-1">You have to talk with <b>{lead.fullName}</b> ({lead.phone})</div>
                <div className="text-xs text-gray-500">Scheduled: {followupDate.toLocaleString()}</div>
              </div>,
              { duration: 10000 }
            );
          }
        }
      });
    }, 60000); // check every minute
    return () => clearInterval(interval);
  }, [state.leads]);

  const handleResetFilters = () => {
    setLeadView('all');
    setStatusFilter('All');
    setCounselorFilter('All');
    setSearchTerm('');
  };

  // Save Filter and Load Filter functionality
  const [savedFilters, setSavedFilters] = useState<{name: string, config: any}[]>([]);
  const [showSaveFilterModal, setShowSaveFilterModal] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');
  const [selectedSavedFilter, setSelectedSavedFilter] = useState('');

  // Load saved filters from localStorage on mount
  useEffect(() => {
    const filters = JSON.parse(localStorage.getItem('leadSavedFilters') || '[]');
    setSavedFilters(filters);
  }, []);

  // Save a new filter
  const handleSaveFilter = () => {
    if (!newFilterName.trim()) return;
    const config = {
      leadView,
      statusFilter,
      counselorFilter,
      searchTerm,
      dateType,
      dateStart,
      dateEnd,
      // Add more filter states here if needed
    };
    const filters = [...savedFilters, { name: newFilterName, config }];
    setSavedFilters(filters);
    localStorage.setItem('leadSavedFilters', JSON.stringify(filters));
    setShowSaveFilterModal(false);
    setNewFilterName('');
  };

  // Load a saved filter
  const handleLoadFilter = (filterName: string) => {
    const filter = savedFilters.find(f => f.name === filterName);
    if (filter) {
      setLeadView(filter.config.leadView);
      setStatusFilter(filter.config.statusFilter);
      setCounselorFilter(filter.config.counselorFilter);
      setSearchTerm(filter.config.searchTerm);
      setDateType(filter.config.dateType || 'on');
      setDateStart(filter.config.dateStart || '');
      setDateEnd(filter.config.dateEnd || '');
      // Add more filter states here if needed
      setSelectedSavedFilter(filterName);
    }
  };

  const [detailNotes, setDetailNotes] = useState('');
  const [addNoteMode, setAddNoteMode] = useState(false);

  // Add a dummy handleExport function to prevent runtime errors
  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Export functionality is not implemented yet.');
  };

  // Main return for the Leads component
  return (
    <>
      {/* Edit Lead Modal */}
      {editLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative border border-maroon-200">
            <button className="absolute top-2 right-2 text-maroon-400 hover:text-maroon-700" onClick={() => setEditLead(null)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-maroon-800">Edit Lead</h2>
            <form onSubmit={handleEditFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Name</label>
                <input name="fullName" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={editForm.fullName || ''} onChange={handleEditFormChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Email</label>
                <input name="email" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={editForm.email || ''} onChange={handleEditFormChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Phone</label>
                <input name="phone" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={editForm.phone || ''} onChange={handleEditFormChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Assigned To</label>
                <select name="assignedTo" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={editForm.assignedTo || ''} onChange={handleEditFormChange} required>
                  {getAssignableUsers().map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({roleLabels[u.role]})</option>
                  ))}
                </select>
                {/* Hierarchy display */}
                <div className="mt-2 text-xs text-gray-500">
                 
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Course Interest</label>
                <input name="courseInterest" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={editForm.courseInterest || ''} onChange={handleEditFormChange} />
              </div>
              <div className="flex justify-end">
                <button type="button" className="px-4 py-2 mr-2 bg-gray-200 rounded" onClick={() => setEditLead(null)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-maroon-600 text-white rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
  
      {/* Lead Details Modal */}
      {detailLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-8 w-screen h-screen overflow-y-auto relative border border-maroon-200 flex flex-col">
            <button className="absolute top-2 right-2 text-maroon-400 hover:text-maroon-700 text-3xl" onClick={() => setDetailLead(null)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-maroon-800">Lead Details</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input className="w-full border rounded px-3 py-2" value={detailLead.fullName} onChange={e => setDetailLead({ ...detailLead, fullName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="w-full border rounded px-3 py-2" value={detailLead.email} onChange={e => setDetailLead({ ...detailLead, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input className="w-full border rounded px-3 py-2" value={detailLead.phone} onChange={e => setDetailLead({ ...detailLead, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.country} onChange={e => setDetailLead({ ...detailLead, country: e.target.value })}>
                  <option value="">Select Country</option>
                  {countryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Qualification</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.qualification} onChange={e => setDetailLead({ ...detailLead, qualification: e.target.value })}>
                  <option value="">Select Qualification</option>
                  {qualificationOptions.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Source</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.source} onChange={e => setDetailLead({ ...detailLead, source: e.target.value })}>
                  <option value="">Select Source</option>
                  {sourceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course Interest</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.courseInterest} onChange={e => setDetailLead({ ...detailLead, courseInterest: e.target.value })}>
                  <option value="">Select Course</option>
                  {courseOptions.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.status} onChange={e => setDetailLead({ ...detailLead, status: e.target.value })}>
                  <option value="">Select Status</option>
                  {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.assignedTo} onChange={e => setDetailLead({ ...detailLead, assignedTo: e.target.value })}>
                  <option value="">Select User</option>
                  {state.users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Follow Up Date</label>
                <input type="date" className="w-full border rounded px-3 py-2" value={detailLead.followUpDate ? detailLead.followUpDate.slice(0,10) : ''} onChange={e => setDetailLead({ ...detailLead, followUpDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Created At</label>
                <input className="w-full border rounded px-3 py-2" value={detailLead.createdAt ? new Date(detailLead.createdAt).toLocaleString() : ''} readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Updated At</label>
                <input className="w-full border rounded px-3 py-2" value={detailLead.updatedAt ? new Date(detailLead.updatedAt).toLocaleString() : ''} readOnly />
              </div>
            </form>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Total Fees</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={detailLead.totalFees || ''} onChange={e => setDetailLead({ ...detailLead, totalFees: Number(e.target.value) })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fees Collected</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={detailLead.feesCollected || ''} onChange={e => setDetailLead({ ...detailLead, feesCollected: Number(e.target.value) })} />
              </div>
            </form>
            {/* Notes Section */}
            <div className="mb-6">
              <label className="block text-lg font-medium mb-2 text-maroon-700">Notes</label>
              <div className="flex flex-col gap-2">
                {/* Show all saved notes in a single, read-only textarea */}
                <textarea
                  className="w-full border-2 border-maroon-400 rounded px-3 py-2 focus:ring-maroon-400 min-h-[120px] bg-gray-50"
                  value={
                    (detailLead.notesList || [])
                      .map(note => `${note.date} / ${note.time}   ${note.text}`)
                      .join('\n\n')
                  }
                  readOnly
                />
                {/* Add Note UI */}
                {addNoteMode ? (
                  <>
                    <textarea
                      className="w-full border-2 border-maroon-400 rounded px-3 py-2 focus:ring-maroon-400 min-h-[80px]"
                      rows={3}
                      placeholder="Write a note..."
                      value={detailNotes}
                      onChange={e => setDetailNotes(e.target.value)}
                      required
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 text-maroon-700 rounded"
                        onClick={() => { setDetailNotes(''); setAddNoteMode(false); }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 bg-maroon-600 text-white rounded"
                        disabled={!detailNotes}
                        onClick={() => {
                          const now = new Date();
                          const date = now.toLocaleDateString();
                          const time = now.toLocaleTimeString();
                          const newNote = { text: detailNotes, date, time };
                          const updatedNotesList = Array.isArray(detailLead.notesList) ? [...detailLead.notesList, newNote] : [newNote];
                          setDetailLead({ ...detailLead, notesList: updatedNotesList });
                          setDetailNotes('');
                          setAddNoteMode(false);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    type="button"
                    className="px-4 py-2 bg-maroon-600 text-white rounded self-end"
                    onClick={() => setAddNoteMode(true)}
                  >
                    Add Note
                  </button>
                )}
              </div>
            </div>
             {/* Save Button at the bottom of Lead Details Modal */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 text-white rounded text-lg font-semibold shadow hover:bg-blue-700 transition-colors"
                onClick={handleDetailSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full h-full max-w-5xl overflow-y-auto relative border border-maroon-200 flex flex-col">
            <button className="absolute top-2 right-2 text-maroon-400 hover:text-maroon-700 text-3xl" onClick={() => setShowAddModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-maroon-800">Add Lead</h2>
            <form onSubmit={handleAddLead} className="space-y-4 flex-1 flex flex-col">
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Full Name</label>
                <input name="fullName" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.fullName || ''} onChange={handleAddFormChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Email</label>
                <input name="email" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.email || ''} onChange={handleAddFormChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Phone</label>
                <input name="phone" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.phone || ''} onChange={handleAddFormChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Country</label>
                <input name="country" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.country || ''} onChange={handleAddFormChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Qualification</label>
                <input name="qualification" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.qualification || ''} onChange={handleAddFormChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Source</label>
                <input name="source" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.source || ''} onChange={handleAddFormChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Status</label>
                <select name="status" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.status || ''} onChange={handleAddFormChange} required>
                  {allStatuses.filter(s => s !== 'All').map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Assigned To</label>
                <select name="assignedTo" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.assignedTo || ''} onChange={handleAddFormChange} required>
                  {(state.users || []).map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Course Interest</label>
                <input name="courseInterest" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.courseInterest || ''} onChange={handleAddFormChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-maroon-700">Fees</label>
                <input name="fees" type="number" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.fees || ''} onChange={handleAddFormChange} />
              </div>
              {addForm.status === 'Admission done' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-maroon-700">Total Fees<span className="text-red-500">*</span></label>
                    <input name="totalFees" type="number" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.totalFees || ''} onChange={handleAddFormChange} required={addForm.status === 'Admission done'} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-maroon-700">Fees Collected<span className="text-red-500">*</span></label>
                    <input name="feesCollected" type="number" className="w-full border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400" value={addForm.feesCollected || ''} onChange={handleAddFormChange} required={addForm.status === 'Admission done'} />
                  </div>
                </>
              )}
              <div className="flex justify-end mt-auto">
                <button type="button" className="px-4 py-2 mr-2 bg-gray-200 rounded" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-maroon-600 text-white rounded" disabled={adding}>{adding ? 'Adding...' : 'Add Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
  
      {/* FILTERS UI BLOCK - Modern, multi-select, and date filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-maroon-700 mb-1">Search</label>
          <input
            type="text"
            className="border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400 min-w-[180px]"
            placeholder="Search by name, email, or course"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col min-w-[180px]">
          <label className="text-xs font-semibold text-maroon-700 mb-1">Status</label>
          <Select
            isMulti
            options={allStatuses.filter(s => s !== 'All').map(s => ({ value: s, label: s }))}
            value={statusMulti.map(s => ({ value: s, label: s }))}
            onChange={opts => setStatusMulti(opts.map(o => o.value))}
            placeholder="All Statuses"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex flex-col min-w-[180px]">
          <label className="text-xs font-semibold text-maroon-700 mb-1">Counselor</label>
          <Select
            isMulti
            options={(state.users || []).map(u => ({ value: u.id, label: u.name }))}
            value={counselorMulti.map(id => {
              const u = (state.users || []).find(u => u.id === id);
              return u ? { value: u.id, label: u.name } : null;
            }).filter(Boolean)}
            onChange={opts => setCounselorMulti(opts && Array.isArray(opts) ? opts.filter(Boolean).map(o => o.value) : [])}
            placeholder="All Counselors"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex flex-col min-w-[180px]">
          <label className="text-xs font-semibold text-maroon-700 mb-1">Country</label>
          <Select
            isMulti
            options={countryOptions.map(c => ({ value: c, label: c }))}
            value={countryMulti.map(c => ({ value: c, label: c }))}
            onChange={opts => setCountryMulti(opts.map(o => o.value))}
            placeholder="All Countries"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex flex-col min-w-[180px]">
          <label className="text-xs font-semibold text-maroon-700 mb-1">Source</label>
          <Select
            isMulti
            options={sourceOptions.map(s => ({ value: s, label: s }))}
            value={sourceMulti.map(s => ({ value: s, label: s }))}
            onChange={opts => setSourceMulti(opts.map(o => o.value))}
            placeholder="All Sources"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex flex-col min-w-[180px]">
          <label className="text-xs font-semibold text-maroon-700 mb-1">Qualification</label>
          <Select
            isMulti
            options={qualificationOptions.map(q => ({ value: q, label: q }))}
            value={qualificationMulti.map(q => ({ value: q, label: q }))}
            onChange={opts => setQualificationMulti(opts.map(o => o.value))}
            placeholder="All Qualifications"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-maroon-700 mb-1">Created Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400"
            value={createdOnFilter}
            onChange={e => setCreatedOnFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-maroon-700 mb-1">Updated Date</label>
          <input
            type="date"
            className="border rounded px-3 py-2 border-maroon-200 focus:ring-maroon-400"
            value={updatedOnFilter}
            onChange={e => setUpdatedOnFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col min-w-[180px]">
          <label className="text-xs font-semibold text-maroon-700 mb-1">Modified Date</label>
          <div className="flex gap-2">
            <select
              className="border rounded px-2 py-1 border-maroon-200 focus:ring-maroon-400"
              value={modifiedType}
              onChange={e => setModifiedType(e.target.value)}
            >
              <option value="on">On</option>
              <option value="before">Before</option>
              <option value="after">After</option>
              <option value="between">Between</option>
            </select>
            {modifiedType === 'between' ? (
              <>
                <input
                  type="date"
                  className="border rounded px-2 py-1 border-maroon-200 focus:ring-maroon-400"
                  value={modifiedDateStart}
                  onChange={e => setModifiedDateStart(e.target.value)}
                />
                <span className="self-center">to</span>
                <input
                  type="date"
                  className="border rounded px-2 py-1 border-maroon-200 focus:ring-maroon-400"
                  value={modifiedDateEnd}
                  onChange={e => setModifiedDateEnd(e.target.value)}
                />
              </>
            ) : (
              <input
                type="date"
                className="border rounded px-2 py-1 border-maroon-200 focus:ring-maroon-400"
                value={modifiedDate}
                onChange={e => setModifiedDate(e.target.value)}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col min-w-[180px]">
          <label className="text-xs font-semibold text-maroon-700 mb-1">Columns</label>
          <Select
            isMulti
            options={[
              { value: 'fullName', label: 'Full Name' },
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
              { value: 'country', label: 'Country' },
              { value: 'qualification', label: 'Qualification' },
              { value: 'source', label: 'Source' },
              { value: 'status', label: 'Status' },
              { value: 'assignedTo', label: 'Assigned To' },
              { value: 'courseInterest', label: 'Course Interest' },
              { value: 'createdAt', label: 'Created At' },
              { value: 'updatedAt', label: 'Updated At' },
              { value: 'totalFees', label: 'Total Fees' },
              { value: 'feesCollected', label: 'Fees Collected' },
            ]}
            value={selectedColumns.map(col => ({ value: col, label: col.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) }))}
            onChange={opts => setSelectedColumns(opts.map(o => o.value))}
            placeholder="Select Columns"
            classNamePrefix="react-select"
          />
        </div>
        <div className="flex flex-col justify-end">
          <button
            className="bg-white border-2 border-[#8B0000] text-[#8B0000] font-bold px-5 py-2 rounded flex items-center gap-2"
            onClick={handleExport}
            type="button"
          >
            <Download className="w-4 h-4 mr-1" /> Export
          </button>
        </div>
        <div className="flex flex-row gap-2 items-end">
          <div className="flex flex-col justify-end">
            <button
              className="bg-white border-2 border-[#8B0000] text-[#8B0000] font-bold px-5 py-2 rounded mr-2 flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
              type="button"
            >
              <Plus className="w-4 h-4" /> Add Lead
            </button>
          </div>
          <div className="flex flex-col justify-end">
            <label className="bg-white border-2 border-[#8B0000] text-[#8B0000] font-bold px-5 py-2 rounded mr-2 flex items-center gap-2 cursor-pointer">
              Import Leads (CSV)
              <input type="file" accept=".csv" onChange={handleCSVImport} hidden />
            </label>
          </div>
          <div className="flex flex-col justify-end">
            <button
              className={`bg-white border-2 border-[#8B0000] font-bold px-5 py-2 rounded mr-2 flex items-center gap-2 ${leadView === 'hot' ? 'text-white bg-[#8B0000]' : 'text-[#8B0000]'}`}
              onClick={() => setLeadView(leadView === 'hot' ? 'all' : 'hot')}
              type="button"
            >
              🔥 Hot Leads
            </button>
          </div>
          <div className="flex flex-col justify-end">
            <button
              className={`bg-white border-2 border-yellow-700 font-bold px-5 py-2 rounded mr-2 flex items-center gap-2 ${leadView === 'warm' ? 'text-white bg-yellow-700' : 'text-yellow-700'}`}
              onClick={() => setLeadView(leadView === 'warm' ? 'all' : 'warm')}
              type="button"
            >
              🌤️ Warm Leads
            </button>
          </div>
          <div className="flex flex-col justify-end">
            <button
              className={`bg-white border-2 border-blue-700 font-bold px-5 py-2 rounded mr-2 flex items-center gap-2 ${leadView === 'followup' ? 'text-white bg-blue-700' : 'text-blue-700'}`}
              onClick={() => setLeadView(leadView === 'followup' ? 'all' : 'followup')}
              type="button"
            >
              ⏰ Follow Up
            </button>
          </div>
          <div className="flex flex-col justify-end">
            <button
              className="bg-white border-2 border-gray-400 text-gray-800 font-bold px-5 py-2 rounded flex items-center gap-2"
              onClick={handleResetFilters}
              type="button"
            >
              Reset Filters
            </button>
          </div>
          <div className="flex flex-col justify-end">
            <button
              className="bg-white border-2 border-green-700 text-green-700 font-bold px-5 py-2 rounded mr-2"
              onClick={() => setShowSaveFilterModal(true)}
              type="button"
            >
              Save Filter
            </button>
          </div>
          <div className="flex flex-col justify-end">
            <select
              className="bg-white border-2 border-green-700 text-green-700 font-bold px-5 py-2 rounded mr-2"
              value={selectedSavedFilter}
              onChange={e => handleLoadFilter(e.target.value)}
            >
              <option value="">Load Filter</option>
              {savedFilters.map(f => (
                <option key={f.name} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {/* END FILTERS UI BLOCK */}
  
      {/* LEADS TABLE - Displayed below filters */}
      <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">
                <input type="checkbox" disabled />
              </th>
              {selectedColumns.includes('id') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">ID</th>
              )}
              {selectedColumns.includes('fullName') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Full Name</th>
              )}
              {selectedColumns.includes('email') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Email</th>
              )}
              {selectedColumns.includes('phone') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Phone</th>
              )}
              {selectedColumns.includes('country') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Country</th>
              )}
              {selectedColumns.includes('qualification') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Qualification</th>
              )}
              {selectedColumns.includes('source') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Source</th>
              )}
              {selectedColumns.includes('status') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Status</th>
              )}
              {selectedColumns.includes('assignedTo') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Assigned To</th>
              )}
              {selectedColumns.includes('courseInterest') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Course Interest</th>
              )}
              {selectedColumns.includes('createdAt') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Created At</th>
              )}
              {selectedColumns.includes('updatedAt') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Updated At</th>
              )}
              {selectedColumns.includes('totalFees') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Total Fees</th>
              )}
              {selectedColumns.includes('feesCollected') && (
                <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Fees Collected</th>
              )}
              <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(leadView === 'hot'
              ? (state.leads || []).filter(l => l.status && l.status.toLowerCase().includes('hot'))
              : leadView === 'warm'
              ? (state.leads || []).filter(l => l.status && l.status.toLowerCase().includes('warm'))
              : leadView === 'followup'
              ? (state.leads || []).filter(l => l.status && l.status.toLowerCase().includes('follow'))
              : filteredLeads).map((lead) => (
              <tr key={lead.id} className="hover:bg-violet-50 cursor-pointer" onClick={() => setDetailLead(lead)}>
                <td className="px-3 py-2"><input type="checkbox" disabled /></td>
                {selectedColumns.includes('id') && <td className="px-3 py-2">{lead.id}</td>}
                {selectedColumns.includes('fullName') && <td className="px-3 py-2 whitespace-pre-line">{lead.fullName}</td>}
                {selectedColumns.includes('email') && <td className="px-3 py-2">{lead.email}</td>}
                {selectedColumns.includes('phone') && <td className="px-3 py-2">{lead.phone}</td>}
                {selectedColumns.includes('country') && <td className="px-3 py-2">{lead.country}</td>}
                {selectedColumns.includes('qualification') && <td className="px-3 py-2">{lead.qualification}</td>}
                {selectedColumns.includes('source') && <td className="px-3 py-2">{lead.source}</td>}
                {selectedColumns.includes('status') && <td className="px-3 py-2">{lead.status}</td>}
                {selectedColumns.includes('assignedTo') && <td className="px-3 py-2">{(state.users.find(u => u.id === lead.assignedTo)?.name) || ''}</td>}
                {selectedColumns.includes('courseInterest') && <td className="px-3 py-2">{lead.courseInterest}</td>}
                {selectedColumns.includes('createdAt') && <td className="px-3 py-2">{lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ''}</td>}
                {selectedColumns.includes('updatedAt') && <td className="px-3 py-2">{lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : ''}</td>}
                {selectedColumns.includes('totalFees') && <td className="px-3 py-2">{lead.totalFees}</td>}
                {selectedColumns.includes('feesCollected') && <td className="px-3 py-2">{lead.feesCollected}</td>}
                <td className="px-3 py-2 flex gap-2 items-center" onClick={e => e.stopPropagation()}>
                  <button className="text-orange-500 hover:text-orange-700" onClick={() => setEditLead(lead)} title="Edit">
                    <span role="img" aria-label="edit">✏️</span>
                  </button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteLead(lead.id)} title="Delete">
                    <span role="img" aria-label="delete">🗑️</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* END LEADS TABLE */}
  
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Save Filter Modal */}
      {showSaveFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowSaveFilterModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4 text-maroon-800">Save Current Filter</h2>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 mb-4"
              placeholder="Filter Name"
              value={newFilterName}
              onChange={e => setNewFilterName(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-green-700 text-white rounded font-semibold w-full"
              onClick={handleSaveFilter}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}