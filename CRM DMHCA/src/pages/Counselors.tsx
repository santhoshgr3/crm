import React, { useState } from 'react';
import { Plus, Mail, Phone, User } from 'lucide-react';
import { useCRM } from '../context/CRMContext';
import { User as CRMUser, UserRole } from '../types';
import Papa from 'papaparse';

const roleLabels: Record<UserRole, string> = {
  senior_manager: 'Senior Manager',
  manager: 'Manager',
  floor_manager: 'Floor Manager',
  team_leader: 'Team Leader',
  counselor: 'Counselor',
};

// Helper: role hierarchy from highest to lowest
const roleHierarchy: UserRole[] = [
  'senior_manager',
  'manager',
  'floor_manager',
  'team_leader',
  'counselor',
];

// Helper: get roles current user can add
function getAddableRoles(currentRole: UserRole): UserRole[] {
  switch (currentRole) {
    case 'senior_manager':
      return roleHierarchy; // can add all
    case 'manager':
      return roleHierarchy.slice(1); // can add all except senior_manager
    case 'floor_manager':
      return roleHierarchy.slice(2); // can add all below floor_manager
    case 'team_leader':
      return ['counselor'];
    default:
      return [];
  }
}

// Helper: get reporting line for a user (from basic to high)
function getReportingLine(user: CRMUser, users: CRMUser[]): CRMUser[] {
  const line: CRMUser[] = [];
  let current = user;
  while (current.reportsTo) {
    const manager = users.find(u => u.id === current.reportsTo);
    if (!manager) break;
    line.unshift(manager);
    current = manager;
  }
  return line;
}

export default function UsersPage() {
  const { state, dbOperations } = useCRM();
  const currentUser = state.currentUser;
  const addableRoles = getAddableRoles(currentUser.role);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: addableRoles[0] || 'counselor',
    reportsTo: currentUser.id,
    department: '',
    preferredLanguage: 'en',
    whatsappNumber: '',
    username: '',
    password: '',
    branch: 'Hyderabad', // default branch
  });
  const [saving, setSaving] = useState(false);

  // Department management
  const [departments, setDepartments] = useState<string[]>(["Sales", "Support", "Marketing"]);
  const [newDepartment, setNewDepartment] = useState("");
  const [showDeptInput, setShowDeptInput] = useState(false);

  const [selectedBranch, setSelectedBranch] = useState('Hyderabad');
  const branchOptions = ['Hyderabad', 'Delhi', 'Kashmir'];

  // Branch and filter logic
  const isAllBranches = !selectedBranch;
  const myRoleIdx = roleHierarchy.indexOf(currentUser.role);

  // Role-based user visibility logic
  let visibleUsers: CRMUser[] = [];
  if (currentUser.role === 'counselor') {
    // Counselors see only themselves
    visibleUsers = [(state.users || []).find((u: CRMUser) => u.id === currentUser.id)].filter(Boolean) as CRMUser[];
  } else if (currentUser.role === 'team_leader') {
    // Team leaders see themselves and their direct reports
    visibleUsers = (state.users || []).filter(
      (u: CRMUser) => u.id === currentUser.id || u.reportsTo === currentUser.id
    );
  } else {
    // Other roles: existing logic (by hierarchy and branch)
    visibleUsers = (state.users || []).filter(
      (u: CRMUser) => roleHierarchy.indexOf(u.role) >= myRoleIdx && (isAllBranches || u.branch === selectedBranch)
    );
  }

  // Only show users managed by current user (direct reports)
  const managedUsers = (state.users || []).filter(
    (u: CRMUser) => u.reportsTo === currentUser.id && addableRoles.includes(u.role)
  );

  // Branch analysis (aggregate if all branches)
  const branchUsers = (state.users || []).filter((u: CRMUser) => (isAllBranches || u.branch === selectedBranch) && roleHierarchy.indexOf(u.role) >= myRoleIdx);
  const branchLeads = (state.leads || []).filter(lead => branchUsers.some(u => u.id === lead.assignedTo));
  const branchConversions = branchLeads.filter(lead => lead.status === 'Converted').length;
  const branchHotLeads = branchLeads.filter(lead => lead.status === 'Hot').length;
  const branchAdmissions = branchLeads.filter(lead => lead.status === 'Admitted').length;
  const branchConversionRate = branchLeads.length > 0 ? Math.round((branchConversions / branchLeads.length) * 100) : 0;

  const getUserStats = (userId: string) => {
    const leads = (state.leads || []).filter(lead => lead.assignedTo === userId);
    const conversions = leads.filter(lead => lead.status === 'Converted').length;
    const hotLeads = leads.filter(lead => lead.status === 'Hot').length;
    return {
      totalLeads: leads.length,
      conversions,
      hotLeads,
      conversionRate: leads.length > 0 ? Math.round((conversions / leads.length) * 100) : 0
    };
  };

  // Export branch data as CSV
  const handleExportBranch = () => {
    const exportData = branchUsers.map(user => {
      const userLeads = branchLeads.filter(lead => lead.assignedTo === user.id);
      const conversions = userLeads.filter(lead => lead.status === 'Converted').length;
      const hotLeads = userLeads.filter(lead => lead.status === 'Hot').length;
      const conversionRate = userLeads.length > 0 ? Math.round((conversions / userLeads.length) * 100) : 0;
      return {
        Name: user.name,
        Email: user.email,
        Phone: user.phone,
        Role: roleLabels[user.role],
        Branch: user.branch,
        Department: user.department || '',
        'Preferred Language': user.preferredLanguage || '',
        'WhatsApp Number': user.whatsappNumber || '',
        Leads: userLeads.length,
        'Lead Names': userLeads.map(l => l.fullName).join(', '),
        'Hot Leads': hotLeads,
        'Conversions': conversions,
        'Conversion Rate (%)': conversionRate
      };
    });
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${selectedBranch}_branch_analysis_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [leadDateFilterType, setLeadDateFilterType] = useState<'on' | 'before' | 'after' | 'between' | ''>('');
  const [leadDate, setLeadDate] = useState('');
  const [leadDateFrom, setLeadDateFrom] = useState('');
  const [leadDateTo, setLeadDateTo] = useState('');
  const [search, setSearch] = useState('');

  // Filtered users based on search and lead modified date
  const filteredUsers = visibleUsers.filter((user: CRMUser) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.phone && user.phone.toLowerCase().includes(term)) ||
      (user.branch && user.branch.toLowerCase().includes(term)) ||
      (user.department && user.department.toLowerCase().includes(term));
    if (!matchesSearch) return false;
    // Lead modified date filter
    if (leadDateFilterType && state.leads && state.leads.length > 0) {
      const userLeads = state.leads.filter(lead => lead.assignedTo === user.id);
      if (userLeads.length === 0) return false;
      const match = userLeads.some(lead => {
        if (!lead.modifiedAt) return false;
        const mod = new Date(lead.modifiedAt);
        if (leadDateFilterType === 'on') {
          return mod.toISOString().slice(0, 10) === leadDate;
        } else if (leadDateFilterType === 'before') {
          return mod < new Date(leadDate);
        } else if (leadDateFilterType === 'after') {
          return mod > new Date(leadDate);
        } else if (leadDateFilterType === 'between') {
          return mod >= new Date(leadDateFrom) && mod <= new Date(leadDateTo);
        }
        return true;
      });
      if (!match) return false;
    }
    return true;
  });

  // --- Tree Map/Org Chart Logic ---
  // Build a map of users by id for quick lookup
  const usersById = Object.fromEntries((state.users || []).map(u => [u.id, u]));
  // Build children map: userId -> direct reports
  const childrenMap: Record<string, CRMUser[]> = {};
  (state.users || []).forEach(u => {
    if (u.reportsTo) {
      if (!childrenMap[u.reportsTo]) childrenMap[u.reportsTo] = [];
      childrenMap[u.reportsTo].push(u);
    }
  });
  // Find top-level users (senior managers)
  const topManagers = (state.users || []).filter(u => u.role === 'senior_manager');

  function renderTree(user: CRMUser, level = 0) {
    return (
      <div key={user.id} className={`p-2 m-2 border rounded-lg shadow bg-white min-w-[220px]` + (level === 0 ? ' border-blue-600 bg-blue-50' : '')}>
        <div className="font-bold text-blue-900 text-base flex items-center gap-2">
          {user.name}
          <span className="text-xs font-semibold text-blue-500">({roleLabels[user.role]})</span>
        </div>
        <div className="text-xs text-gray-500 mb-1">{user.email}</div>
        {childrenMap[user.id] && (
          <div className="flex flex-wrap gap-4 mt-2 pl-4 border-l-2 border-blue-200">
            {childrenMap[user.id].map(child => renderTree(child, level + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{roleLabels[currentUser.role]} Management</h1>
          <p className="text-gray-600 mt-1">Manage {addableRoles.length ? addableRoles.map(r => roleLabels[r]).join(', ') : 'No'} profiles and performance</p>
        </div>
        {addableRoles.length > 0 && (
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </button>
        )}
      </div>
      {/* Branch, Date, and Search Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-end">
        {/* Branch Filter */}
        <div>
          <label className="block text-xs font-semibold mb-1">Branch</label>
          <select
            className="px-4 py-2 rounded font-semibold border border-blue-300 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-200"
            value={selectedBranch}
            onChange={e => setSelectedBranch(e.target.value)}
          >
            <option value="">All Branches</option>
            {branchOptions.map(branch => (
              <option key={branch} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        {/* Lead Modified Date Filter */}
        <div>
          <label className="block text-xs font-semibold mb-1">Lead Modified</label>
          <select
            className="px-2 py-2 rounded border border-blue-300 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-200"
            value={leadDateFilterType}
            onChange={e => setLeadDateFilterType(e.target.value as any)}
          >
            <option value="">-- No Filter --</option>
            <option value="on">On</option>
            <option value="before">Before</option>
            <option value="after">After</option>
            <option value="between">Between</option>
          </select>
        </div>
        {leadDateFilterType === 'on' && (
          <div>
            <label className="block text-xs font-semibold mb-1">Date</label>
            <input type="date" className="px-2 py-2 rounded border border-blue-300" value={leadDate} onChange={e => setLeadDate(e.target.value)} />
          </div>
        )}
        {leadDateFilterType === 'before' && (
          <div>
            <label className="block text-xs font-semibold mb-1">Before</label>
            <input type="date" className="px-2 py-2 rounded border border-blue-300" value={leadDate} onChange={e => setLeadDate(e.target.value)} />
          </div>
        )}
        {leadDateFilterType === 'after' && (
          <div>
            <label className="block text-xs font-semibold mb-1">After</label>
            <input type="date" className="px-2 py-2 rounded border border-blue-300" value={leadDate} onChange={e => setLeadDate(e.target.value)} />
          </div>
        )}
        {leadDateFilterType === 'between' && (
          <>
            <div>
              <label className="block text-xs font-semibold mb-1">From</label>
              <input type="date" className="px-2 py-2 rounded border border-blue-300" value={leadDateFrom} onChange={e => setLeadDateFrom(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">To</label>
              <input type="date" className="px-2 py-2 rounded border border-blue-300" value={leadDateTo} onChange={e => setLeadDateTo(e.target.value)} />
            </div>
          </>
        )}
        {/* Search Bar */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold mb-1">Search</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded border-blue-300"
            placeholder="Search by name, email, or phone"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>
      {/* Add Member Modal */}
      {showModal && addableRoles.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full h-full max-w-3xl max-h-screen overflow-auto relative flex flex-col justify-center">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-bold" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-center">Add Member</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setSaving(true);
              try {
                await dbOperations.addUser({
                  ...form,
                  isActive: true
                });
                setShowModal(false);
                setForm({ name: '', email: '', phone: '', role: addableRoles[0] || 'counselor', reportsTo: '', department: '', preferredLanguage: 'en', whatsappNumber: '', username: '', password: '', branch: selectedBranch });
              } catch (err) {
                alert('Failed to add user');
              } finally {
                setSaving(false);
              }
            }} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="w-full border rounded px-3 py-2" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input className="w-full border rounded px-3 py-2" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-lg font-bold mb-2">Reports To</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {(state.users || [])
                    .filter(u => ['team_leader', 'floor_manager', 'manager', 'senior_manager'].includes(u.role))
                    .map(u => (
                      <button
                        type="button"
                        key={u.id}
                        className={`w-full rounded-lg border-2 px-6 py-5 flex flex-col items-center shadow transition-all duration-200 cursor-pointer
                          ${form.reportsTo === u.id ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-300' : 'border-gray-300 bg-white hover:border-blue-400'}`}
                        onClick={() => setForm(f => ({ ...f, reportsTo: u.id }))}
                      >
                        <span className="text-lg font-semibold text-gray-900 mb-1">{u.name}</span>
                        <span className="text-sm font-medium text-blue-700">{roleLabels[u.role]}</span>
                      </button>
                    ))}
                </div>
                {/* Dropdown option for Reports To */}
                <select
                  className="w-full border-2 border-blue-300 rounded px-4 py-3 text-base font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                  value={form.reportsTo}
                  onChange={e => setForm(f => ({ ...f, reportsTo: e.target.value }))}
                  required
                >
                  <option value="">Select reporting manager</option>
                  {(state.users || [])
                    .filter(u => ['team_leader', 'floor_manager', 'manager', 'senior_manager'].includes(u.role))
                    .map(u => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({roleLabels[u.role]})
                      </option>
                    ))}
                </select>
                {form.reportsTo === '' && <p className="text-red-600 text-sm font-semibold">Please select a reporting manager.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <select
                  className="w-full border rounded px-3 py-2 mb-2"
                  value={form.department}
                  onChange={e => {
                    if (e.target.value === "__add_new__") {
                      setShowDeptInput(true);
                      setForm(f => ({ ...f, department: "" }));
                    } else {
                      setForm(f => ({ ...f, department: e.target.value }));
                      setShowDeptInput(false);
                    }
                  }}
                  required
                >
                  <option value="">Select department</option>
                  {departments.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                  <option value="__add_new__">+ Add new department</option>
                </select>
                {showDeptInput && (
                  <div className="flex gap-2 mt-1">
                    <input
                      className="w-full border rounded px-3 py-2"
                      placeholder="New department name"
                      value={newDepartment}
                      onChange={e => setNewDepartment(e.target.value)}
                    />
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-3 py-2 rounded"
                      onClick={() => {
                        if (newDepartment && !departments.includes(newDepartment)) {
                          setDepartments([...departments, newDepartment]);
                          setForm(f => ({ ...f, department: newDepartment }));
                          setShowDeptInput(false);
                          setNewDepartment("");
                        }
                      }}
                    >Add</button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Language</label>
                <input className="w-full border rounded px-3 py-2" value={form.preferredLanguage} onChange={e => setForm(f => ({ ...f, preferredLanguage: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
                <input className="w-full border rounded px-3 py-2" value={form.whatsappNumber} onChange={e => setForm(f => ({ ...f, whatsappNumber: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select className="w-full border rounded px-3 py-2" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as UserRole }))} required>
                  {addableRoles.map(role => (
                    <option key={role} value={role}>{roleLabels[role]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Username</label>
                <input className="w-full border rounded px-3 py-2" value={form.username || ''} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input className="w-full border rounded px-3 py-2" type="password" value={form.password || ''} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Branch</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={form.branch}
                  onChange={e => setForm(f => ({ ...f, branch: e.target.value }))}
                  required
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kashmir">Kashmir</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded text-lg font-bold hover:bg-blue-700" disabled={saving}>{saving ? 'Saving...' : 'Add Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Org Chart/Tree Map Display */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Organization Structure</h2>
        <div className="flex flex-wrap gap-8">
          {topManagers.map(mgr => renderTree(mgr))}
        </div>
      </div>
      {/* Branch Analysis Summary */}
      <div className="mb-8 flex items-center justify-between">
        <div className="grid grid-cols-5 gap-4 w-full max-w-5xl mx-auto">
          <div className="bg-blue-50 rounded-lg p-3 text-center min-w-[120px]">
            <div className="text-xl font-bold text-blue-700">{branchUsers.length}</div>
            <div className="text-xs text-gray-600 mt-1">Members</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center min-w-[120px]">
            <div className="text-xl font-bold text-green-700">{branchLeads.length}</div>
            <div className="text-xs text-gray-600 mt-1">Leads</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center min-w-[120px]">
            <div className="text-xl font-bold text-yellow-700">{branchHotLeads}</div>
            <div className="text-xs text-gray-600 mt-1">Hot Leads</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center min-w-[120px]">
            <div className="text-xl font-bold text-purple-700">{branchConversionRate}%</div>
            <div className="text-xs text-gray-600 mt-1">Conversion Rate</div>
          </div>
          <div className="bg-pink-50 rounded-lg p-3 text-center min-w-[120px]">
            <div className="text-xl font-bold text-pink-700">{branchAdmissions}</div>
            <div className="text-xs text-gray-600 mt-1">Admissions</div>
          </div>
        </div>
        <button
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition"
          onClick={handleExportBranch}
        >
          Export CSV
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user: CRMUser) => {
          const stats = getUserStats(user.id);
          const reportingLine = getReportingLine(user, state.users || []);
          return (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-gray-900">{user.name}</div>
                  <div className="text-gray-500 text-sm">{roleLabels[user.role]}</div>
                  <div className="text-xs text-blue-600 font-semibold mt-1">Branch: {user.branch}</div>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.phone}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 mb-2">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Reporting Line</h4>
                <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                  {reportingLine.length === 0 ? <span>—</span> : reportingLine.map((mgr, idx) => (
                    <span key={mgr.id} className="bg-gray-100 px-2 py-1 rounded">
                      {roleLabels[mgr.role]}: {mgr.name}
                      {idx < reportingLine.length - 1 && <span className="mx-1">→</span>}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Performance Stats</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.totalLeads}</p>
                    <p className="text-xs text-gray-500">Total Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.conversions}</p>
                    <p className="text-xs text-gray-500">Conversions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{stats.hotLeads}</p>
                    <p className="text-xs text-gray-500">Hot Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</p>
                    <p className="text-xs text-gray-500">Conv. Rate</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}