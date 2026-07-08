const ActivityFeed = ({ activity }) => (
  <div className="bg-white rounded-xl border shadow-sm p-5">
    <h3 className="font-semibold mb-4">Recent Activity</h3>
    <ul className="space-y-3">
      {activity.map((r) => (
        <li key={r._id} className="text-sm border-b last:border-0 pb-2">
          <span className="font-medium">{r.user?.name}</span> submitted a report for{' '}
          <span className="font-medium">{r.project?.name}</span>
          <span className="text-gray-400"> • {new Date(r.submittedAt).toLocaleDateString()}</span>
        </li>
      ))}
      {!activity.length && <p className="text-gray-400 text-sm">No activity yet.</p>}
    </ul>
  </div>
);

export default ActivityFeed;
