import React, { useState, useEffect } from 'react';
import { useCRM } from '../context/CRMContext';
import Papa from 'papaparse';
import { Lead } from '../types';
import toast from 'react-hot-toast';

export default function Followups() {
  const { state, dispatch, dbOperations } = useCRM();
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [dateType, setDateType] = useState<'on' | 'after' | 'before' | 'between'>('on');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  // Show all leads in followups, not just followup records
  const allLeads = state.leads || [];

  // Show all leads with a followUpDate set (not just by status)
  const followUpLeads = allLeads.filter(
    lead => !!lead.followUpDate
  );

  // Unique statuses and countries for dropdowns
  const statusOptions = ['All', ...Array.from(new Set(followUpLeads.map(l => l.status).filter(Boolean)))];
  const countryOptions = ['All', ...Array.from(new Set(followUpLeads.map(l => l.country).filter(Boolean)))];

  // Filtered follow-up leads
  const filteredFollowUpLeads = followUpLeads.filter(lead => {
    const term = searchTerm.trim().toLowerCase();
    const matchesCountry = countryFilter === 'All' || lead.country === countryFilter;
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSearch =
      !term ||
      (lead.fullName && lead.fullName.toLowerCase().includes(term)) ||
      (lead.email && lead.email.toLowerCase().includes(term)) ||
      (lead.phone && lead.phone.toLowerCase().includes(term)) ||
      (lead.status && lead.status.toLowerCase().includes(term));
    let matchesDate = true;
    // Use followUpDate for filtering
    if (dateType === 'on' && dateStart) {
      matchesDate = !!lead.followUpDate && lead.followUpDate.slice(0, 10) === dateStart;
    } else if (dateType === 'after' && dateStart) {
      matchesDate = !!lead.followUpDate && lead.followUpDate.slice(0, 10) > dateStart;
    } else if (dateType === 'before' && dateStart) {
      matchesDate = !!lead.followUpDate && lead.followUpDate.slice(0, 10) < dateStart;
    } else if (dateType === 'between' && dateStart && dateEnd) {
      matchesDate = !!lead.followUpDate &&
        lead.followUpDate.slice(0, 10) >= dateStart &&
        lead.followUpDate.slice(0, 10) <= dateEnd;
    }
    return matchesCountry && matchesStatus && matchesDate && matchesSearch;
  });

  // Export filtered follow-up leads as CSV
  const handleExport = () => {
    const exportData = filteredFollowUpLeads.map(lead => ({
      Name: lead.fullName,
      Status: lead.status,
      Phone: lead.phone,
      Country: lead.country,
      Qualification: lead.qualification,
      Source: lead.source,
      'Assigned To': (state.users.find(u => u.id === lead.assignedTo)?.name) || 'Unknown',
      'Created At': lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '',
      'Updated At': lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : '',
      Notes: (lead.notesList || []).map(note => `${note.date} / ${note.time}   ${note.text}`).join('\n\n')
    }));
    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `followups_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Columns to display (can be made selectable if needed)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'id',
    'fullName',
    'status',
    'phone',
    'country',
    'qualification',
    'source',
    'assignedTo',
    'createdAt',
    'updatedAt',
    'notes',
    'followUpDate',
  ]);

  // Helper for rendering checkboxes for column selection
  const columnOptions = [
    { value: 'id', label: 'ID' },
    { value: 'fullName', label: 'Name' },
    { value: 'status', label: 'Status' },
    { value: 'phone', label: 'Phone' },
    { value: 'country', label: 'Country' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'source', label: 'Source' },
    { value: 'assignedTo', label: 'Assigned To' },
    { value: 'createdAt', label: 'Created At' },
    { value: 'updatedAt', label: 'Updated At' },
    { value: 'notes', label: 'Notes' },
    { value: 'followUpDate', label: 'Follow Up Date' },
  ];

  // Helper for rendering dropdowns with checkboxes
  function MultiSelectBox({ label, options, selected, setSelected }: { label: string, options: string[], selected: string[], setSelected: (v: string[]) => void }) {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative min-w-[120px]">
        <button type="button" className="px-2 py-1 border border-gray-300 rounded-md text-xs bg-white w-full text-left" onClick={() => setOpen(o => !o)}>
          {label}: {selected.length === 0 ? 'All' : selected.join(', ')}
        </button>
        {open && (
          <div className="absolute z-20 bg-white border border-gray-300 rounded shadow p-2 mt-1 max-h-40 overflow-y-auto w-full">
            {options.map(opt => (
              <label key={opt} className="flex items-center gap-1 text-xs py-1">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={e => {
                    if (e.target.checked) setSelected([...selected, opt]);
                    else setSelected(selected.filter(s => s !== opt));
                  }}
                />
                {opt}
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }

  // State for multi-selects
  const [statusSelected, setStatusSelected] = useState<string[]>(statusFilter === 'All' ? [] : statusFilter.split(','));
  const [countrySelected, setCountrySelected] = useState<string[]>(countryFilter === 'All' ? [] : countryFilter.split(','));
  const [columnsSelected, setColumnsSelected] = useState<string[]>(selectedColumns);

  // State for selected leads (checkboxes)
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // State for lead details modal
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [detailNotes, setDetailNotes] = useState('');
  const [addNoteMode, setAddNoteMode] = useState(false);

  // Sync multi-selects with filters
  useEffect(() => {
    setStatusFilter(statusSelected.length === 0 ? 'All' : statusSelected.join(','));
  }, [statusSelected]);
  useEffect(() => {
    setCountryFilter(countrySelected.length === 0 ? 'All' : countrySelected.join(','));
  }, [countrySelected]);
  useEffect(() => {
    setSelectedColumns(columnsSelected);
  }, [columnsSelected]);

  // Add this function to update a lead in the backend using REST API
  async function updateLeadInBackend(lead: Lead) {
    try {
      await dbOperations.updateLead(lead.id, lead);
      return true;
    } catch {
      toast.error('Failed to save lead to backend');
      return false;
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-md text-sm w-36"
        />
        <MultiSelectBox label="Status" options={statusOptions} selected={statusSelected} setSelected={setStatusSelected} />
        <MultiSelectBox label="Country" options={countryOptions} selected={countrySelected} setSelected={setCountrySelected} />
        <MultiSelectBox label="Columns" options={columnOptions.map(c => c.label)} selected={columnsSelected.map(c => columnOptions.find(opt => opt.value === c)?.label || c)} setSelected={labels => setColumnsSelected(labels.map(l => columnOptions.find(opt => opt.label === l)?.value || l))} />
        <div className="flex flex-col text-xs">
          <label className="font-semibold mb-1">Date</label>
          <select
            value={dateType}
            onChange={e => setDateType(e.target.value as any)}
            className="px-2 py-1 border border-gray-300 rounded-md text-xs"
          >
            <option value="on">On</option>
            <option value="after">After</option>
            <option value="before">Before</option>
            <option value="between">Between</option>
          </select>
        </div>
        {(dateType === 'on' || dateType === 'after' || dateType === 'before') && (
          <input
            type="date"
            value={dateStart}
            onChange={e => setDateStart(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md text-xs w-28"
          />
        )}
        {dateType === 'between' && (
          <>
            <input
              type="date"
              value={dateStart}
              onChange={e => setDateStart(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-xs w-28"
              placeholder="Start Date"
            />
            <input
              type="date"
              value={dateEnd}
              onChange={e => setDateEnd(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-xs w-28"
              placeholder="End Date"
            />
          </>
        )}
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition text-xs h-8"
          onClick={handleExport}
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-4" style={{ maxHeight: 'calc(100vh - 320px)', overflowY: 'auto' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">
                <input type="checkbox" checked={selectedLeadIds.length === filteredFollowUpLeads.length && filteredFollowUpLeads.length > 0} onChange={e => setSelectedLeadIds(e.target.checked ? filteredFollowUpLeads.map(l => l.id) : [])} />
              </th>
              {selectedColumns.includes('id') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">ID</th>}
              {selectedColumns.includes('fullName') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Name</th>}
              {selectedColumns.includes('status') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Status</th>}
              {selectedColumns.includes('phone') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Phone</th>}
              {selectedColumns.includes('country') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Country</th>}
              {selectedColumns.includes('qualification') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Qualification</th>}
              {selectedColumns.includes('source') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Source</th>}
              {selectedColumns.includes('assignedTo') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Assigned To</th>}
              {selectedColumns.includes('createdAt') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Created At</th>}
              {selectedColumns.includes('updatedAt') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Updated At</th>}
              {selectedColumns.includes('notes') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Notes</th>}
              {selectedColumns.includes('followUpDate') && <th className="px-3 py-2 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-gray-300 bg-gray-100">Follow Up Date</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFollowUpLeads.length === 0 ? (
              <tr><td colSpan={selectedColumns.length + 1} className="text-gray-500 py-4 text-center">No follow-up leads found.</td></tr>
            ) : (
              filteredFollowUpLeads.map(lead => (
                <tr key={lead.id} className="hover:bg-violet-50 cursor-pointer" onClick={() => setDetailLead(lead)}>
                  <td className="px-3 py-2" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={selectedLeadIds.includes(lead.id)} onChange={e => {
                      setSelectedLeadIds(ids => e.target.checked ? [...ids, lead.id] : ids.filter(id => id !== lead.id));
                    }} />
                  </td>
                  {selectedColumns.includes('id') && <td className="px-3 py-2">{lead.id}</td>}
                  {selectedColumns.includes('fullName') && <td className="px-3 py-2 whitespace-pre-line">{lead.fullName}</td>}
                  {selectedColumns.includes('status') && <td className="px-3 py-2">{lead.status}</td>}
                  {selectedColumns.includes('phone') && <td className="px-3 py-2">{lead.phone}</td>}
                  {selectedColumns.includes('country') && <td className="px-3 py-2">{lead.country}</td>}
                  {selectedColumns.includes('qualification') && <td className="px-3 py-2">{lead.qualification}</td>}
                  {selectedColumns.includes('source') && <td className="px-3 py-2">{lead.source}</td>}
                  {selectedColumns.includes('assignedTo') && <td className="px-3 py-2">{(state.users.find(u => u.id === lead.assignedTo)?.name) || 'Unknown'}</td>}
                  {selectedColumns.includes('createdAt') && <td className="px-3 py-2">{lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ''}</td>}
                  {selectedColumns.includes('updatedAt') && <td className="px-3 py-2">{lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : ''}</td>}
                  {selectedColumns.includes('notes') && <td className="px-3 py-2 whitespace-pre-line max-w-xs break-words">{(lead.notesList || []).map(note => `${note.date} / ${note.time}   ${note.text}`).join('\n\n')}</td>}
                  {selectedColumns.includes('followUpDate') && <td className="px-3 py-2">{lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '—'}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
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
                  {countryOptions.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Qualification</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.qualification} onChange={e => setDetailLead({ ...detailLead, qualification: e.target.value })}>
                  <option value="">Select Qualification</option>
                  {[...new Set((state.leads || []).map(l => l.qualification).filter(Boolean))].map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Source</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.source} onChange={e => setDetailLead({ ...detailLead, source: e.target.value })}>
                  <option value="">Select Source</option>
                  {[...new Set((state.leads || []).map(l => l.source).filter(Boolean))].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course Interest</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.courseInterest} onChange={e => setDetailLead({ ...detailLead, courseInterest: e.target.value })}>
                  <option value="">Select Course</option>
                  {(state.courses || []).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.status} onChange={e => setDetailLead({ ...detailLead, status: e.target.value })}>
                  <option value="">Select Status</option>
                  {statusOptions.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Assigned To</label>
                <select className="w-full border rounded px-3 py-2" value={detailLead.assignedTo} onChange={e => setDetailLead({ ...detailLead, assignedTo: e.target.value })}>
                  <option value="">Select User</option>
                  {(state.users || []).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
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
                        onClick={async () => {
                          const now = new Date();
                          const date = now.toLocaleDateString();
                          const time = now.toLocaleTimeString();
                          const newNote = { text: detailNotes, date, time };
                          const updatedNotesList = Array.isArray(detailLead.notesList) ? [...detailLead.notesList, newNote] : [newNote];
                          const updatedLead = { ...detailLead, notesList: updatedNotesList };
                          setDetailLead(updatedLead);
                          dispatch({ type: 'UPDATE_LEAD', payload: updatedLead });
                          setDetailNotes('');
                          setAddNoteMode(false);
                          await updateLeadInBackend(updatedLead);
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
                onClick={async () => {
                  if (detailLead) {
                    // Save to backend
                    await updateLeadInBackend(detailLead);
                    // Update global state
                    dispatch({ type: 'UPDATE_LEAD', payload: detailLead });
                    toast.success('Lead details saved!');
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}