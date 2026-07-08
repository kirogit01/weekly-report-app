import ReportCard from './ReportCard';

const ReportList = ({ reports, onEdit }) => {
  if (!reports.length) {
    return <p className="text-gray-400 text-sm">No reports yet. Create your first one above.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {reports.map((r) => (
        <ReportCard key={r._id} report={r} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default ReportList;
