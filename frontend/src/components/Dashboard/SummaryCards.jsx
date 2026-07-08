const Card = ({ label, value, accent }) => (
  <div className="bg-white rounded-xl border shadow-sm p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`text-3xl font-semibold mt-1 ${accent || 'text-gray-900'}`}>{value}</p>
  </div>
);

const SummaryCards = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card label="Reports Submitted" value={summary.totalReportsSubmitted} />
      <Card
        label="Compliance Rate"
        value={`${summary.complianceRate}%`}
        accent={summary.complianceRate >= 80 ? 'text-green-600' : 'text-yellow-600'}
      />
      <Card label="Pending" value={summary.pendingCount} accent="text-yellow-600" />
      <Card label="Open Blockers" value={summary.openBlockers} accent="text-red-600" />
    </div>
  );
};

export default SummaryCards;
