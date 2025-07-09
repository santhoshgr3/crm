import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Papa from 'papaparse';

const feesTypeOptions = [
  'Full Payment',
  'Part Payment',
  'Loan'
];

export default function SalesReport() {
  const [leads, setLeads] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    date: '',
    name: '',
    phone: '',
    email: '',
    country: '',
    qualification: '',
    course: '',
    fees: '',
    feesType: feesTypeOptions[0],
    feesCollected: '',
    note: ''
  });
  const [saving, setSaving] = useState(false);

  // Fetch leads from backend
  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + '/api/leads')
      .then(res => res.json())
      .then(data => setLeads(data));
  }, []);

  // Filter leads with status 'Admission Done'
  const salesLeads = (leads || []).filter(lead => lead.status === 'Admission Done');

  // Get counselor name for a lead (if you have users, fetch and use them here)
  const getCounselorName = (lead: any) => lead.assignedToName || '';

  // Export sales report as CSV
  const handleExport = () => {
    const exportData = salesLeads.map(lead => ({
      Date: lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : '',
      Name: lead.fullName,
      'Counselor Name': getCounselorName(lead),
      Phone: lead.phone,
      Email: lead.email,
      Country: lead.country,
      Qualification: lead.qualification,
      Course: lead.courseInterest,
      Fees: lead.fees || '',
      'Fees Type': lead.feesType || '',
      'Fees Collected': lead.feesCollected || '',
      Note: lead.note || ''
    }));
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sales_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // TODO: Save new sale to database (implement as needed)
  const handleAddSale = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Implement backend POST here if needed
    setSaving(false);
    setShowModal(false);
    setForm({
      date: '', name: '', phone: '', email: '', country: '', qualification: '', course: '', fees: '', feesType: feesTypeOptions[0], feesCollected: '', note: ''
    });
    // Optionally re-fetch leads
    fetch(import.meta.env.VITE_API_BASE_URL + '/api/leads')
      .then(res => res.json())
      .then(data => setLeads(data));
  };

  // Filter state for admissions
  const [admissionDateType, setAdmissionDateType] = useState<'on' | 'after' | 'before' | 'between' | ''>('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [admissionDateFrom, setAdmissionDateFrom] = useState('');
  const [admissionDateTo, setAdmissionDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtered sales leads
  const filteredSalesLeads = salesLeads.filter(lead => {
    // Admission date filter (uses updatedAt)
    const dateStr = lead.updatedAt ? lead.updatedAt.slice(0, 10) : '';
    let matchesDate = true;
    if (admissionDateType === 'on' && admissionDate) matchesDate = dateStr === admissionDate;
    else if (admissionDateType === 'before' && admissionDate) matchesDate = dateStr < admissionDate;
    else if (admissionDateType === 'after' && admissionDate) matchesDate = dateStr > admissionDate;
    else if (admissionDateType === 'between' && admissionDateFrom && admissionDateTo) matchesDate = dateStr >= admissionDateFrom && dateStr <= admissionDateTo;
    // Search filter
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      (lead.fullName && lead.fullName.toLowerCase().includes(term)) ||
      (lead.email && lead.email.toLowerCase().includes(term)) ||
      (lead.phone && lead.phone.toLowerCase().includes(term)) ||
      (lead.country && lead.country.toLowerCase().includes(term)) ||
      (lead.qualification && lead.qualification.toLowerCase().includes(term)) ||
      (lead.courseInterest && lead.courseInterest.toLowerCase().includes(term)) ||
      (lead.status && lead.status.toLowerCase().includes(term));
    return matchesDate && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sales Report</h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition"
            onClick={handleExport}
          >
            Export CSV
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded font-semibold shadow hover:bg-green-700 transition"
            onClick={() => setShowModal(true)}
          >
            <Plus className="inline-block mr-1" /> Add Sale
          </button>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        {/* Admission Date Filter */}
        <div>
          <label className="block text-xs font-semibold mb-1">Admission Date</label>
          <select
            className="px-2 py-2 rounded border border-blue-300 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-200"
            value={admissionDateType}
            onChange={e => setAdmissionDateType(e.target.value as any)}
          >
            <option value="">-- No Filter --</option>
            <option value="on">On</option>
            <option value="before">Before</option>
            <option value="after">After</option>
            <option value="between">Between</option>
          </select>
        </div>
        {admissionDateType === 'on' && (
          <div>
            <label className="block text-xs font-semibold mb-1">Date</label>
            <input type="date" className="px-2 py-2 rounded border border-blue-300" value={admissionDate} onChange={e => setAdmissionDate(e.target.value)} />
          </div>
        )}
        {admissionDateType === 'before' && (
          <div>
            <label className="block text-xs font-semibold mb-1">Before</label>
            <input type="date" className="px-2 py-2 rounded border border-blue-300" value={admissionDate} onChange={e => setAdmissionDate(e.target.value)} />
          </div>
        )}
        {admissionDateType === 'after' && (
          <div>
            <label className="block text-xs font-semibold mb-1">After</label>
            <input type="date" className="px-2 py-2 rounded border border-blue-300" value={admissionDate} onChange={e => setAdmissionDate(e.target.value)} />
          </div>
        )}
        {admissionDateType === 'between' && (
          <>
            <div>
              <label className="block text-xs font-semibold mb-1">From</label>
              <input type="date" className="px-2 py-2 rounded border border-blue-300" value={admissionDateFrom} onChange={e => setAdmissionDateFrom(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">To</label>
              <input type="date" className="px-2 py-2 rounded border border-blue-300" value={admissionDateTo} onChange={e => setAdmissionDateTo(e.target.value)} />
            </div>
          </>
        )}
        {/* Search Bar */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold mb-1">Search</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded border-blue-300"
            placeholder="Search by name, email, phone, course, etc."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Counselor Name</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Qualification</th>
              <th className="px-4 py-2">Course</th>
              <th className="px-4 py-2">Fees</th>
              <th className="px-4 py-2">Fees Type</th>
              <th className="px-4 py-2">Fees Collected</th>
              <th className="px-4 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalesLeads.map(lead => (
              <tr key={lead.id}>
                <td className="border px-4 py-2">{lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : ''}</td>
                <td className="border px-4 py-2">{lead.fullName}</td>
                <td className="border px-4 py-2">{getCounselorName(lead)}</td>
                <td className="border px-4 py-2">{lead.phone}</td>
                <td className="border px-4 py-2">{lead.email}</td>
                <td className="border px-4 py-2">{lead.country}</td>
                <td className="border px-4 py-2">{lead.qualification}</td>
                <td className="border px-4 py-2">{lead.courseInterest}</td>
                <td className="border px-4 py-2">{lead.fees || ''}</td>
                <td className="border px-4 py-2">{lead.feesType || ''}</td>
                <td className="border px-4 py-2">{lead.feesCollected || ''}</td>
                <td className="border px-4 py-2">{lead.note || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Add Sale</h2>
            <form onSubmit={handleAddSale} className="space-y-4">
              <input className="w-full border rounded px-3 py-2" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
              <input className="w-full border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
              <input className="w-full border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required />
              <input className="w-full border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
              <input className="w-full border rounded px-3 py-2" placeholder="Country" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} required />
              <input className="w-full border rounded px-3 py-2" placeholder="Qualification" value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} required />
              <input className="w-full border rounded px-3 py-2" placeholder="Course" value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))} required />
              <input className="w-full border rounded px-3 py-2" placeholder="Fees" value={form.fees} onChange={e => setForm(f => ({ ...f, fees: e.target.value }))} required />
              <select className="w-full border rounded px-3 py-2" value={form.feesType} onChange={e => setForm(f => ({ ...f, feesType: e.target.value }))} required>
                {feesTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <input className="w-full border rounded px-3 py-2" placeholder="Fees Collected" value={form.feesCollected} onChange={e => setForm(f => ({ ...f, feesCollected: e.target.value }))} required />
              <textarea className="w-full border rounded px-3 py-2" placeholder="Note" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={saving}>{saving ? 'Saving...' : 'Add Sale'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
