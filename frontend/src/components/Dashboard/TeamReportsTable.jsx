const statusStyles = {
  submitted: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-gray-100 text-gray-500',
};

const TeamReportsTable = ({ reports }) => (
  <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 text-left text-gray-500">
        <tr>
          <th className="p-3">Member</th>
          <th className="p-3">Week</th>
          <th className="p-3">Project</th>
          <th className="p-3">Status</th>
          <th className="p-3">Hours</th>
          <th className="p-3">Blockers</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {reports.map((r) => (
          <tr key={r._id}>
            <td className="p-3 font-medium">{r.user?.name}</td>
            <td className="p-3">{new Date(r.weekStartDate).toLocaleDateString()}</td>
            <td className="p-3">{r.project?.name}</td>
            <td className="p-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[r.status]}`}>
                {r.status}
              </span>
            </td>
            <td className="p-3">{r.hoursWorked ?? '—'}</td>
            <td className="p-3 text-red-600">{r.blockers ? 'Yes' : '—'}</td>
          </tr>
        ))}
        {!reports.length && (
          <tr>
            <td colSpan={6} className="p-4 text-center text-gray-400">No reports match these filters.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default TeamReportsTable;
