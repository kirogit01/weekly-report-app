import { useState, useEffect } from 'react';
import Navbar from '../components/Layout/Navbar';
import ReportForm from '../components/Reports/ReportForm';
import ReportList from '../components/Reports/ReportList';
import api from '../api/axios';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);

  const loadReports = () => {
    api.get('/reports/mine').then((res) => setReports(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSaved = () => {
    setEditingReport(null);
    loadReports();
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <h1 className="text-2xl font-semibold">My Weekly Reports</h1>
        <ReportForm existingReport={editingReport} onSaved={handleSaved} />
        <div>
          <h2 className="text-lg font-semibold mb-3">Report History</h2>
          <ReportList reports={reports} onEdit={setEditingReport} />
        </div>
      </div>
    </div>
  );
};

export default MyReportsPage;
