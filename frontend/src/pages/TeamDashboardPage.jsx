import { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import SummaryCards from '../components/Dashboard/SummaryCards';
import TasksTrendChart from '../components/Dashboard/Charts/TasksTrendChart';
import SubmissionStatusChart from '../components/Dashboard/Charts/SubmissionStatusChart';
import WorkloadChart from '../components/Dashboard/Charts/WorkloadChart';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import TeamReportsTable from '../components/Dashboard/TeamReportsTable';
import api from '../api/axios';

const TeamDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [tasksTrend, setTasksTrend] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [activity, setActivity] = useState([]);
  const [teamReports, setTeamReports] = useState([]);
  const [projects, setProjects] = useState([]);

  const [filters, setFilters] = useState({ week: '', project: '', member: '' });

  const loadDashboard = () => {
    api.get('/dashboard/summary', { params: { week: filters.week || undefined } }).then((r) => setSummary(r.data));
    api.get('/dashboard/charts/tasks-trend').then((r) => setTasksTrend(r.data));
    api.get('/dashboard/charts/submission-status', { params: { week: filters.week || undefined } }).then((r) => setSubmissionStatus(r.data));
    api.get('/dashboard/charts/workload-by-project').then((r) => setWorkload(r.data));
    api.get('/dashboard/activity').then((r) => setActivity(r.data));
    api.get('/reports/team', { params: filters }).then((r) => setTeamReports(r.data));
  };

  useEffect(() => {
    api.get('/projects').then((r) => setProjects(r.data));
  }, []);

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold">Team Dashboard</h1>

        <SummaryCards summary={summary} />

        <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium mb-1">Week Start</label>
            <input
              type="date"
              value={filters.week}
              onChange={(e) => setFilters({ ...filters, week: e.target.value })}
              className="border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Project</label>
            <select
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
              className="border rounded-md px-3 py-2"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setFilters({ week: '', project: '', member: '' })}
            className="bg-gray-100 rounded-md px-4 py-2 text-sm"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <TasksTrendChart data={tasksTrend} />
          <SubmissionStatusChart data={submissionStatus} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <WorkloadChart data={workload} />
          <ActivityFeed activity={activity} />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">All Team Reports</h2>
          <TeamReportsTable reports={teamReports} />
        </div>
      </div>
    </div>
  );
};

export default TeamDashboardPage;
