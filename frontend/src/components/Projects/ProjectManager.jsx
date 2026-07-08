import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const loadProjects = () => {
    api.get('/projects').then((res) => setProjects(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, { name, description });
      } else {
        await api.post('/projects', { name, description });
      }
      resetForm();
      loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setName(project.name);
    setDescription(project.description);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    loadProjects();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border shadow-sm p-5 space-y-3">
        <h2 className="font-semibold">{editingId ? 'Edit Project' : 'Add Project / Category'}</h2>
        {error && <p className="bg-red-50 text-red-600 text-sm rounded-md p-2">{error}</p>}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name (e.g. Client A)"
          required
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full border rounded-md px-3 py-2"
        />
        <div className="flex gap-3">
          <button type="submit" className="bg-brand-600 text-white rounded-md px-4 py-2 font-medium">
            {editingId ? 'Save Changes' : 'Add Project'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="bg-gray-100 rounded-md px-4 py-2">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl border shadow-sm divide-y">
        {projects.map((p) => (
          <div key={p._id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">{p.description}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button onClick={() => handleEdit(p)} className="text-brand-600 font-medium">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="text-red-500 font-medium">Delete</button>
            </div>
          </div>
        ))}
        {!projects.length && <p className="p-4 text-sm text-gray-400">No projects yet.</p>}
      </div>
    </div>
  );
};

export default ProjectManager;
