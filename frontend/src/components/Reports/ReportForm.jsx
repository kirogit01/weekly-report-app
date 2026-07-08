import { useState, useEffect } from 'react';
import api from '../../api/axios';

// Fixed structure — same fields, same order, for every user. Do not let this
// be reordered or extended per-user; that consistency is what makes the
// manager dashboard comparable across the team.
const emptyForm = {
  weekStartDate: '',
  weekEndDate: '',
  project: '',
  tasksCompleted: '',
  tasksPlanned: '',
  blockers: '',
  hoursWorked: '',
  notes: '',
};

const ReportForm = ({ existingReport, onSaved }) => {
  const [form, setForm] = useState(emptyForm);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get('/projects').then((res) => setProjects(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (existingReport) {
      setForm({
        weekStartDate: existingReport.weekStartDate?.slice(0, 10) || '',
        weekEndDate: existingReport.weekEndDate?.slice(0, 10) || '',
        project: existingReport.project?._id || existingReport.project || '',
        tasksCompleted: existingReport.tasksCompleted || '',
        tasksPlanned: existingReport.tasksPlanned || '',
        blockers: existingReport.blockers || '',
        hoursWorked: existingReport.hoursWorked || '',
        notes: existingReport.notes || '',
      });
    }
  }, [existingReport]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (status) => {
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form, status, hoursWorked: form.hoursWorked ? Number(form.hoursWorked) : undefined };

      if (existingReport) {
        await api.put(`/reports/${existingReport._id}`, payload);
      } else {
        await api.post('/reports', payload);
      }
      setForm(emptyForm);
      onSaved?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        {existingReport ? 'Edit Weekly Report' : 'New Weekly Report'}
      </h2>

      {error && <p className="bg-red-50 text-red-600 text-sm rounded-md p-2">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Week Start</label>
          <input
            type="date"
            name="weekStartDate"
            value={form.weekStartDate}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Week End</label>
          <input
            type="date"
            name="weekEndDate"
            value={form.weekEndDate}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Project / Category</label>
        <select
          name="project"
          value={form.project}
          onChange={handleChange}
          required
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">Select a project...</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tasks Completed</label>
        <textarea
          name="tasksCompleted"
          value={form.tasksCompleted}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tasks Planned for Next Week</label>
        <textarea
          name="tasksPlanned"
          value={form.tasksPlanned}
          onChange={handleChange}
          required
          rows={3}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Blockers / Challenges</label>
        <textarea
          name="blockers"
          value={form.blockers}
          onChange={handleChange}
          rows={2}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hours Worked (optional)</label>
          <input
            type="number"
            name="hoursWorked"
            min="0"
            max="168"
            value={form.hoursWorked}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Notes / Links (optional)</label>
          <input
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => submit('draft')}
          disabled={submitting}
          className="bg-gray-100 hover:bg-gray-200 rounded-md px-4 py-2 font-medium disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          onClick={() => submit('submitted')}
          disabled={submitting}
          className="bg-brand-600 hover:bg-brand-700 text-white rounded-md px-4 py-2 font-medium disabled:opacity-50"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
};

export default ReportForm;
