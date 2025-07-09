import React, { useState } from 'react';
import { Followup } from '../types/followup';

interface FollowupFormProps {
  onSubmit: (followup: Omit<Followup, 'id' | 'createdAt'>) => void;
}

const initialState = {
  name: '',
  phone: '',
  email: '',
  qualification: '',
  country: '',
  source: ''    
};

export default function FollowupForm({ onSubmit }: FollowupFormProps) {
  const [form, setForm] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(initialState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="input" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" className="input" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email ID" className="input" required />
      <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification" className="input" required />
      <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="input" required />
      <input name="source" value={form.source} onChange={handleChange} placeholder="Source" className="input" required />
      <button type="submit" className="btn btn-primary w-full">Add Followup</button>
    </form>
  );
}
