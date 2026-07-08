const statusStyles = {
  submitted: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
};

const ReportCard = ({ report, onEdit }) => {
  const weekLabel = `${new Date(report.weekStartDate).toLocaleDateString()} - ${new Date(
    report.weekEndDate
  ).toLocaleDateString()}`;

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{weekLabel}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[report.status]}`}>
          {report.status}
        </span>
      </div>
      <p className="text-sm text-gray-500">Project: {report.project?.name || '—'}</p>
      <div className="text-sm">
        <p className="font-medium text-gray-700">Completed</p>
        <p className="text-gray-600 whitespace-pre-line">{report.tasksCompleted}</p>
      </div>
      <div className="text-sm">
        <p className="font-medium text-gray-700">Planned Next</p>
        <p className="text-gray-600 whitespace-pre-line">{report.tasksPlanned}</p>
      </div>
      {report.blockers && (
        <div className="text-sm">
          <p className="font-medium text-red-600">Blockers</p>
          <p className="text-gray-600 whitespace-pre-line">{report.blockers}</p>
        </div>
      )}
      <button onClick={() => onEdit(report)} className="text-brand-600 text-sm font-medium mt-2">
        Edit
      </button>
    </div>
  );
};

export default ReportCard;
